import prompts from 'prompts';
import { TestConfig } from '../setup-config';
import API from '../../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigPositionStatus = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.positionStatus) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message:
        'The test position status exists (' + config.positionStatus.name + ')  Would you like to overwrite?',
      choices: [
        { title: 'No', value: false },
        { title: 'Yes', value: true },
      ],
    });

    if (!update.update) {
      return config;
    }
  }
  if (config.apiConfig === undefined)
    throw Error('To run position status test setup the apiConfig (keys & urls) must first be defined');
  if (config.unit === undefined) throw Error('To run position status test setup the unit test config must already be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //look to see if the test position already exists
    //Look for a position with the right unit id and name
  const statuses = await api.Search.PositionStatuses.getPositionStatuses({unitId: config.unit.id});
  if(statuses.length === 0) {
    throw("no position status exist in system - create one manually");
  }
  config.positionStatus = statuses[0];
  return config;
};
export { setupConfigPositionStatus };
export default setupConfigPositionStatus;

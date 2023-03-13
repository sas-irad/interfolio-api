import prompts from 'prompts';
import { TestConfig } from '../setup-config';
import API from '../../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigPositionType = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.positionType) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message:
        'The test position type exists (' + config.positionType.name + ')  Would you like to overwrite?',
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
  if (config.unit === undefined) throw Error('To run position type test setup the unit test config must already be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //look to see if the test position already exists
    //Look for a position with the right unit id and name
  const records = await api.Search.PositionTypes.getPositionTypes();
  if(records.length === 0) {
    throw("no position types exist in system - create one manually");
  }
  config.positionType = records[0];
  return config;
};
export { setupConfigPositionType };
export default setupConfigPositionType;

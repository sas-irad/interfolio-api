import prompts from 'prompts';
import { TestConfig } from './setup-config';
import API from '../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigStatus = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.status) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message: 'The test status information exists (' + config.status.name + ')  Would you like to overwrite?',
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
    throw Error('To run status test setup the apiConfig (keys & urls) must first be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  const statuses = await api.Tenure.Statuses.getList();
  if (statuses.length == 0) {
    throw Error('No statuses are defined in this instance');
  }
  config.status = statuses[0];

  return config;
};
export { setupConfigStatus };
export default setupConfigStatus;

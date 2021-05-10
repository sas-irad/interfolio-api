import prompts from 'prompts';
import { TestConfig } from './setup-config';
import API from '../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigUser = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.user && config.currentUser) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message: 'The test user information exists (' + config.user.email + ')  Would you like to overwrite?',
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
    throw Error('To run test user setup the apiConfig (keys & urls) must first be defined');
  if (config.unit === undefined) throw Error('To run test user setup the unit test config must already be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //look to see if the test user already exists
  try {
    const user = await api.Tenure.Users.findUserByEmail({ email: 'api-test@example.com' });
    config.user = user;
  } catch (e) {
    const user = await api.Tenure.Users.create({
      firstName: 'API Test',
      lastName: 'Test',
      email: 'api-test@example.com',
      unitId: config.unit.id,
    });
    config.user = user;
  }

  //go get the current user
  const currentUser = await api.Tenure.Users.currentUser();
  config.currentUser = currentUser;

  return config;
};
export { setupConfigUser };
export default setupConfigUser;

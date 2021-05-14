import prompts from 'prompts';
import { TestConfig } from './setup-config';
import API from '../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigCommittee = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.committee) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message: 'The test committee information exists (' + config.committee.name + ')  Would you like to overwrite?',
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
    throw Error('To run committee test setup the apiConfig (keys & urls) must first be defined');
  if (config.unit === undefined)
    throw Error('To run committee test setup the unit test config must already be defined');
  if (config.user === undefined)
    throw Error('To run committee test setup the user test config must already be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //look to see if the test committee already exists
  try {
    const committee = await api.Tenure.Committees.findUnitStandingCommittee({
      unitId: config.unit.id,
      committeeName: 'Test Committee for API',
    });
    config.committee = committee;
  } catch (e) {
    const c1 = await api.Tenure.Committees.createStandingCommittee({
      name: 'Test Committee for API',
      unitId: config.unit.id,
    });
    const committee = await api.Tenure.Committees.getCommittee({ id: c1.id });

    config.committee = committee;
  }

  //look to see if the test2 committee already exists
  try {
    const committee2 = await api.Tenure.Committees.findUnitStandingCommittee({
      unitId: config.unit.id,
      committeeName: 'Test Committee for API 2',
    });
    config.committee2 = committee2;
  } catch (e) {
    const c2 = await api.Tenure.Committees.createStandingCommittee({
      name: 'Test Committee for API 2',
      unitId: config.unit.id,
    });
    const committee2 = await api.Tenure.Committees.getCommittee({ id: c2.id });

    config.committee2 = committee2;
  }

  return config;
};
export { setupConfigCommittee };
export default setupConfigCommittee;

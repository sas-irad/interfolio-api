import prompts from 'prompts';
import { TestConfig } from '../setup-config';
import API from '../../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigPosition = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.position) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message:
        'The test position exists (' + config.position.name + ')  Would you like to overwrite?',
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
    throw Error('To run position test setup the apiConfig (keys & urls) must first be defined');
  if (config.unit === undefined) throw Error('To run position test setup the unit test config must already be defined');
  if (config.positionType === undefined) throw Error('To run position test setup the positionType test config must already be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  const positionTitle = "Test Position for API";
  //look to see if the test position already exists
  try {
    // if config already exists then refresh it
    if(config.position) {
      const position = await api.Search.Positions.getPosition({id: config.position.id});
      config.position = position;
    }
    else {
      //Look for a position with the right unit id and name
      const search = await api.Search.Positions.filterPositions({search_term: positionTitle});
      let found = false;
      for(const positionRecord of search.results) {
        if(positionRecord.unit_id === config.unit.id && positionRecord.name === positionTitle) {
          const position = await api.Search.Positions.getPosition({id: positionRecord.id});
          config.position = position;
        }
        found = true;
      }
      if(!found) {
        throw("no position config - create one")
      }
    }
  } catch (e) {
    const position = await api.Search.Positions.create({
      unit_id: config.unit.id,
      position_type_id: config.positionType.id,
      name: positionTitle,
      open_date: '2022-10-10',
      published: true,
    });
    config.position = await api.Search.Positions.getPosition({ id: position.id });
  }

  return config;
};
export { setupConfigPosition };
export default setupConfigPosition;

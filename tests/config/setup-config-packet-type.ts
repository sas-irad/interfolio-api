import prompts from 'prompts';
import { TestConfig } from './setup-config';
import API from '../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigPacketType = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.packetType) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message: 'The test packet type information exists (' + config.packetType.name + ')  Would you like to overwrite?',
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

  //go get the current units from the database
  const api = new API(config.apiConfig);

  const types = await api.Tenure.PacketTypes.getList();
  if (types.length == 0) {
    throw Error('No packet types are defined in this instance');
  }
  config.packetType = types[0];

  return config;
};
export { setupConfigPacketType };
export default setupConfigPacketType;

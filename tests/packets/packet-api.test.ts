import { expect } from 'chai';
import Config from '../config/test-config.json';
import PacketApi from '../../src/packets/packet-api';

/**
 * Test for Packet API
 */
describe('Packet API Test', () => {
  const api = new PacketApi(Config.apiConfig);

  //Test creation
  it('Create Packet Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });
});

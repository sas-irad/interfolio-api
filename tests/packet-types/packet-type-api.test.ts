import { expect } from 'chai';
import Config from '../config/test-config.json';
import PacketTypeApi from '../../src/packet-types/packet-type-api';

/**
 * Test for PacketType API
 */
describe('Packet Type API Test', () => {
  const api = new PacketTypeApi(Config.apiConfig);

  //Test creation
  it('Create Packet Template Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Get Packet Type List', async () => {
    const types = await api.getList();
    expect(types.length).to.be.greaterThan(0, 'Number of Packet Types returned is not 0');

    //loop through the types and make sure we retrieve our matching one
    let found = false;
    for (const type of types) {
      if (type.id === Config.packetType.id) {
        found = true;
        expect(type.name).to.eq(Config.packetType.name);
      }
    }
    expect(found).to.eq(true, 'Packet type found');
  });
});

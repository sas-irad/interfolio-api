import { expect } from 'chai';
import Config from '../config/test-config.json';
import StatusApi from '../../src/tenure/status-api';

/**
 * Test for Packet Status API test
 */
describe('Status API Test', () => {
  const api = new StatusApi(Config.apiConfig);

  //Test creation
  it('Create Status Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Get Status List', async () => {
    const statuses = await api.getList();
    expect(statuses.length).to.be.greaterThan(0, 'Number of Statuses returned is not 0');

    //loop through the types and make sure we retrieve our matching one
    let found = false;
    for (const status of statuses) {
      if (status.id === Config.status.id) {
        found = true;
        expect(status.name).to.eq(Config.status.name);
      }
    }
    expect(found).to.eq(true, 'status found');
  });
});

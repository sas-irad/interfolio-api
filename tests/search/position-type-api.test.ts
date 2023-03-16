import { expect } from 'chai';
import Config from '../config/test-config.json';
import PositionTypeApi from '../../src/search/position-type-api';

/**
 * Test for PositionTypeAPI
 */
describe('Position Type API Test', () => {
  const api = new PositionTypeApi(Config.apiConfig);

  //Test creation
  it('Create Position Type Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Get Position Types', async () => {
    const records = await api.getPositionTypes();
    let found = false;
    for (const status of records) {
      if (status.id === Config.positionType.id) {
        found = true;
      }
    }
    expect(found).to.eq(true, 'Position Status found in statuses');
  });
});

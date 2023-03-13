import { expect } from 'chai';
import Config from '../config/test-config.json';
import PositionStatusApi from '../../src/search/position-status-api';

/**
 * Test for PositionStatusAPI
 */
describe('Position Status API Test', () => {
  const api = new PositionStatusApi(Config.apiConfig);

  //Test creation
  it('Create Position Status Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Get Position Statuses', async () => {
    const records = await api.getPositionStatuses({ unitId: Config.unit.id });
    let found = false;
    for (const status of records) {
      if (status.id === Config.positionStatus.id) {
        found = true;
      }
    }
    expect(found).to.eq(true, 'Position Status found in statuses');
  });
});

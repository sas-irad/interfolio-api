import { expect } from 'chai';
import Config from '../config/test-config.json';
import PositionApi from "../../src/search/position-api";

/**
 * Test for PositionAPI
 */
describe('Position API Test', () => {
  const api = new PositionApi(Config.apiConfig);

  //Test creation
  it('Create Position Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });


  it.only('Get Position', async () => {
    const record = await api.getPosition({ id: 102305 });
    expect(record.name).to.eq("Assistant or Associate Professor of African American History", 'Committee name matches');
    // expect(record.name).to.eq(Config.committee.name, 'Committee name matches');
    // expect(record.unit_id).to.eq(Config.committee.unit_id, 'Committee unit id matches');
    // expect(record.committee_members[0].user_id).to.eq(Config.currentUser.id, 'Committee Member user id matches');
  });

});

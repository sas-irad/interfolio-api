import { expect } from 'chai';
import Config from '../../config/test-config.json';
import ApplicationApi from "../../../src/search/positions/application-api";

/**
 * Test for ApplicationAPI
 */
describe('Application API Test', () => {
  const api = new ApplicationApi(Config.apiConfig);

  //Test creation
  it.only('Create Application Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });


  it.only('Get Application Detail', async () => {
    const record = await api.getDetail({ position_id: 102305, application_id:  3834216});
    console.log(record);
    // expect(record.name).to.eq("Assistant or Associate Professor of African American History", 'Committee name matches');
    // expect(record.name).to.eq(Config.committee.name, 'Committee name matches');
    // expect(record.unit_id).to.eq(Config.committee.unit_id, 'Committee unit id matches');
    // expect(record.committee_members[0].user_id).to.eq(Config.currentUser.id, 'Committee Member user id matches');
  });

});

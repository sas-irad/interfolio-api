import { expect } from 'chai';
import Config from '../../config/test-config.json';
import ApplicationApi from "../../../src/search/positions/application-api";

/**
 * Test for ApplicationAPI
 */
describe('Application API Test', () => {
  const api = new ApplicationApi(Config.apiConfig);

  //Test creation
  it('Create Application Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });


  it('Get Application Detail', async () => {
    const record = await api.getDetail({ positionId: 102305, applicationId:  3834216});
    // expect(record.name).to.eq("Assistant or Associate Professor of African American History", 'Committee name matches');
    // expect(record.name).to.eq(Config.committee.name, 'Committee name matches');
    // expect(record.unit_id).to.eq(Config.committee.unit_id, 'Committee unit id matches');
    // expect(record.committee_members[0].user_id).to.eq(Config.currentUser.id, 'Committee Member user id matches');
  });

  it('Create Applicant', async() => {
    const record = await api.create({
      positionId: Config.position.id,
      firstName: Config.user.first_name,
      lastName: Config.user.last_name,
      email: Config.user.email
    });
    expect(record.firstname).to.eq(Config.user.first_name, 'First name matches');
    expect(record.lastname).to.eq(Config.user.last_name, 'Last name matches');
    expect(record.position_id).to.eq(Config.position.id, 'position id matches');
  })

});

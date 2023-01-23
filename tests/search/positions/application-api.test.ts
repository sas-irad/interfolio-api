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
    const record = await api.getDetail({ positionId: Config.position.id, applicationId:  Config.application.id});
    expect(record.id).to.eq(Config.application.id, 'Applicant id matches');
    expect(record.lastname).to.eq(Config.application.lastname, 'Applicant last name matches');
  });

  //broken in test server
  it.skip('Create Applicant', async() => {
    const record = await api.create({
      positionId: Config.position.id,
      firstName: Config.user.first_name,
      lastName: Config.user.last_name + '123456',
      email: Config.user.email + '123456'
    });
    expect(record.firstname).to.eq(Config.user.first_name, 'First name matches');
    expect(record.lastname).to.eq(Config.user.last_name, 'Last name matches');
    expect(record.position_id).to.eq(Config.position.id, 'position id matches');
  })

});

import { expect } from 'chai';
import Config from '../../../config/test-config.json';
import ApplicationDocumentApi from "../../../../src/search/positions/applications/application-document-api";

/**
 * Test for ApplicationAPI
 */
describe('Application Document API Test', () => {
  const api = new ApplicationDocumentApi(Config.apiConfig);

  //Test creation
  it('Create Application Document Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });


  it('Get Document', async () => {
    const record = await api.getDocument({ documentId: 34514872, positionId: 102305, applicationId:  3834216});
    // expect(record.name).to.eq("Assistant or Associate Professor of African American History", 'Committee name matches');
    // expect(record.name).to.eq(Config.committee.name, 'Committee name matches');
    // expect(record.unit_id).to.eq(Config.committee.unit_id, 'Committee unit id matches');
    // expect(record.committee_members[0].user_id).to.eq(Config.currentUser.id, 'Committee Member user id matches');
  });

});

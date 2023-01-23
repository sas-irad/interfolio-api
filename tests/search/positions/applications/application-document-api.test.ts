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


  //Test retrieval of document
  it('Get Document', async () => {
    const record = await api.getDocument({
      documentId: Config.application.application_documents[0].id,
      positionId: Config.position.id,
      applicationId:  Config.application.id
    });
    expect(record.substr(0,4)).to.eq("%PDF", 'PDF file retrieved');
  });

});

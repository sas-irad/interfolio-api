import { expect } from 'chai';
import Config from '../../../config/test-config.json';
import ApplicationDocumentApi from "../../../../src/search/positions/applications/application-document-api";
import path from "path";
import fs from "fs";

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

  it('Save Document', async() => {
    const tempFileName = "tempfile.pdf";
    await api.saveDocument({
      documentId: Config.application.application_documents[0].id,
      applicationId: Config.application.id,
      positionId: Config.position.id,
      filePath: tempFileName
    });
    const file = fs.readFileSync(tempFileName);
    const fileContents = file.toString();
    expect(fileContents.substr(0,4)).to.eq("%PDF", 'PDF file retrieved');
    fs.unlink(tempFileName, (err) => {
      if(err) throw(err);
    });


  });

  it('Create/Destroy Document on Behalf', async() => {
    /** test create from file */
    const filePath = path.resolve(__dirname + "/../../../../tests/config/resources/TestPDF.pdf");
    const title = "API Test Document 2";
    const doc = await api.createDocumentOnBehalf({
      positionId: Config.position.id,
      applicationId: Config.application.id,
      title: title,
      type: "Other Document",
      format: "PDF",
      filePath: filePath
    });

    expect(doc).to.have.property('id').that.is.a('number');
    expect(doc.document_title).to.eq(title,"Titles are equal");

    //Delete the document just created
    const deleted = await api.destroyDocumentOnBehalf({
      documentId: doc.id,
      applicationId: Config.application.id,
      positionId: Config.position.id
    });
    expect(deleted, "Deleted Document").to.be.true;

    // Test creating from a text string
    const doc2 = await api.createDocumentOnBehalf({
      positionId: Config.position.id,
      applicationId: Config.application.id,
      title: title,
      type: "Other Document",
      format: "PDF",
      fileContents:  "Test File Contents"
    });
    expect(doc2).to.have.property('id').that.is.a('number');
    expect(doc2.document_title).to.eq(title,"Titles are equal");
    //clean up the second document just created
    await api.destroyDocumentOnBehalf({
      documentId: doc2.id,
      applicationId: Config.application.id,
      positionId: Config.position.id
    });


  });


});

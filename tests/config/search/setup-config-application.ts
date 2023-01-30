import prompts from 'prompts';
import { TestConfig } from '../setup-config';
import API from '../../../src';
import path from "path";

/**
 * prompts user to set up a position application for testing
 * @param config {TestConfig}
 */
const setupConfigApplication = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.application) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message:
        'The test application exists (' + config.application.firstname + ' ' + config.application.lastname + ')  Would you like to overwrite?',
      choices: [
        { title: 'No', value: false },
        { title: 'Yes', value: true },
      ],
    });

    if (!update.update) {
      return config;
    }
  }
  if (config.apiConfig === undefined)
    throw Error('To run position test setup the apiConfig (keys & urls) must first be defined');
  if (config.unit === undefined) throw Error('To run application test setup the unit test config must already be defined');
  if (config.user === undefined) throw Error('To run application test setup the user test config must already be defined');
  if (config.position === undefined) throw Error('To run application test setup the position test config must already be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //look to see if the test position already exists
  try {
    // if config already exists then refresh it
    if(config.application) {
      const application = await api.Search.Applications.getDetail({applicationId: config.application.id, positionId: config.position.id});
      if(application) {
        config.application = application;
      }
    }
    else {
      //Look for a position with the right unit id and name
      const search = await api.Search.Reports.applicationSearch({facets: {position_id: config.position.id}})
      let found = false;
      for(const applicationRecord of search.applications) {
        if(applicationRecord.firstname === config.user.first_name && applicationRecord.lastname === config.user.last_name) {
          const application = await api.Search.Applications.getDetail({applicationId: applicationRecord.id, positionId: applicationRecord.position_id});
          if(application) {
            config.application = application;
          }
        }
        found = true;
      }
      if(!found) {
        throw("no application config - create one")
      }
    }
  } catch (e) {
    const application = await api.Search.Applications.create({
      firstName: config.user.first_name,
      lastName: config.user.last_name,
      email: config.user.email,
      positionId: config.position.id
    });
    config.application = await api.Search.Applications.getDetail({ applicationId: application.id, positionId: config.position.id });
  }

  //check to see if a document has been uploaded
  let docNeeded = true;
  if(config.application?.application_documents) {
    for(const doc of config.application.application_documents) {
      if(doc.name === 'API Test Document') {
        docNeeded = false;
      }
    }
  }
  if(config.application && docNeeded) {
    const filePath = path.resolve(__dirname + "/../../../../tests/config/resources/TestPDF.pdf");
    await api.Search.ApplicationDocuments.createDocumentOnBehalf({
      applicationId: config.application.id,
      positionId: config.position.id,
      title: "API Test Document",
      type: "Other Document",
      format: "PDF",
      filePath: filePath
    });
    config.application = await api.Search.Applications.getDetail({ applicationId: config.application.id, positionId: config.position.id });
  }

  return config;

};
export { setupConfigApplication };
export default setupConfigApplication;

import { expect } from 'chai';
import Config from '../config/test-config.json';
import FormApi from '../../src/tenure/form-api';

/**
 * Test for Form API
 */
describe('Form API Test', () => {
  const api = new FormApi(Config.apiConfig);

  //Test Api Initialization
  it('Create Form Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  //This has not yet been implemented in interfolio api
  it.skip('Create/Delete Form', async () => {
    const title = 'Test API Form Creation';
    const description = 'Test Api Form Description';
    const formId = await api.createForm({ title, description, unitId: 17048 });
    expect(formId).gt(0, 'Test id of created form is > 1');
    const formDelete = await api.deleteForm({ id: 69 });
    expect(formDelete).equal(true, 'Form deleted');
  });

  //Find the committee form
  it('Find Form', async () => {
    const form = await api.findCommitteeForm({ title: Config.form.title, unitId: Config.unit.id });
    expect(form.title).equal(Config.form.title, 'Committee Form title matches');
  });

  //Get the Committee form
  it('Get Form', async () => {
    const form = await api.getForm({ id: Config.form.id });
    expect(form.title).equal(Config.form.title, 'Title Matches');
  });

  //test form summary
  it('Get Forms', async () => {
    const forms = await api.getFormSummaryList();
    let found = false;
    for (const form of forms) {
      if (form.id === Config.form.id) {
        found = true;
        expect(form.name).eq(Config.form.title, 'Form Name Matches');
      }
    }
    expect(found).eq(true, 'Form Found');
  });

  //Check the form responses match
  it('Get Form Responses', async () => {
    const responses = await api.getFormResponses({
      formId: Config.formResponse.form.id,
      originId: Config.formResponse.originId,
      originType: Config.formResponse.originType,
    });

    //loop through response data to see if it matches
    for (const [field, value] of Object.entries(responses[0].responseData)) {
      //this hacky way to compare values really needs to have a helper function
      //check for the date matches which are a nested object
      if (Array.isArray(value)) {
        let retrivedValue = '';
        for (const index in value) {
          for (const field2 in value[index]) {
            retrivedValue = value[index][field2];
          }
        }
        for (const configField in Config.formResponse.responseData) {
          if (configField === field) {
            for (const configField in value[0]) {
              expect(retrivedValue).eq(value[0][configField], 'Date Field Matches');
            }
          }
        }
      } else {
        expect(responses[0].responseData[field]).equal(value, 'Field matches Value');
      }
    }
  });
});

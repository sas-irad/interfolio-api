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

  //Check the form responses match
  it('Get Form Responses', async () => {
    const responses = await api.getFormResponses({
      formId: Config.formResponse.form.id,
      originId: Config.formResponse.originId,
      originType: Config.formResponse.originType,
    });

    //loop through response data to see if it matches
    for (const [field, value] of Object.entries(Config.formResponse.responseData)) {
      expect(responses[0].responseData[field]).equal(value, 'Field matches Value');
    }
  });
});

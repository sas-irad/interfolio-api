import prompts from 'prompts';
import { TestConfig } from '../setup-config';
import API from '../../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigForm = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.form) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message: 'The test form information exists (' + config.form.title + ')  Would you like to overwrite?',
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
    throw Error('To run the form config the apiConfig (keys & urls) must first be defined');
  if (config.unit === undefined) throw Error('To run form config the unit config must be first defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //set boolean for creating the new form
  let keepTrying = true;

  //if form is already defined then just update it
  if (config.form) {
    config.form = await api.Tenure.Forms.getForm({ id: config.form.id });
    keepTrying = false;
  }
  //prompt the user to create the committee form via the interface since it is not yet enabled in API
  while (keepTrying) {
    try {
      const form = await api.Tenure.Forms.findCommitteeForm({
        unitId: config.unit.id,
        title: 'Test Committee Form for API',
      });
      config.form = await api.Tenure.Forms.getForm({ id: form.id });
      keepTrying = false;
    } catch (e) {
      const manualCreate = await prompts({
        message:
          'Creating a form has not yet been enabled via Interfolio API.\n' +
          '    Use the Interface to create a committee form in the ' +
          config.unit.name +
          ' unit entitled  "Test Committee Form for API"' +
          ' Question 1: "Test Form Question 1" with a type of short text\n' +
          ' Question 2: "Test Form Question 2" with a type of single select with options\n' +
          '    "Question Option 1", "Question Option 2", "Question Option 3"\n' +
          ' Question 3: "Test Form Question 3" with a type of date\n' ,
        type: 'select',
        name: 'manual',
        choices: [
          { title: 'I have created the form', value: true },
          { title: 'Skip Committee Form Initialization', value: false },
        ],
      });
      keepTrying = manualCreate.manual;
    }
  }
  return config;
};
export { setupConfigForm };
export default setupConfigForm;

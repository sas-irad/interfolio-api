import prompts from 'prompts';
import { TestConfig } from './setup-config';
import API from '../../src';
import { PlatformFormSubmission } from '../../src/packets/platform-forms/platform-form-api';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigPacketForm = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.packetForm) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message: 'The test packet form information exists (' + config.packetForm.id + ')  Would you like to overwrite?',
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
    throw Error('To run packet test setup the apiConfig (keys & urls) must first be defined');
  if (config.packet === undefined) throw Error('To run packet form test setup the packet config must first be defined');
  if (config.committee === undefined)
    throw Error('To run packet form test setup the committee config must first be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //get the requirements for the workflow step
  const requirements = await api.Packets.WorkflowSteps.Committees.getRequirements({
    packetId: config.packet.id,
    committeeId: config.committee.id,
    workflowStepId: config.packet.workflow_steps[1].id,
  });
  const form = requirements.required_platform_forms[0];

  //get the form version so we can answer the questions
  const formVersion = await api.Packets.PlatformForms.getFormVersionForWorkflowStep({
    formId: form.caasbox_form_id,
    originId: form.id,
  });

  //Answer the questions
  if (
    formVersion.versionData.fieldsets[0] !== undefined &&
    formVersion.versionData.fieldsets[0].fields[1] !== undefined &&
    formVersion.versionData.fieldsets[0].fields[1].meta !== undefined &&
    formVersion.versionData.fieldsets[0].fields[1].meta.options !== undefined
  ) {
    const submission: PlatformFormSubmission = api.Packets.PlatformForms.formSubmissionFromValues({
      formVersion,
      responseValues: [
        { label: 'Test Form Question 1', value: 'Answer 1' },
        { label: 'Test Form Question 2', value: 'Question Option 2' },
      ],
    });

    const submissionResponse = await api.Packets.PlatformForms.submitFormResponse({
      packetId: config.packet.id,
      platformFormId: form.id,
      submission,
    });

    config.formResponse = submissionResponse;
  }

  return config;
};
export { setupConfigPacketForm };
export default setupConfigPacketForm;

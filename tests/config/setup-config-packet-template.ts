import prompts from 'prompts';
import { TestConfig } from './setup-config';
import API from '../../src';
import EvaluatorSectionApi from '../../src/tenure/packets/evaluator-section-api';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigPacketTemplate = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.packetTemplate) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message:
        'The test template information exists (' + config.packetTemplate.name + ')  Would you like to overwrite?',
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
    throw Error('To run template test setup the apiConfig (keys & urls) must first be defined');
  if (config.unit === undefined) throw Error('To run template test setup the unit test config must already be defined');
  if (config.committee === undefined)
    throw Error('To run template test setup the committee test config must already be defined');
  if (config.packetType === undefined)
    throw Error('To run template test setup the packet type test config must already be defined');
  if (config.form === undefined)
    throw Error('To run template test setup the form type test config must already be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //look to see if the test committee already exists
  try {
    const template = await api.Tenure.PacketTemplates.findUnitTemplate({
      unitId: config.unit.id,
      name: 'Test Template for API',
    });
    config.packetTemplate = template;
  } catch (e) {
    const packetTemplate = await api.Tenure.PacketTemplates.create({
      name: 'Test Template for API',
      unitId: config.unit.id,
      description: 'Description for the Test Template for the API',
      packetTypeId: config.packetType.id,
    });

    const step1 = await api.Tenure.WorkflowSteps.addWorkflowStepStanding({
      packetId: packetTemplate.id,
      workflowStepName: 'Workflow Step 1',
      committeeId: config.committee.id,
      workflowStepNote: 'Workflow Step Note',
    });

    const step2 = await api.Tenure.WorkflowSteps.addWorkflowStepStanding({
      packetId: packetTemplate.id,
      workflowStepName: 'Workflow Step 2',
      committeeId: config.committee.id,
      workflowStepNote: 'Workflow Step Note 2',
    });

    const packetTemplateFull = await api.Tenure.PacketTemplates.getTemplate({ id: packetTemplate.id });

    const section = EvaluatorSectionApi.findPacketSectionFromName({
      packetDetail: packetTemplateFull,
      sectionName: 'Committee Documents',
    });
    await api.Tenure.PlatformForms.addWorkflowStepForm({
      committeeId: config.committee.id,
      committeeManagerOnlySubmission: true,
      formAccessLevel: 1,
      formId: config.form.id,
      sectionId: section?.id || config.packet?.packet_sections[2].id || 1,
      packetId: packetTemplate.id,
      workflowStepId: step1.id,
    });

    await api.Tenure.WorkflowStepCommittees.addDocumentRequirement({
      packetId: config?.packetTemplate?.id ?? 1,
      workflowStepId: step1.id,
      committeeId: config.committee.id,
      name: 'Test Required Document',
      description: 'Description for test of the required document',
    });

    await api.Tenure.PlatformForms.addWorkflowStepForm({
      committeeId: config?.committee2?.id ?? 1,
      committeeManagerOnlySubmission: true,
      formAccessLevel: 1,
      formId: config.form.id,
      sectionId: section?.id || config.packet?.packet_sections[2].id || 1,
      packetId: packetTemplate.id,
      workflowStepId: step2.id,
    });

    await api.Tenure.WorkflowStepCommittees.addDocumentRequirement({
      packetId: config?.packetTemplate?.id ?? 1,
      workflowStepId: step2.id,
      committeeId: config.committee2?.id ?? 1,
      name: 'Test Required Document',
      description: 'Description for test of the required document',
    });

    config.packetTemplate = await api.Tenure.PacketTemplates.getTemplate({ id: packetTemplate.id });
  }

  return config;
};
export { setupConfigPacketTemplate };
export default setupConfigPacketTemplate;

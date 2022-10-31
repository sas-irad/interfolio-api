import prompts from 'prompts';
import { TestConfig } from '../setup-config';
import API from '../../../src';

/**
 * prompts user to set up a committee for testing
 * @param config {TestConfig}
 */
const setupConfigPacket = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.packet) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message: 'The test packet  information exists (' + config.packet.id + ')  Would you like to overwrite?',
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
  if (config.packetTemplate === undefined)
    throw Error('To run packet test setup the packet template config must first be defined');
  if (config.user === undefined) throw Error('To run packet test setup the user config must first be defined');
  if (config.unit === undefined) throw Error('To run packet test setup the unit config must first be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  const packetDetail = await api.Tenure.Packets.createFromTemplate({
    packetId: config.packetTemplate.id,
    candidateFirstName: config.user.first_name,
    candidateLastName: config.user.last_name,
    candidateEmail: config.user.email,
    candidateInvolvement: false,
    unitId: config.unit.id,
  });

  const params = {
    packetId: packetDetail.id,
    workflowStepId: packetDetail.workflow_steps[1].id,
    committeeId: config.committee?.id ?? 0,
  };
  //get requirements
  const reqs = await api.Tenure.WorkflowStepCommittees.getRequirements(params);

  const doc = await api.Tenure.PacketAttachments.addDocument({
    packetId: packetDetail.id,
    displayName: 'Required Document Fulfillment',
    sectionId: packetDetail.packet_sections[1].id,
    file: Buffer.from('File For Document Fulfillment'),
    fileName: 'DocumentRequirementFulfillment.txt',
  });

  await api.Tenure.Packets.moveForward({
    id: packetDetail.id,
    sendNotification: false,
  });

  await api.Tenure.WorkflowStepCommittees.fulfillDocumentRequirement({
    packetId: packetDetail.id,
    workflowStepId: packetDetail.workflow_steps[1].id,
    committeeId: config.committee?.id ?? 1,
    requirementId: reqs.required_documents[0].id,
    attachmentId: doc.id,
  });

  config.packet = await api.Tenure.Packets.getPacket({ id: packetDetail.id });

  return config;
};
export { setupConfigPacket };
export default setupConfigPacket;

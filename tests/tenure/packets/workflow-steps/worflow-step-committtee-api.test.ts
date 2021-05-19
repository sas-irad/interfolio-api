import { expect } from 'chai';
import Config from '../../../config/test-config.json';
import WorkflowStepCommitteeApi from '../../../../src/tenure/packets/workflow-steps/workflow-step-committee-api';
import PacketAttachmentApi from '../../../../src/tenure/packets/packet-attachment-api';
/**
 * Test for Workflow Step Committee API
 */
describe('Workflow Step Committee API Test', () => {
  const api = new WorkflowStepCommitteeApi(Config.apiConfig);
  const attachmentApi = new PacketAttachmentApi(Config.apiConfig);

  //Test creation
  it('Create Workflow Step Committee Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  //Test requirements
  it('Test retrieval of workflow step requirements', async () => {
    const reqs = await api.getRequirements({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee.id,
    });
    expect(reqs.required_platform_forms[0].caasbox_form_id).equal(Config.form.id, 'Required Form Matches id');
    expect(reqs.required_platform_forms[0].form_name).equal(Config.form.title, 'Required Form Matches Title');
  });

  it('Add/Delete document requirement', async () => {
    //add a requirement
    const name = 'Required Document for Test';
    const req = await api.addDocumentRequirement({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee.id,
      name: name,
      description: 'Req Doc for test description',
    });

    expect(req.id).greaterThan(0, 'Id for added requirement > 0');
    expect(req.name).eq(name, 'Created requirement name matches');

    const deleted = await api.deleteDocumentRequirement({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee.id,
      requirementId: req.id,
    });

    expect(deleted).to.eq(true, 'Requirement successfully deleted');
  });

  /**
   * Test fullfilling a document requirement
   */
  it('Fulfill Document Requirement', async () => {
    //add a requirement
    const req = await api.addDocumentRequirement({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee.id,
      name: 'Test Requirement',
      description: 'Req Doc for test description',
    });

    //add a document
    const doc = await attachmentApi.addDocument({
      packetId: Config.packet.id,
      displayName: 'Test Required Document Fulfillment',
      sectionId: Config.packet.packet_sections[1].id,
      file: Buffer.from('File For Document Fulfillment'),
      fileName: 'DocumentRequirementFulfillment.txt',
    });

    //use the document to fulfill the requirement
    const fulfilled = await api.fulfillDocumentRequirement({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee?.id ?? 1,
      requirementId: req.id,
      attachmentId: doc.id,
    });

    expect(fulfilled).equal(true, 'Requirement Fulfill api return true');

    //delete the attachment
    await attachmentApi.delete({ packetId: Config.packet.id, packetAttachmentId: doc.id });

    //delete the requirement
    await api.deleteDocumentRequirement({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee.id,
      requirementId: req.id,
    });
  });

  /**
   * Test adding and removing a committee from a workflow step
   * @todo implement
   */
  it('Test assign/remove committee from step', async () => {
    const committee = await api.assign({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee2.id,
      note: 'Committee 2 note',
    });

    expect(committee).equal(true, 'Assign Committee successful');

    const removed = await api.delete({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee2.id,
    });

    expect(removed).equal(true, 'Remove Committee successful');
  });
});

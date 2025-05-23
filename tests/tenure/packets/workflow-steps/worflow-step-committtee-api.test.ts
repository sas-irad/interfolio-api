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

  it('Test Updating Workflow Step Committee', async () => {
    const updated = await api.update({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee.id,
      note: 'new note',
    });
    expect(updated).eq(true, 'Workflow Step Committee updated');

    //switch it back
    await api.update({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee.id,
      note: Config.packet.workflow_steps[1].note || '',
    });
  });

  /**
   * Test adding and removing a committee from a workflow step
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

  /**
   * Test copying requirements from one workflow step committee to another
   */
  it('Test copy workflow step committee requirements', async () => {
    //assign a second committee to copy to
    await api.assign({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee2.id,
    });

    await api.copyRequirements({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      fromCommitteeId: Config.committee.id,
      toCommitteeId: Config.committee2.id,
    });

    //get the requirements to check
    const newReqs = await api.getRequirements({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee2.id,
    });

    //check docs successfully copied
    expect(newReqs.required_documents[0].name).eq(
      Config.committeeRequirements.required_documents[0].name,
      'Document Name matches',
    );
    expect(newReqs.required_documents[0].description).eq(
      Config.committeeRequirements.required_documents[0].description,
      'Document Description matches',
    );

    //check forms successfully copied
    expect(newReqs.required_platform_forms[0].form_name).eq(
      Config.committeeRequirements.required_platform_forms[0].form_name,
      'Form name matches',
    );

    //clean up newly created committee assignment
    await api.delete({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
      committeeId: Config.committee2.id,
    });
  });

  it('Test Swapping Workflow Step Committees', async () => {
    await api.swapCommittees({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[2].id,
      fromCommitteeId: Config.packet.workflow_steps[2].committees[0].id,
      toCommitteeId: Config.committee.id,
    });

    //get the requirements to check
    const newReqs = await api.getRequirements({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[2].id,
      committeeId: Config.committee.id,
    });

    //check docs successfully copied
    expect(newReqs.required_documents[0].name).eq(
      Config.committeeRequirements.required_documents[0].name,
      'Document Name matches',
    );

    expect(newReqs.required_documents[0].description).eq(
      Config.committeeRequirements.required_documents[0].description,
      'Document Description matches',
    );

    //check forms successfully copied
    expect(newReqs.required_platform_forms[0].form_name).eq(
      Config.committeeRequirements.required_platform_forms[0].form_name,
      'Form name matches',
    );

    //swap it back
    await api.swapCommittees({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[2].id,
      fromCommitteeId: Config.committee.id,
      toCommitteeId: Config.committee2.id,
    });
  });

  it('Test Replacing Workflow Step Committees', async () => {
    await api.replaceCommittee({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[2].id,
      fromCommitteeId: Config.packet.workflow_steps[2].committees[0].id,
      toCommitteeId: Config.committee.id,
    });

    //get the requirements to check
    const newReqs = await api.getRequirements({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[2].id,
      committeeId: Config.committee.id,
    });

    //check docs successfully copied
    expect(newReqs.required_documents[0].name).eq(
      Config.committeeRequirements.required_documents[0].name,
      'Document Name matches',
    );

    expect(newReqs.required_documents[0].description).eq(
      Config.committeeRequirements.required_documents[0].description,
      'Document Description matches',
    );

    //check forms successfully copied
    expect(newReqs.required_platform_forms[0].form_name).eq(
      Config.committeeRequirements.required_platform_forms[0].form_name,
      'Form name matches',
    );

    //swap it back
    await api.replaceCommittee({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[2].id,
      fromCommitteeId: Config.committee.id,
      toCommitteeId: Config.committee2.id,
    });
  });
});

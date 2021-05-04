import { expect } from 'chai';
import Config from '../../../config/test-config.json';
import WorkflowStepCommitteeApi from '../../../../src/tenure/packets/workflow-steps/workflow-step-committee-api';

/**
 * Test for Packet API
 */
describe('Workflow Step Committee API Test', () => {
  const api = new WorkflowStepCommitteeApi(Config.apiConfig);

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

  /**
   * Test adding and removing a committee from a workflow step
   * @todo implement
   */
  it('Test assign/remove committee from step', async () => {
    expect(true).equal(true);
  });
});

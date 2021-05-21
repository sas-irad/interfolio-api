import { expect } from 'chai';
import Config from '../../config/test-config.json';
import WorkflowStepApi from '../../../src/tenure/packets/workflow-step-api';
import PacketApi from '../../../src/tenure/packet-api';

/**
 * Test for Packet API
 */
describe('Packet Workflow Step API Test', () => {
  const api = new WorkflowStepApi(Config.apiConfig);

  //Test creation
  it('Create Workflow Step Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Add/Delete Workflow Step', async () => {
    const step = await api.addWorkflowStepStanding({
      packetId: Config.packet.id,
      workflowStepName: 'Test Insert Workflow Step',
      committeeId: Config.committee.id,
      workflowStepNote: 'Here is the workflow step note',
    });
    expect(step.name).to.eq('Test Insert Workflow Step');
    expect(step.committees[0].id).to.eq(Config.committee.id);

    const success = await api.deleteWorkflowStep({ id: step.id, packetId: Config.packet.id });
    expect(success).to.eq(true, 'successfully deleted');
  });

  //Test retrieving workflow step
  it('Get a workflow step', async () => {
    const step = await api.getWorkflowStep({
      packetId: Config.packet.id,
      workflowStepId: Config.packet.workflow_steps[1].id,
    });
    expect(step.name).to.eq(Config.packet.workflow_steps[1].name);
  });

  //tes to reorder the steps
  it('Reorder workflow steps', async () => {
    await api.reorderWorkflowSteps({
      packetId: Config.packet.id,
      orderedWorkflowStepIds: [Config.packet.workflow_steps[2].id, Config.packet.workflow_steps[1].id],
    });
    const packetApi = new PacketApi(Config.apiConfig);
    const reordered = await packetApi.getPacket({ id: Config.packet.id });

    expect(reordered.workflow_steps[1].id).eq(Config.packet.workflow_steps[2].id, 'Workflow step 1 switched');
    expect(reordered.workflow_steps[2].id).eq(Config.packet.workflow_steps[1].id, 'Workflow step 2 switched');

    //switch back
    await api.reorderWorkflowSteps({
      packetId: Config.packet.id,
      orderedWorkflowStepIds: [Config.packet.workflow_steps[1].id, Config.packet.workflow_steps[2].id],
    });
  });
});

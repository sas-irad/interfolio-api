import { expect } from 'chai';
import Config from '../../config/test-config.json';
import WorkflowStepApi from '../../../src/packets/workflow-steps/workflow-step-api';

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
});

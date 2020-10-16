import { expect } from 'chai';
import Config from '../../config/test-config.json';
import WorkflowStepApi from '../../../src/packets/workflow-steps/workflow-step-api';

/**
 * Test for Packet API
 */
describe('Packet API Test', () => {
  const api = new WorkflowStepApi(Config.apiConfig);

  //Test creation
  it.only('Create Workflow Step Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });
});



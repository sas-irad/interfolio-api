import { expect } from 'chai';
import Config from '../../config/test-config.json';
import PlatformFormApi from '../../../src/packets/platform-forms/platform-form-api';

/**
 * Test for Packet Platform Form API
 */
describe('Platform Form API Test', () => {
  const api = new PlatformFormApi(Config.apiConfig);

  //Test api initialization
  it('Create PlatformForm Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Add/remove form to workflow step', async () => {
    const newForm = await api.addWorkflowStepForm({
      committeeId: Config.packet.workflow_steps[2].committees[0].id,
      committeeManagerOnlySubmission: true,
      formAccessLevel: 1,
      formId: Config.form.id,
      packetId: Config.packet.id,
      sectionId: Config.packet.packet_sections[1].id,
      workflowStepId: Config.packet.workflow_steps[2].id,
    });
    expect(newForm.caasbox_form_id).equal(Config.form.id, 'Form instance form type matches form type id');

    const deleted = await api.deleteForm({ id: newForm.id, packetId: Config.packet.id });
    expect(deleted).equal(true, 'Delete call returns true');
  });
});

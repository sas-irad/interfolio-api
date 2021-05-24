import { expect } from 'chai';
import Config from '../../config/test-config.json';
import PlatformFormApi, { PlatformFormSubmission } from '../../../src/tenure/packets/platform-form-api';

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

  it('Submit Values for form', async () => {
    //get the form version so we can answer the questions
    const formVersion = await api.getFormVersionForWorkflowStep({
      formId: Config.form.id,
      originId: Config.committeeRequirements.required_platform_forms[0].id,
    });

    const submission: PlatformFormSubmission = api.formSubmissionFromValues({
      formVersion,
      responseValues: [
        { label: 'Test Form Question 1', value: 'Answer 1' },
        { label: 'Test Form Question 2', value: 'Question Option 2' },
      ],
    });

    for (const key in submission.response_data) {
      if (key.indexOf('question_1') > -1) {
        expect(submission.response_data[key]).eq('Answer 1', 'Submission Question 1 answer matches');
      }
    }
  });

  it('omit / require committee member form response', async () => {
    const newForm = await api.addWorkflowStepForm({
      committeeId: Config.packet.workflow_steps[2].committees[0].id,
      committeeManagerOnlySubmission: true,
      formAccessLevel: 1,
      formId: Config.form.id,
      packetId: Config.packet.id,
      sectionId: Config.packet.packet_sections[1].id,
      workflowStepId: Config.packet.workflow_steps[2].id,
    });

    const omitted = await api.addCommitteeMemberExclusion({
      packetId: Config.packet.id,
      originId: newForm.id,
      committeeMemberId: Config.committeeMember.id,
    });
    expect(omitted).eq(true, 'Committee member successfully omitted');

    const required = await api.removeCommitteeMemberExclusion({
      packetId: Config.packet.id,
      originId: newForm.id,
      committeeMemberId: Config.committeeMember.id,
    });
    expect(required).eq(true, 'Committee member exclusion removed');
    await api.deleteForm({ id: newForm.id, packetId: Config.packet.id });
  });
});

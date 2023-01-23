import { expect } from 'chai';
import Config from '../../config/test-config.json';
import PlatformFormApi, { PlatformFormSubmission } from '../../../src/tenure/packets/platform-form-api';
import PacketApi from '../../../src/tenure/packet-api';
import WorkflowStepCommitteeApi from '../../../src/tenure/packets/workflow-steps/workflow-step-committee-api';
import FormApi from '../../../lib/tenure/form-api';

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

  it('Get submission values for form', async () => {
    //get the form version so we can answer the questions
    const formVersion = await api.getFormVersionForWorkflowStep({
      formId: Config.form.id,
      originId: Config.committeeRequirements.required_platform_forms[0].id,
    });

    const submission: PlatformFormSubmission = PlatformFormApi.formSubmissionFromValues({
      formVersion,
      responseValues: [
        { label: 'Test Form Question 1', value: 'Answer 1' },
        { label: 'Test Form Question 2', value: 'Question Option 2' },
        { label: 'Test Form Question 3', value: '2021-03-03T04:00:00.000Z' },
      ],
    });

    for (const key in submission.response_data) {
      if (key.indexOf('question_1') > -1) {
        expect(submission.response_data[key]).eq('Answer 1', 'Submission Question 1 answer matches');
      }
    }
  });

  //test omitting and then requiring committee member form completion requirement
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

  //test getting all form responders
  it('test getting form responders', async () => {
    const newForm = await api.addWorkflowStepForm({
      committeeId: Config.packet.workflow_steps[2].committees[0].id,
      committeeManagerOnlySubmission: true,
      formAccessLevel: 1,
      formId: Config.form.id,
      packetId: Config.packet.id,
      sectionId: Config.packet.packet_sections[1].id,
      workflowStepId: Config.packet.workflow_steps[2].id,
    });

    const responders = await api.getFormResponders({
      packetId: Config.packet.id,
      originId: newForm.id,
    });
    expect(responders[0].committee_member_id).eq(Config.committeeMember.id, 'Responder user id matches');

    await api.deleteForm({ id: newForm.id, packetId: Config.packet.id });
  });

  //test omitting all all unsubmitted / un-omitted forms
  it('test excluding unsubmitted responses', async () => {
    const newForm = await api.addWorkflowStepForm({
      committeeId: Config.packet.workflow_steps[2].committees[0].id,
      committeeManagerOnlySubmission: true,
      formAccessLevel: 1,
      formId: Config.form.id,
      packetId: Config.packet.id,
      sectionId: Config.packet.packet_sections[1].id,
      workflowStepId: Config.packet.workflow_steps[2].id,
    });

    await api.excludeUnsubmittedResponses({
      packetId: Config.packet.id,
      originId: newForm.id,
    });

    const responders = await api.getFormResponders({
      packetId: Config.packet.id,
      originId: newForm.id,
    });
    expect(responders[0].omitted).eq(true, 'Responder user id matches');

    //remove exclusion
    await api.removeCommitteeMemberExclusion({
      packetId: Config.packet.id,
      originId: newForm.id,
      committeeMemberId: Config.committeeMember.id,
    });

    //clean up form
    await api.deleteForm({ id: newForm.id, packetId: Config.packet.id });
  });

  it('test submit/resubmit form', async () => {
    const packetApi = new PacketApi(Config.apiConfig);
    const workflowStepCommiteeApi = new WorkflowStepCommitteeApi(Config.apiConfig);
    const formApi = new FormApi(Config.apiConfig);

    const packetDetail = await packetApi.createFromTemplate({
      packetId: Config.packetTemplate.id,
      candidatePID: parseInt(Config.user.pid),
      candidateInvolvement: false,
      unitId: Config.unit.id,
    });

    await packetApi.moveForward({
      id: packetDetail.id,
      sendNotification: false,
    });

    const requirements = await workflowStepCommiteeApi.getRequirements({
      packetId: packetDetail.id,
      workflowStepId: packetDetail.workflow_steps[1].id,
      committeeId: packetDetail.workflow_steps[1].committees[0].id,
    });
    const originId = requirements.required_platform_forms[0].id;

    //prepare the submission
    const version = await api.getFormVersionForWorkflowStep({ formId: Config.form.id, originId });
    const responseValues = [
      { label: 'Test Form Question 1', value: 'Answer 1' },
      { label: 'Test Form Question 2', value: 'Question Option 2' },
      { label: 'Test Form Question 3', value: '2021-03-03T04:00:00.000Z' },
    ];
    let submission = PlatformFormApi.formSubmissionFromValues({ formVersion: version, responseValues });

    //submit the response
    await api.submitFormResponse({ packetId: packetDetail.id, originId, submission });

    //get the response just submitted
    let result = await formApi.getFormResponses({
      formId: Config.form.id,
      originId,
      originType: 'PacketCommitteeForm',
    });

    //test that the correct values are returned
    let values = PlatformFormApi.valuesFromFormResponse({ response: result[0], version });
    for (let i = 0; i < 3; i++) {
      expect(values[responseValues[i].label]).eq(
        responseValues[i].value,
        'Question ' + (i + 1).toString() + ' value matches',
      );
    }

    //adjust values for resubmission
    responseValues[0].value = 'Answer 1B';
    responseValues[1].value = 'Question Option 1';
    responseValues[2].value = '2021-03-05T04:00:00.000Z';
    submission = PlatformFormApi.formSubmissionFromValues({ formVersion: version, responseValues });

    //resubmit the response
    await api.resubmitFormResponse({ packetId: packetDetail.id, originId, responseId: result[0].id, submission });

    //get the response just resubmitted
    result = await formApi.getFormResponses({ formId: Config.form.id, originId, originType: 'PacketCommitteeForm' });

    //test that the correct values are returned
    values = PlatformFormApi.valuesFromFormResponse({ response: result[0], version });
    for (let i = 0; i < 3; i++) {
      expect(values[responseValues[i].label]).eq(
        responseValues[i].value,
        'Question ' + (i + 1).toString() + ' value matches',
      );
    }

    //delete the packet
    await packetApi.archive({ packetId: packetDetail.id, statusId: Config.status.id });
    await packetApi.delete({ id: packetDetail.id });
  });

  it('test submit/resubmit form by values', async () => {
    const packetApi = new PacketApi(Config.apiConfig);
    const formApi = new FormApi(Config.apiConfig);
    const workflowStepCommitteeApi = new WorkflowStepCommitteeApi(Config.apiConfig);

    const packetDetail = await packetApi.createFromTemplate({
      packetId: Config.packetTemplate.id,
      candidatePID: parseInt(Config.user.pid),
      candidateInvolvement: false,
      unitId: Config.unit.id,
    });

    await packetApi.moveForward({
      id: packetDetail.id,
      sendNotification: false,
    });

    const responseValues: { label: string; value: string | number }[] = [
      { label: 'Test Form Question 1', value: 'Answer 1' },
      { label: 'Test Form Question 2', value: 'Question Option 2' },
      { label: 'Test Form Question 3', value: '2021-03-03T04:00:00.000Z' },
    ];

    const requirements = await workflowStepCommitteeApi.getRequirements({
      packetId: packetDetail.id,
      workflowStepId: packetDetail.workflow_steps[1].id,
      committeeId: packetDetail.workflow_steps[1].committees[0].id,
    });
    const originId = requirements.required_platform_forms[0].id;

    //prepare the submission
    const version = await api.getFormVersionForWorkflowStep({ formId: Config.form.id, originId });

    //submit the response
    await api.submitCommitteeFormByValues({
      packetId: packetDetail.id,
      workflowStepName: packetDetail.workflow_steps[1].name as string,
      committeeName: packetDetail.workflow_steps[1].committees[0].name as string,
      formTitle: Config.form.title,
      responseValues,
    });

    //get the response just resubmitted
    let result = await formApi.getFormResponses({
      formId: Config.form.id,
      originId,
      originType: 'PacketCommitteeForm',
    });

    //test that the correct values are returned
    let values = PlatformFormApi.valuesFromFormResponse({ response: result[0], version });
    for (let i = 0; i < 3; i++) {
      expect(values[responseValues[i].label]).eq(
        responseValues[i].value,
        'Question ' + (i + 1).toString() + ' value matches',
      );
    }

    //adjust values for resubmission
    responseValues[0].value = 'Answer 1B';
    responseValues[1].value = 'Question Option 1';
    responseValues[2].value = '2021-03-05T04:00:00.000Z';

    //resubmit the response
    await api.resubmitCommitteeFormByValues({
      packetId: packetDetail.id,
      workflowStepName: packetDetail.workflow_steps[1].name as string,
      committeeName: packetDetail.workflow_steps[1].committees[0].name as string,
      formTitle: Config.form.title,
      submitterEmail: Config.currentUser.email,
      responseValues,
    });

    //get the response just resubmitted
    result = await formApi.getFormResponses({ formId: Config.form.id, originId, originType: 'PacketCommitteeForm' });

    //test that the correct values are returned
    values = PlatformFormApi.valuesFromFormResponse({ response: result[0], version });
    for (let i = 0; i < 3; i++) {
      expect(values[responseValues[i].label]).eq(
        responseValues[i].value,
        'Question ' + (i + 1).toString() + ' value matches',
      );
    }

    //delete the packet
    await packetApi.archive({ packetId: packetDetail.id, statusId: Config.status.id });
    await packetApi.delete({ id: packetDetail.id });
  });
});

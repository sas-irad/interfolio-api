import ApiRequest from '../../api-request';
import { ApiConfig } from '../../index';
import { PACKET_URL } from '../packet-api';
import { FormVersion } from '../form-api';

export const PLATFORM_FORM_BASE_URL = PACKET_URL + '/platform_forms';
export const PLATFORM_FORM_URL = PLATFORM_FORM_BASE_URL + '/{platform_form_id}';
export const PLATFORM_FORM_RESPONSE_BASE_URL = PLATFORM_FORM_URL + '/responses';
export const PLATFORM_FORM_RESPONSE_URL = PLATFORM_FORM_RESPONSE_BASE_URL + '/{response_id}';
export const PLATFORM_FORM_EXCLUDE_URL = PLATFORM_FORM_URL + '/exclusions/{committee_member_id}';

export type PlatformForm = {
  /** id of the form type */
  caasbox_form_id: number;
  /** id of the committee form is assinged to */
  committee_id: number;
  /** if only the committee manager needs to submit the form */
  committee_manager_only_submission: true;
  /** date the form instance was created */
  created_at: string;
  /** if downloading is allowed */
  downloading_allowed: true;
  /** level of access granted to view form */
  form_access_level: number;
  /** id of the form instance */
  id: number;
  /** id of the section where form data should be placed for reader */
  packet_section_id: number;
  /** location of the pdf file in s3 */
  pdf_s3_file_location: string;
  /** status of the pdf generation */
  pdf_status: string;
  /** date the pdf was last updated */
  pdf_updated_at: string;
  /** sort order of the form instance */
  sort_order: number;
  /** last date that the form was updated */
  updated_at: string;
  /** id of the workflow step to which this form instance belongs */
  workflow_step_id: number;
};

/** The responses to submit to a platform form */
export type PlatformFormSubmission = {
  /** the form version number */
  form_version_id: number;
  /** if the form should be submitted and marked as complete */
  submitted: boolean;
  /** the responses to the form */
  response_data: any;
};
/**
 * Response recieved when updating a form
 */
export type PlatformFormSubmissionResponse = {
  /** id of the form response */
  id: number;
  /** id of the form instance assigned to the packet */
  originId: number;
  /** not sure  */
  originType: string;
  /** the response data */
  responseData: { [questionKey: string]: string | number };
  /** if the form has been submitted */
  submitted: boolean;
  /** id of the user who created the form */
  createdBy: number;
  /** date when the form was created */
  createdAt: string;
  /** id of the user who last updated the form response */
  updatedBy: number;
  /** date when the form was updated */
  updatedAt: string;
  /** response statistics */
  statistics: {
    /** the number of questions on the form */
    total_questions: number;
    /** the total number of answered questions */
    total_answered_questions: number;
    /** the number of required questions on the form */
    required_questions: number;
    /** the number of required questions answered */
    required_questions_answered: number;
  };
  /** the version of the form submitted */
  formVersion: FormVersion;
  /** the title and id of the form that was submitted */
  form: {
    id: number;
    title: string;
  };
};

/**
 * Params needed to add a form to a packet workflow step
 */
export type AddWorkflowStepFormParams = {
  /** id of the committee */
  committeeId: number;
  /** if only the committee manager will submit this form */
  committeeManagerOnlySubmission: boolean;
  /** access level indicating who can view the form */
  formAccessLevel: number;
  /** id of the form to require */
  formId: number;
  /** id of the individual packet */
  packetId: number;
  /** section_id of the packet to include this form in */
  sectionId: number;
  /** the workflow step id where this form is required */
  workflowStepId: number;
};

/**
 * Type representing the responders assigned to submit a committee workflow step form
 */
export type PlatformFormResponder = {
  /** pid of the user */
  pid: number;
  /** id of the committee membership */
  committee_member_id: number;
  /** name of the committee member assigned */
  committee_member_name: string;
  /** email of the committee member assigned */
  committee_member_email: string;
  /** submission status */
  status: string;
  /** if the form has been submitted */
  submitted: boolean;
  /** total number of questions on form */
  form_total_questions: number;
  /** number of questions answers by committee member */
  form_total_questions_answered: number;
  /** total number of form questions required */
  form_total_required_questions: number;
  /** total number of required questions answered */
  form_total_required_questions_answered: number;
  /** if the response requirement has been ommitted */
  omitted: boolean;
};

/**
 * Class representing packet workflow step calls
 */
export class PlatformFormApi {
  /**
   * API request object for making the actual http requests
   */
  public apiRequest: ApiRequest;

  /**
   * Constructor for the object
   * @param apiConfig Configuration for API calls
   */
  constructor(apiConfig: ApiConfig) {
    this.apiRequest = new ApiRequest(apiConfig);
  }

  /**
   * Add a required form to a workflow step
   * @param committeeId
   * @param committeeManagerOnlySubmission
   * @param formAccessLevel
   * @param formId
   * @param packetId
   * @param sectionId
   * @param workflowStepId
   *
   * @example
   * ```javascript
   * let form = await api.Tenure.PlatformForms.addWorkflowStepForm({
   *   committeeId: 9999,
   *   committeeManagerOnlySubmission: false,
   *   formAccessLevel: 1,
   *   formId: 9999,
   *   packetId: 9999,
   *   sectionId: 9999
   *   workflowStepId: 9999
   * });
   * ```
   */
  async addWorkflowStepForm({
    committeeId,
    committeeManagerOnlySubmission,
    formAccessLevel,
    formId,
    packetId,
    sectionId,
    workflowStepId,
  }: AddWorkflowStepFormParams): Promise<PlatformForm> {
    return new Promise((resolve, reject) => {
      const url = PLATFORM_FORM_BASE_URL.replace('{packet_id}', packetId.toString());
      const form = {
        'platform_form[committee_id]': committeeId,
        'platform_form[committee_manager_only_submission]': committeeManagerOnlySubmission,
        'platform_form[form_access_level]': formAccessLevel,
        'platform_form[form_id]': formId,
        'platform_form[packet_id]': packetId,
        'platform_form[section_id]': sectionId,
        'platform_form[workflow_step_id]': workflowStepId,
      };
      this.apiRequest
        .executeRest({ url, method: 'POST', form })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Delete a platform form
   * @param id          id of the form instance
   * @param packetId    id of the case packet
   *
   * @example
   * ```javascript
   *  let deleted = await api.Tenure.PlatformForms.delete({id: 9999, packetId: 9999});
   * ```
   */
  async deleteForm({ id, packetId }: { id: number; packetId: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = PLATFORM_FORM_URL.replace('{platform_form_id}', id.toString()).replace(
        '{packet_id}',
        packetId.toString(),
      );
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  /**
   * Get the form version associated with a form assigned to a workflow step
   * @param formId  the main form type id of the form
   * @param originId  the form assignment instance to the workflow step
   *
   * @example
   * ```javascript
   * let formVersion = await api.Tenure.PlatformForms.getFormVersionForWorkflowStep({
   *  formId: 9999,
   *  originId: 9999
   * });
   */
  getFormVersionForWorkflowStep({ formId, originId }: { formId: number; originId: number }): Promise<FormVersion> {
    return new Promise((resolve, reject) => {
      const gqlRequest = {
        operationName: 'getFormByOrigin',
        query:
          'query getFormByOrigin {formVersionByOrigin(' +
          'formId: ' +
          formId.toString() +
          ', originId: ' +
          originId.toString() +
          ', originType: "PacketCommitteeForm")  {id versionData}}',
      };

      this.apiRequest
        .executeGraphQl(gqlRequest)
        .then((response) => {
          resolve(response.data.formVersionByOrigin);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Exclude a particular committee member from submitting a form response
   * @param packetId           ID of the packet
   * @param originId           ID of the form instance attached to workflow step
   * @param committeeMemberId  ID of the committee member
   *
   * @example
   * ```javascript
   * const omitted = await api.Tenure.PlatformForms.addCommitteeMemberExclusion({
   *  packetId: 9999,
   *  originId: 9999,
   *  committeeMemberId: 9999
   * })
   * ```
   */
  public addCommitteeMemberExclusion({
    packetId,
    originId,
    committeeMemberId,
  }: {
    packetId: number;
    originId: number;
    committeeMemberId: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = PLATFORM_FORM_EXCLUDE_URL.replace('{packet_id}', packetId.toString())
        .replace('{platform_form_id}', originId.toString())
        .replace('{committee_member_id}', committeeMemberId.toString());
      this.apiRequest
        .executeRest({ url, method: 'PUT' })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Exclude all unsubmmitted/un-omitted forms from the requirement to submit
   *
   * @param packetId  ID of the packet
   * @param originId  ID of the form instance assigned to the
   *
   * @example
   * ```javascript
   * const responders = await api.Tenure.PlatformForms.excludeUnsubmittedResponses({
   *  packetId: 9999,
   *  originId: 9999
   * });
   * ```
   */
  public excludeUnsubmittedResponses({ packetId, originId }: { packetId: number; originId: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getFormResponders({ packetId, originId })
        .then((responders) => {
          //loop through all the
          const excludePromises: Promise<boolean>[] = [];
          for (const responder of responders) {
            if (!responder.submitted && !responder.omitted) {
              excludePromises.push(
                this.addCommitteeMemberExclusion({
                  packetId: packetId,
                  originId: originId,
                  committeeMemberId: responder.committee_member_id,
                }),
              );
            }
          }
          if (excludePromises.length === 0) {
            resolve(true);
          } else {
            Promise.all(excludePromises).then(() => resolve(true));
          }
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Get the list of assigned responders for a form instance
   * @param packetId  ID of the packet
   * @param originId  ID of the form instance assigned to the workflow step committee
   *
   * @example
   * ```javascript
   * const responders = await api.Tenure.PlatformForms.getFormResponder({
   *  packetId: 9999,
   *  originId: 9999
   * });
   * ```
   */
  getFormResponders({ packetId, originId }: { packetId: number; originId: number }): Promise<PlatformFormResponder[]> {
    return new Promise((resolve, reject) => {
      const url = PLATFORM_FORM_RESPONSE_BASE_URL.replace('{packet_id}', packetId.toString()).replace(
        '{platform_form_id}',
        originId.toString(),
      );
      this.apiRequest
        .executeRest({ url: url })
        .then((response) => {
          resolve(response.results);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Remove a Previously Submitted Exclusion for a committee member for response
   * @param packetId           ID of the packet
   * @param originId           ID of the form instance
   * @param committeeMemberId  ID of the committee member
   *
   * @example
   * ```javascript
   * const nowRequired = await api.Tenure.PlatformForms.removeCommitteeMemberExclusion
   *  packetId: 9999,
   *  originId: 9999,
   *  committeeMemberId: 9999
   * })
   * ```
   */
  public removeCommitteeMemberExclusion({
    packetId,
    originId,
    committeeMemberId,
  }: {
    packetId: number;
    originId: number;
    committeeMemberId: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = PLATFORM_FORM_EXCLUDE_URL.replace('{packet_id}', packetId.toString())
        .replace('{platform_form_id}', originId.toString())
        .replace('{committee_member_id}', committeeMemberId.toString());
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /**
   * Submit a form response for the current user
   *
   * @param packetId   the packet id
   * @param platformFormId  id of the platform form
   * @param submission  the form submission
   *
   * @example
   * ```javascript
   * let formVersion await api.Tenure.PlatformForms.getFormVersionForWorkflowStep({
   *  formId: 9999,
   *  originId: 9999
   * });
   *
   * let submission = api.Tenure.PlatformForms.formSubmissionFromValues({
   *   formVersion: formVersion,
   *   responseValues: [{label: "Question 1", value: "Answer 1}, {label: "Question 2", value: "answer 2"}]
   * };
   *
   * let response = api.Tenure.PlatformForms.submitFormResponse({
   *   packetId: 9999,
   *   platformFormId: 9999,
   *   submission: submission
   * }
   * ```
   *
   */
  submitFormResponse({
    packetId,
    platformFormId,

    submission,
  }: {
    packetId: number;
    platformFormId: number;
    submission: PlatformFormSubmission;
  }): Promise<PlatformFormSubmissionResponse> {
    return new Promise((resolve, reject) => {
      const url = PLATFORM_FORM_RESPONSE_BASE_URL.replace('{packet_id}', packetId.toString()).replace(
        '{platform_form_id}',
        platformFormId.toString(),
      );
      this.apiRequest
        .executeRest({ url: url, method: 'POST', json: submission })
        .then((response) => {
          resolve(response.data.createFormResponse.formResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * given a form version and response values format the form submission
   * @param formVersion
   * @param responseValues
   */
  public formSubmissionFromValues({
    formVersion,
    responseValues,
  }: {
    formVersion: FormVersion;
    responseValues: { label: string; value: string | number }[];
  }): PlatformFormSubmission {
    const formSubmission: PlatformFormSubmission = {
      form_version_id: formVersion.id,
      response_data: {},
      submitted: true,
    };

    for (const responseValue of responseValues) {
      for (const fieldSet of formVersion.versionData.fieldsets) {
        for (const field of fieldSet.fields) {
          if (field.label === responseValue.label) {
            //get the correct select option
            if ((field.field_type === 'select' || field.field_type === 'radio') && field.meta.options !== undefined) {
              for (const option of field.meta.options) {
                if (option.label === responseValue.value) {
                  formSubmission.response_data[field.id] = option.value;
                }
              }
            }

            //format the date
            else if (
              field.field_type === 'collection' &&
              field.meta !== undefined &&
              field.meta.schema !== undefined &&
              field.meta.schema[0] !== undefined &&
              field.meta.schema[0].field_type === 'date'
            ) {
              formSubmission.response_data[field.id] = [{ [field.id + '_date']: responseValue.value }];
            }

            //add a simple field response
            else {
              formSubmission.response_data[field.id] = responseValue.value;
            }

            break;
          }
        }
      }
    }
    return formSubmission;
  }
}

export default PlatformFormApi;

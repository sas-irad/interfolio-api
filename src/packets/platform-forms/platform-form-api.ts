import ApiRequest from '../../api-request';
import { ApiConfig } from '../../index';
import { PACKET_URL } from '../packet-api';
import { FormVersion } from '../../forms/form-api';

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
  responseData: any;
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
 * Class representing packet workflow step calls
 */
export class PlatformFormApi {
  /**
   * API request object for making the actual http requests
   */
  private readonly apiRequest: ApiRequest;

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
   * let form = await api.Packets.PlatformForms.addWorkflowStepForm({
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
   *  let deleted = await api.Packets.PlatformForms.delete({id: 9999, packetId: 9999});
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
   *
   * @param packetId
   * @param platformFormId
   * @param submission
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
        .executeRest({ url: url, method: 'POST', form: submission })
        .then((response) => {
          resolve(response.data.createFormResponse.formResponse);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default PlatformFormApi;

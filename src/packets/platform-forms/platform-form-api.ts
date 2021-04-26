import ApiRequest from '../../api-request';
import { ApiConfig } from '../../index';
import { PACKET_URL } from '../packet-api';

export const PLATFORM_FORM_BASE_URL = PACKET_URL + '/platform_forms';
export const PLATFORM_FORM_URL = PLATFORM_FORM_BASE_URL + '/{platform_form_id}';

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
}

export default PlatformFormApi;

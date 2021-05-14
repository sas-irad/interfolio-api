import ApiRequest, { RestRequest } from '../../../api-request';
import { ApiConfig } from '../../../index';
import { WORKFLOW_STEP_URL } from '../workflow-step-api';
import { INTERFOLIO_BYC_TENURE_V2 } from '../../../api-request';

const WORKFLOW_STEP_COMMITTEE_BASE_URL = WORKFLOW_STEP_URL + '/committees';
const WORKFLOW_STEP_COMMITTEE_URL = WORKFLOW_STEP_COMMITTEE_BASE_URL + '/{committee_id}';
const WORKFLOW_STEP_REQUIREMENTS_URL =
  INTERFOLIO_BYC_TENURE_V2 +
  '/packets/{packet_id}/workflow_steps/{workflow_step_id}/committees/{committee_id}/committee_required_documents';
const WORKFLOW_STEP_COMITTEE_ASSIGN_URL = WORKFLOW_STEP_URL + '/assign_committee';
const COMMITTEE_REQUIREMENT_BASE_URL = WORKFLOW_STEP_COMMITTEE_URL + '/committee_required_documents';
const COMMITTEE_REQUIREMENT_URL = COMMITTEE_REQUIREMENT_BASE_URL + '/{requirement_id}';
const FULFILL_REQUIREMENT_URL = COMMITTEE_REQUIREMENT_BASE_URL + '/{requirement_id}/fulfill';

/**
 * Data concerning a form which has been assigned as a requirement to a workflow step committee
 */
export type RequiredPlatformForm = {
  /** Id of the form as assigned to the workflow step */
  id: number;
  /** name of the form */
  form_name: string;
  /** id of the overall form type */
  caasbox_form_id: number;
  /** id of the associated workflow step */
  workflow_step_id: number;
  /** id of the committee assigned to complete the form */
  committee_id: number;
  /** section_id of the packet section where the form data will be put */
  packet_section_id: number;
  /** packet section name where the form information will be included */
  packet_section_name: string;
  /** accesss level indiciating which roles can view the form informtion */
  form_access_level: number;
  /** order for the form among all required forms for the workflow step */
  sort_order: number;
  /** if the form is for committee manager submission only */
  committee_manager_only_submission: boolean;
  /** date the form requirement was first created */
  created_at: 'Apr 28; 2021 at 8:33 AM';
  /** date the form requirement was updated */
  updated_at: string;
  /** if the form has reponses submitted yet */
  has_responses: boolean;
};

/**
 * A specified type for th
 */
export type CommitteeRequiredDocument = {
  /** id of the requirement */
  id: number;
  /** name of the required document */
  name: string;
  /** name of the workflow step committee id */
  workflow_step_committee_id: number;
  /** date requirement was created */
  created_at: string;
  /** date requirement was updated */
  updated_at: string;
  /** description of the requirement */
  description?: string;
  /** id of the attachment fulfilling the document */
  packet_attachment_id?: number;
};

export type CommitteeRequirements = {
  required_documents: CommitteeRequiredDocument[];
  required_platform_forms: RequiredPlatformForm[];
};
/**
 * Class representing workflow step committee calls
 */
export class WorkflowStepCommitteeApi {
  /**
   * API request object for making the actual http requests
   */
  public readonly apiRequest: ApiRequest;

  /**
   * Constructor for the object
   * @param apiConfig Configuration for API calls
   */
  constructor(apiConfig: ApiConfig) {
    this.apiRequest = new ApiRequest(apiConfig);
  }

  public addDocumentRequirement({
    packetId,
    workflowStepId,
    committeeId,
    name,
    description,
  }: {
    packetId: number;
    workflowStepId: number;
    committeeId: number;
    name: string;
    description?: string;
  }): Promise<CommitteeRequiredDocument> {
    return new Promise((resolve, reject) => {
      const url = COMMITTEE_REQUIREMENT_BASE_URL.replace('{packet_id}', packetId.toString())
        .replace('{workflow_step_id}', workflowStepId.toString())
        .replace('{committee_id', committeeId.toString());
      const form: {
        'committee_required_document[name]': string;
        'committee_required_document[description]'?: string;
      } = {
        'committee_required_document[name]': name,
      };
      if (description) {
        form['committee_required_document[description]'] = description;
      }
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
   * Assign a committee to a workflow step
   *
   * @param packetId  id of the case packet
   * @param workflowStepId  id of the workflow step
   * @param committeeId id of the committee
   * @param note note to include as instructions for the committee
   *
   *
   * @example
   * ```javascript
   * let added = await api.Tenure.WorkflowStepCommittee.assign({
   *  packetId: 9999,
   *  workflowStepId: 9999,
   *  committeeId: 9999,
   *  note: "Instructions to Committee"
   * });
   */
  public assign({
    packetId,
    workflowStepId,
    committeeId,
    note,
  }: {
    packetId: number;
    workflowStepId: number;
    committeeId: number;
    note?: string;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url =
        WORKFLOW_STEP_COMITTEE_ASSIGN_URL.replace('{packet_id}', packetId.toString()).replace(
          '{workflow_step_id}',
          workflowStepId.toString(),
        ) +
        '?committee_id=' +
        committeeId.toString();
      let requestParams: RestRequest;
      if (note) {
        requestParams = { url, method: 'PUT', form: { note: note } };
      } else {
        requestParams = { url, method: 'PUT' };
      }
      //add in note if it is supplied
      this.apiRequest
        .executeRest(requestParams)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Delete a workflow step committee
   * @param packetId   id of the packet
   * @param workflowStepId  id of the workflow step
   * @param committeeId  id of the committee
   *
   * @example
   * ```javascript
   * let deleted = await api.Tenure.WorkflowStepCommittee.delete({
   *  packetId: 9999,
   *  workflowStepId: 9999,
   *  committeeId: 9999
   * });
   */
  public delete({
    packetId,
    workflowStepId,
    committeeId,
  }: {
    packetId: number;
    workflowStepId: number;
    committeeId: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = WORKFLOW_STEP_COMMITTEE_URL.replace('{packet_id}', packetId.toString())
        .replace('{workflow_step_id}', workflowStepId.toString())
        .replace('{committee_id}', committeeId.toString());
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
   * Delete a workflow step committee requirement for a document
   * @param packetId        ID of the packet
   * @param workflowStepId  ID of the workflow step
   * @param committeeId     ID of the committee
   * @param requirementId   ID of the requirement to delete
   *
   * @example
   * ```javascript
   * const deleted = await api.Tenure.WorkflowStepCommittee.deleteDocumentRequirement({
   *   packetId: 9999,
   *   workflowStepId: 9999,
   *   committeeId: 9999,
   *   requirementId: 9999
   * }
   */
  public deleteDocumentRequirement({
    packetId,
    workflowStepId,
    committeeId,
    requirementId,
  }: {
    packetId: number;
    workflowStepId: number;
    committeeId: number;
    requirementId: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = COMMITTEE_REQUIREMENT_URL.replace('{packet_id}', packetId.toString())
        .replace('{workflow_step_id}', workflowStepId.toString())
        .replace('{committee_id}', committeeId.toString())
        .replace('{requirement_id}', requirementId.toString());
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  /**
   * Fulfill a workflow step committee document requirement
   * @param packetId        ID of the packet
   * @param workflowStepId  ID of the workflow step
   * @param committeeId     ID of the committee
   * @param requirementId   ID of the requirement
   * @param attachmentId    ID of the attachment
   *
   * @todo create example and write test
   */
  public fulfillDocumentRequirement({
    packetId,
    workflowStepId,
    committeeId,
    requirementId,
    attachmentId,
  }: {
    packetId: number;
    workflowStepId: number;
    committeeId: number;
    requirementId: number;
    attachmentId: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = FULFILL_REQUIREMENT_URL.replace('{packet_id}', packetId.toString())
        .replace('{workflow_step_id}', workflowStepId.toString())
        .replace('{committee_id}', committeeId.toString())
        .replace('{requirement_id}', requirementId.toString());
      const requestParams: RestRequest = {
        url: url,
        method: 'POST',
        form: { packet_attachment_id: attachmentId },
      };
      this.apiRequest
        .executeRest(requestParams)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Get the requirements for a workflow step
   * @param packetId   ID of the packet
   * @param workflowStepId  ID of the workflowstep
   * @param committeeId  ID of the committee
   *
   * @example
   * ```javascript
   * let requirements = await api.Tenure.WorkflowStepCommittees.getRequirements({
   *   packetId: 9999,
   *   workflowStepId: 9999,
   *   committeeId: 9999
   * }
   */
  public getRequirements({
    packetId,
    workflowStepId,
    committeeId,
  }: {
    packetId: number;
    workflowStepId: number;
    committeeId: number;
  }): Promise<CommitteeRequirements> {
    return new Promise((resolve, reject) => {
      const url = WORKFLOW_STEP_REQUIREMENTS_URL.replace('{packet_id}', packetId.toString())
        .replace('{workflow_step_id}', workflowStepId.toString())
        .replace('{committee_id}', committeeId.toString());
      this.apiRequest
        .executeRest({ url: url })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default WorkflowStepCommitteeApi;

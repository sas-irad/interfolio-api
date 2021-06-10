import ApiRequest, { RestRequest } from '../../../api-request';
import { ApiConfig } from '../../../index';
import WorkflowStepApi, { WORKFLOW_STEP_URL, WorkflowStepCommitteeSummary } from '../workflow-step-api';
import { INTERFOLIO_BYC_TENURE_V2 } from '../../../api-request';
import PlatformFormApi from '../platform-form-api';

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
export type CommitteeFormRequirement = {
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
export type CommitteeDocumentRequirement = {
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

/**
 * The requirements specified for a workflow step committee
 */
export type CommitteeRequirements = {
  required_documents: CommitteeDocumentRequirement[];
  required_platform_forms: CommitteeFormRequirement[];
};

/**
 * Class representing workflow step committee calls
 */
export class WorkflowStepCommitteeApi {
  /**
   * API request object for making the actual http requests
   */
  public readonly apiRequest: ApiRequest;
  private readonly platformFormApi: PlatformFormApi;

  /**
   * Constructor for the object
   * @param config Configuration for API calls
   */
  constructor(config: ApiConfig | ApiRequest) {
    if (config.constructor && config.constructor.name === 'ApiRequest') {
      this.apiRequest = config as ApiRequest;
    } else {
      const apiConfig = config as ApiConfig;
      this.apiRequest = new ApiRequest(apiConfig);
    }
    this.platformFormApi = new PlatformFormApi(config);
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
  }): Promise<CommitteeDocumentRequirement> {
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
   * let added = await api.Tenure.WorkflowStepCommittees.assign({
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
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  /**
   * Copy all the requirements from one workflow step committee to another workflow step committee assigned to the same step
   * @param packetId          Id of the packet
   * @param workflowStepId    ID of the workflow step
   * @param fromCommitteeId   ID of the committee to copy requirements from
   * @param toCommitteeId     ID of the committee to copy requirements to
   *
   * @example
   * ```javascript
   * let newCommittee = await api.Tenure.WorkflowStepCommittees.copy){
   *   packetId: 9999,
   *   workflowStepId: 9999,
   *   fromCommitteeId: 9999,
   *   toCommitteeId: 9999
   * }
   * ```
   */
  public copyRequirements({
    packetId,
    workflowStepId,
    fromCommitteeId,
    toCommitteeId,
  }: {
    packetId: number;
    workflowStepId: number;
    fromCommitteeId: number;
    toCommitteeId: number;
  }): Promise<WorkflowStepCommitteeSummary> {
    const reqs = this.getRequirements({ packetId, workflowStepId, committeeId: fromCommitteeId });
    const docsCopied = reqs.then((reqs) =>
      this.copyDocumentRequirements({
        packetId,
        workflowStepId,
        toCommitteeId,
        documentRequirements: reqs.required_documents,
      }),
    );
    const formsCopied = reqs.then((reqs) =>
      this.copyFormRequirements({
        packetId,
        workflowStepId,
        toCommitteeId,
        formRequirements: reqs.required_platform_forms,
      }),
    );

    return Promise.all([docsCopied, formsCopied]).then(() =>
      this.getWorkflowStepCommitteeSummary({ packetId, workflowStepId, committeeId: toCommitteeId }),
    );
  }

  public copyDocumentRequirements({
    packetId,
    workflowStepId,
    toCommitteeId,
    documentRequirements,
  }: {
    packetId: number;
    workflowStepId: number;
    toCommitteeId: number;
    documentRequirements: CommitteeDocumentRequirement[];
  }): Promise<boolean> {
    const copyPromises = [];
    for (const req of documentRequirements) {
      copyPromises.push(
        this.addDocumentRequirement({
          packetId: packetId,
          workflowStepId: workflowStepId,
          committeeId: toCommitteeId,
          name: req.name,
          description: req.description,
        }),
      );
    }
    return Promise.all(copyPromises).then(() => true);
  }

  public copyFormRequirements({
    packetId,
    workflowStepId,
    toCommitteeId,
    formRequirements,
  }: {
    packetId: number;
    workflowStepId: number;
    toCommitteeId: number;
    formRequirements: CommitteeFormRequirement[];
  }): Promise<boolean> {
    const copyPromises = [];
    for (const req of formRequirements) {
      copyPromises.push(
        this.platformFormApi.addWorkflowStepForm({
          packetId: packetId,
          formId: req.caasbox_form_id,
          workflowStepId: workflowStepId,
          committeeId: toCommitteeId,
          sectionId: req.packet_section_id,
          formAccessLevel: req.form_access_level,
          committeeManagerOnlySubmission: req.committee_manager_only_submission,
        }),
      );
    }
    return Promise.all(copyPromises).then(() => true);
  }

  /**
   * Delete a workflow step committee
   * @param packetId   id of the packet
   * @param workflowStepId  id of the workflow step
   * @param committeeId  id of the committee
   *
   * @example
   * ```javascript
   * let deleted = await api.Tenure.WorkflowStepCommittees.delete({
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
   * const deleted = await api.Tenure.WorkflowStepCommittees.deleteDocumentRequirement({
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
   * @example
   * ```javascript
   * const fulfilled = await api.Tenure.PacketAttachments.fulFillDocumentRequirement({
   *  packetId: 9999,
   *  workflowStepId: 9999,
   *  requirementId: 9999,
   *  attachmentId: 9999
   * })
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

  /**
   * Get the workflow step committee summary
   * @param packetId        ID of the packet
   * @param workflowStepId  ID of the workflow step
   * @param committeeId     ID of the committee
   *
   * @example
   * ```javascript
   * const committee = await api.Tenure.WorkflowStepCommittees.getWorkflowStepCommitteeSummary({
   *   packetId: 9999,
   *   workflowStepId: 9999,
   *   committeeId: 9999
   * });
   * ```
   */
  public getWorkflowStepCommitteeSummary({
    packetId,
    workflowStepId,
    committeeId,
  }: {
    packetId: number;
    workflowStepId: number;
    committeeId: number;
  }): Promise<WorkflowStepCommitteeSummary> {
    return new Promise((resolve, reject) => {
      const workflowStepApi = new WorkflowStepApi(this.apiRequest);
      workflowStepApi
        .getWorkflowStep({ packetId: packetId, workflowStepId: workflowStepId })
        .then((step) => {
          let committeeMatch = null;
          for (const committee of step.committees) {
            if (committee.id === committeeId) {
              committeeMatch = committee;
            }
          }
          if (committeeMatch === null) {
            reject('No committee with id ' + committeeId.toString() + ' found in corresponding workflow step');
          } else {
            resolve(committeeMatch);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  /**
   * Insert a workflow step committee and move all the requirements/forms/instructions to the new committee then delete the original committee
   * @param packetId
   * @param workflowStepId
   * @param fromCommitteeId
   * @param toCommitteeId
   */
  public swapCommittees({
    packetId,
    workflowStepId,
    fromCommitteeId,
    toCommitteeId,
  }: {
    packetId: number;
    workflowStepId: number;
    fromCommitteeId: number;
    toCommitteeId: number;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      //get the from committee
      this.getWorkflowStepCommitteeSummary({ packetId, workflowStepId, committeeId: fromCommitteeId })
        .then((fromCommittee) => {
          //assign the committee note
          this.assign({
            packetId,
            workflowStepId,
            committeeId: toCommitteeId,
            note: fromCommittee.note || '',
          });
        })
        .then(() =>
          this.copyRequirements({ packetId, workflowStepId, fromCommitteeId, toCommitteeId }).then(() =>
            this.delete({ packetId, workflowStepId, committeeId: fromCommitteeId }),
          ),
        )
        .then(() => resolve(true))
        .catch((e) => reject(e));
    });
  }

  /**
   * Update instructions/note for a workflows step committee - uses same call as "assign" function
   * @param packetId         ID of the packet
   * @param workflowStepId   ID of the workflow step
   * @param committeeId      ID of the committee
   * @param note             Note for committee (can have simple html formatting)
   *
   * @example
   * ```javascript
   * const updated = await api.Tenure.WorkflowStepCommittees.update({
   *   packetId: 9999,
   *   workflowStepId: 9999,
   *   committeeId: 9999,
   *   note: "<p>here is my note</p><p>With a second paragraph</p>"
   * }
   * ```
   */
  public update({
    packetId,
    workflowStepId,
    committeeId,
    note,
  }: {
    packetId: number;
    workflowStepId: number;
    committeeId: number;
    note: string;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = WORKFLOW_STEP_COMMITTEE_URL.replace('{packet_id}', packetId.toString())
        .replace('{workflow_step_id}', workflowStepId.toString())
        .replace('{committee_id}', committeeId.toString());
      this.apiRequest
        .executeRest({ url, method: 'PUT', form: { note: note } })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default WorkflowStepCommitteeApi;

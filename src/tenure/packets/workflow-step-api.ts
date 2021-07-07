/**
 * Class representing packet Workflow Step API Calls
 */
import ApiRequest, { ApiResponse } from '../../api-request';
import { ApiConfig } from '../../index';
import { CommitteeMember } from '../committees/committee-member-api';
import { PACKET_URL, PacketDetail } from '../packet-api';
import Utils, { DeNestingDef } from '../../utils';

export const WORKFLOW_STEP_BASE_URL = PACKET_URL + '/workflow_steps';
export const WORKFLOW_STEP_URL = WORKFLOW_STEP_BASE_URL + '/{workflow_step_id}';

import WorkflowStepCommitteeApi from './workflow-steps/workflow-step-committee-api';

/**
 * Summary data for a workflow step committee
 */
export type WorkflowStepCommitteeSummary = {
  /** number of members assigned to this committee */
  committee_member_count: number;
  /** list of committee members */
  committee_members: CommitteeMember[];
  /** number of form requirements for this committee for this step */
  form_requirements_count: number;
  /** id of the committee */
  id: number;
  /** if this committee represents an indvidual */
  individual_committee: boolean;
  /** name of the committee */
  name: string;
  /** note related to the workflow step for this committee */
  note: string | null;
  /** list of recused committee members */
  recused_committee_members: CommitteeMember[];
  /** list of committee required documents */
  requirements_count: number;
  /** if all committee requiremenst have been fulfilled */
  requirements_fulfilled: boolean;
  /** if this committee is restricted */
  restricted: boolean;
  /** if this is a standing committee */
  standing: boolean;
  /** the type of committee eg. StandingCommittee */
  type: string;
  /** unit id of the committee */
  unit_id: number;
};

/**
 * Workflow step
 */
export type WorkflowStep = {
  /** list of administrators who have access over this packets/workflow step */
  administrators: {
    /** administrator email */
    email: string;
    /** administrator first name*/
    first_name: string;
    /** administrator last name */
    last_name: string;
    /** administrator p-id*/
    pid: number;
    /** if this administrator is recused */
    recused: boolean;
    /** unit to which administrator access is granted */
    unit: {
      /** id of the admnistrator unit */
      id: number;
      /** name of the administrator unit */
      name: string;
      /** parent unit id of the administrator unit */
      parent_unit_id: number | null;
    };
    /** user id of the administrator */
    user_id: number;
  }[];
  /** committees assigned to this workflow step */
  committees: WorkflowStepCommitteeSummary[];
  /** time the workflow step was created */
  created_at: string;
  /** if this is the currently workflow step */
  current: boolean;
  /** due date for the workflow step */
  due_date: string | null;
  /** displayed due date */
  due_date_display: string | null;
  /** id of the workflow step */
  id: number;
  /** name of the workflow step */
  name: string | null;
  /** note for this workflow step */
  note: string | null;
  /** step number order */
  step_number: number;
};

/**
 * Class representing packet workflow step calls
 */
export class WorkflowStepApi {
  /**
   * API request object for making the actual http requests
   */
  public readonly apiRequest: ApiRequest;

  /** Handle to the WorkflowStepCommitteeApi */
  public Committees: WorkflowStepCommitteeApi;
  /**
   * Constructor for the object
   * @param config Configuration for API calls - of type either ApiConfig or ApiRequest
   *
   * note pass in ApiRequest to keep all errors in one object instance
   */
  constructor(config: ApiConfig | ApiRequest) {
    if (config.constructor && config.constructor.name === 'ApiRequest') {
      this.apiRequest = config as ApiRequest;
    } else {
      const apiConfig = config as ApiConfig;
      this.apiRequest = new ApiRequest(apiConfig);
    }
    this.Committees = new WorkflowStepCommitteeApi(config);
  }

  /**
   * Add a workflow step with a standing committee
   *
   * @example
   * ```javascript
   * let step = await api.Tenure.WorkflowSteps.addWorkflowStepStanding({
   *   packetId: 9999,
   *   workflowStepName: "Workflow Step 3",
   *   committeeId: 9999,
   *   workflowStepNote: "Please review and send forward"
   * };
   */
  addWorkflowStepStanding({
    packetId,
    workflowStepName,
    committeeId,
    workflowStepDueDate,
    workflowStepNote,
  }: {
    /** packet id */
    packetId: number;
    /** name of the workflow step */
    workflowStepName: string;
    /** id of the standing committee for the step */
    committeeId: number;
    /** due date for the workflow step */
    workflowStepDueDate?: string;
    /** note for the workflow step */
    workflowStepNote?: string;
  }): Promise<WorkflowStep> {
    return new Promise((resolve, reject) => {
      const url = WORKFLOW_STEP_BASE_URL.replace('{packet_id}', packetId.toString());
      const formData: {
        'workflow_step[name]': string;
        'workflow_step[committee_id]': number;
        'workflow_step[due_date]': string;
        'workflow_step[note]'?: string;
      } = {
        'workflow_step[name]': workflowStepName,
        'workflow_step[due_date]': workflowStepDueDate ? workflowStepDueDate : '',
        'workflow_step[committee_id]': committeeId,
      };
      if (workflowStepNote) {
        formData['workflow_step[note]'] = workflowStepNote;
      }

      this.apiRequest
        .executeRest({ url: url, method: 'POST', form: formData })
        .then(async (response) => {
          //go get the step
          try {
            const step = await this.getWorkflowStep({ packetId: packetId, workflowStepId: response.id });
            resolve(step);
          } catch (error) {
            reject(error);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Delete an existing workflow step
   * @param id ID of the workflow step
   * @param packetId ID of the packet
   *
   * @example
   * ```javascript
   * await api.Tenure.WorkflowSteps.deleteWorkflowStep({id: 9999, packetId: 9999});
   * ```
   */
  deleteWorkflowStep({ id, packetId }: { id: number; packetId: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = WORKFLOW_STEP_URL.replace('{packet_id}', packetId.toString()).replace(
        '{workflow_step_id}',
        id.toString(),
      );
      this.apiRequest
        .executeRest({ url: url, method: 'DELETE' })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Get the workflow step
   * @param packetId       id of the packet
   * @param workflowStepId id of the workflow step
   *
   * @example
   * ```javascript
   * let step = await api.Tenure.WorkflowStep.getWorkflowStep({packetId: 9999, workflowStepId: 9999});
   */
  getWorkflowStep({
    packetId,
    workflowStepId,
  }: {
    /** packet id of the workflow step */
    packetId: number;
    /** workflow step id */
    workflowStepId: number;
  }): Promise<WorkflowStep> {
    return new Promise((resolve, reject) => {
      const url = WORKFLOW_STEP_URL.replace('{packet_id}', packetId.toString()).replace(
        '{workflow_step_id}',
        workflowStepId.toString(),
      );
      this.apiRequest
        .executeRest({ url: url })
        .then((response) => {
          const step = WorkflowStepApi.removeWorkflowStepNesting(response.workflow_step);
          resolve(step);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Get workflow step from packet detail and workflow step name
   * @param packetDetail      Packet Detail object
   * @param workflowStepName  Name of the workflow step
   *
   * @example
   * ```javascript
   * import WorkflowStepApi from "@sas-irad/interfolio-api/lib/tenure/packets/workflow-step-api";
   * const detail = await api.Tenure.Packets.getDetail(9999);
   * const workflowStep = WorkflowStepApi.getWorkflowStepFromName({
   *   packetDetail: detail,
   *   sectionName: "Section Name"
   * };
   * ```
   *
   */
  public static findWorkflowStepFromName({
    packetDetail,
    workflowStepName,
  }: {
    packetDetail: PacketDetail;
    workflowStepName: string;
  }): WorkflowStep | null {
    for (const step of packetDetail.workflow_steps) {
      if (step.name === workflowStepName) {
        return step;
      }
    }
    return null;
  }

  /**
   * Reorder the workflow steps
   * @param packetId                 Id of the packet to reorder the steps for
   * @param orderedWorkflowStepIds   array of workflow step ids in the desired order (do not include 0th step id)
   *
   * @example
   * ```javascript
   */
  public reorderWorkflowSteps({
    packetId,
    orderedWorkflowStepIds,
  }: {
    packetId: number;
    orderedWorkflowStepIds: number[];
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let url = WORKFLOW_STEP_BASE_URL + '/reorder';
      url = url.replace('{packet_id}', packetId.toString());
      this.apiRequest
        .executeRest({ url, method: 'PUT', json: { workflow_step_ids: orderedWorkflowStepIds } })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Updates the name and due date for a workflow step
   * @param packetId        ID of the Packet
   * @param workflowStepId  ID of the Workflow Step
   * @param name            Name of the workflow step
   * @param dueDate         Due Date for the workflow step  (YYYY-MM-DD)
   *
   * @example
   * ```javascript
   * const updated = await api.Tenure.WorkflowStep.update({
   *   packetId: 9999,
   *   workflowStepId: 9999,
   *   name: "New Workflow Step Name"
   *   dueDate: '2021-01-01'
   * });
   * ```
   */
  public update({
    packetId,
    workflowStepId,
    name,
    dueDate,
  }: {
    packetId: number;
    workflowStepId: number;
    name: string;
    dueDate?: string;
  }): Promise<boolean> {
    const json = {
      workflow_step: {
        name: name,
        due_date: dueDate ? dueDate : null,
      },
    };
    return new Promise((resolve, reject) => {
      let url = WORKFLOW_STEP_URL;
      url = url.replace('{packet_id}', packetId.toString()).replace('{workflow_step_id}', workflowStepId.toString());
      this.apiRequest
        .executeRest({ url, method: 'PUT', json: json })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Remove the cumbersome second level for committee members
   * @param apiResponse  The response from the API to remove the nesting from
   */
  private static removeWorkflowStepNesting(apiResponse: ApiResponse): WorkflowStep {
    const denestDef: DeNestingDef = {
      committees: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'committee',
      },
    };
    const workflowStep: WorkflowStep = Utils.deNest(apiResponse, denestDef) as WorkflowStep;

    return workflowStep;
  }
}

export default WorkflowStepApi;

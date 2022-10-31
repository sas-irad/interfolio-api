import { ApiConfig } from '../index';
import Utils, { DeNestingDef } from '../utils';
import ApiRequest, {ApiResponse, INTERFOLIO_SEARCH_V2} from '../api-request';
import { INTERFOLIO_SEARCH_V1 } from '../api-request';
import ApplicationApi from "./positions/application-api";

/**
 * @const Base url for position api calls
 */
export const POSITION_BASE_URL = INTERFOLIO_SEARCH_V1 + '/positions';
export const POSITION_URL = POSITION_BASE_URL + '/{position_id}';
export const POSITION_FILTER_URL = INTERFOLIO_SEARCH_V2 + '/positions/filter?limit={limit}&page={page}&sort_by={sort_by}&sort_order={sort_order}'

/**
 * Workflow steps in the position
 */
export type PositionWorkflowStep = {
  /** id of the workflow step */
  id: number;
  /** name of the workflow step */
  name: string;
  /** order number of the workflow step */
  step_number: number;
  /** if this is the current workflow step */
  current: boolean;
  /** due date of the workflow step */
  due_date: string;
  /** if the due date should be displayed */
  due_date_display: boolean;
  /** date the that workflow step was created */
  created_at: string;
  /** workflow step category id */
  category_id: number;
  /** category name of the workflow step */
  category_name: string;
  /** @todo flesh out assignments and add to de-nesting */
  /** users assigned to the workflow step */
  assignments: any[];
  /** note associated with this workflow step */
  note: string;
}

  /**
   * An Interfolio position base definition on which PositionInsert and PositionDetail is based
 */
export type PositionBase = {
  /** Name of the position */
  name: string;
  /** Type id of the position (e.g. faculty staff etc) */
  position_type_id: number;
  /** Unit id of the position */
  unit_id: number;
  /** description of the position */
  description?: string;
  /** location of the position */
  location?: string;
  /** qualifcations required for the position */
  qualifications?: string;
  /** application instructions for the position */
  instructions?: string;
  /** job requisition number */
  job_requisition_number?:  string;
  /** salary range for the position */
  salary_range?: string;
  /** position term id for the position */
  position_term_id?: number;
  /** funding source for the position */
  funding_source?: string;
  /** hiring plan for the position */
  hiring_plan?: string;
  /** notes for the position */
  notes?: string;
  /** opening date for the position */
  open_date?: string;
  /** closing date for the position */
  close_date?: string;
  /** if the position is published*/
  published?: boolean;
  /** if additional documents are allowed*/
  allow_additional_documents?: boolean;
  /** if the position has been archived */
  archived?: boolean;
  /** if the applicants should have blind review*/
  blind_review?: boolean;
  /** if the position has been manually closed regardless of close date*/
  close_flag?: boolean;
  /** id of the position status */
  position_status_id?: number;
  /** body of the application receipt message */
  application_receipt_message_body?: string;
  /** subject of the application receipt message */
  application_receipt_message_subject?: string;
  /** reply to for the application receipt message */
  application_receipt_message_reply_to?: string;
  /** from address for the application receipt message */
  application_receipt_message_from?: string;
  /** rank for the position */
  rank?: string;
  /** title for the position */
  title?: string;
  /** discipline for the position */
  discipline?: string;
  /** start date for the position */
  position_start_date?: string;
  /** the appointment type for the position */
  appointment_type?: string;
  /** if the position is private */
  private_flag?: boolean;
  /** reason for the position */
  reason?: string;
  /** advertising explanation for the postiion */
  advertising_explanation?: string;
};

export type PositionInsert = PositionBase & {
  /** from name to be used in requirements email */
  from?: string;
  /** reply to email address to be used in requirements email */
  reply_to?: string;
};

export type PositionDetail = PositionBase & {
  /** ID of the position */
  id: number;
  /** institution id for the position  */
  institution_id: number;
  /** eeo statement for the position */
  eeo_statement:  string;
  /** time the position was created */
  created_at: string;
  /** time the position was last updated */
  updated_at: string;
  /** the type of record (e.g. Position) */
  type: string;
  /** the template used to create the position */
  position_template_id: string;
  /** user_id of the user that created the position */
  user_id: 153556,
  /** if the derived eeo statement should be used*/
  use_derived_eeo_statement: boolean;
  /** id for the receipt message template for the position */
  application_receipt_message_template_id: string;
  /** if the position has been approved*/
  approved: boolean;
  /** id of the user who approved the position*/
  approved_by: number;
  /** workday position this position is related to*/
  workday_position: boolean;
  /** id of the committee reviewing the position */
  committee_id: number;
  /** id of the requirement template used to create requirements for this position */
  requirement_template_id: number;
  /** unknown */
  choice_type: string;
  /** date the elastic search was updated */
  elastic_search_updated_at: string;
  /** if the committee has been migrated to the core*/
  committee_migrated_to_core: boolean;
  /** if an applicant has been selected for the position */
  applicant_selected: boolean;
  /** applicant selection notes for the position */
  applicant_selection_notes: string;
  /** if the position is ready for approval */
  ready_for_approval: boolean;
  /** legacy position id for the position */
  legacy_position_id: string;
  /** date the position was archived */
  archived_on: string;
  /** pid of some user for the position */
  pid: string;
  /** workflaw template for the position */
  workflow_template_id: string;
  /** pid of the user who last rejected this position */
  last_rejected_by_pid: string;
  /** last step on which the position was rejected */
  last_rejected_step: string;
  /** date on which the position was last rejected*/
  last_rejected_date: string;
  /** message for the last rejection for the position */
  last_rejected_message: string;
  /** unresolved rejection for the position */
  unresolved_rejection: string;
  /** tenant id for the position */
  stored_tenant_id: number;
  /** person id of the selection last rejected for the position */
  selection_last_rejected_by_pid: string;
  /** step of the selection last rejected for the position */
  selection_last_rejected_step: string;
  /** date of the selection last rejected for the position */
  selection_last_rejected_date: string;
  /** temp unit name for the position */
  unit_name_temp: string;
  /** step number in the category for the position (e.g. 1 of 5) */
  step_number_in_category:  string;
  /** strings to search for the position on */
  search_strings: string;
  /** number of active applications */
  active_applications_count: number;
  /** date the active applications were updated */
  active_applications_updated_at: string;
  /** date associated data was updated at for this position */
  associated_data_updated_at: string;
  /** name of the position type for the position */
  position_type_name: string;
  /** position type category id for the position */
  position_type_category_id: number;
  /** if the position is open */
  open: boolean;
  /** if the open date for the position should be displayed */
  open_date_display: boolean;
  /** if the close date for the position should be displayed */
  close_date_display: boolean;
  /** date to sort on for the position */
  sortable_date: string;
  /** name of the unit to which this position belongs */
  unit_name: string;
  /** list of ancester units to the unit to which this position belongs */
  ancestor_units: {id: number, name: string}[];
  /** effective generated eeo statement for the position */
  effective_eeo_statement: string;
  /** position term name for the position */
  position_term_name: string;
  /** status for the position */
  position_status: string;
  evaluation_scales: any[],
  /** if the position is editable  */
  editable: boolean;
  /** if the position is deleteable */
  deletable: boolean;
  /** role id of evaluators for this position */
  evaluator_role_id: number;
  /** the acting evaluators for this position */
  acting_evaluators: any[];
  /** the role id of the committee manager */
  committee_manager_role_id: number;
  /** acting committee managers for this position */
  acting_committee_managers: {
    id: number;
    pid: number;
    role_id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
  }[];
  /** the approval status for the position */
  approval_status: string;
  /** if the position can be approved */
  can_approve_position: boolean;
  /** list of position statuses available for the position */
  position_statuses: {
    id: number;
    name: string;
    allow_review: boolean;
    allow_update: boolean;
    current: boolean;
    default: boolean;
    display_to_applicant: boolean;
    message_template_id: number;
    sort_order:  number;
    unit_id: number;
    used: boolean;
  }[];
  /** list of application statuses available for applications to this position */
  application_statuses: {
    id: number;
    name: string;
    allow_review: boolean;
    allow_update: boolean;
    current: boolean;
    default: boolean;
    display_to_applicant: boolean;
    message_template_id: number;
    sort_order: number;
    unit_id: number;
    used: boolean;
  }[];
  /** @todo flesh out application tags and add to denesting */
  /** list of application tags for this position */
  application_tags: any[],
  /** @todo flesh out file_attachments and add to denesting */
  /** list of file attachments for this position */
  file_attachments: any[],
  /** if the position is eeo flaggable */
  eeo_flaggable: boolean;
  /** total number of applications */
  total_application_count: number;
  /** ready for approval information for this position */
  ready_for_approval_info: any,
  /** @todo flesh out selected applicants and add to denesting */
  /** applicants that have been selected */
  "selected_applicants": [],
  /** for the position */
  application_tagging_allowed: boolean;
  /** position forms attached to this position */
  position_forms: {
    id: number;
    custom_form_id: number;
    sort_order: number;
    position_id: number;
    eeo_form: boolean;
    form_name: string;
    description: string;
    /** @todo flesh out questions and add to de-nesting */
    questions: any[]
  }[];
  /** @todo flesh out required documents and add to de-nesting */
  /** required documents for the position */
  required_documents: any[];
  /** the current workflow step in the position approval process */
  current_workflow_step: PositionWorkflowStep;
  /** next workflow step for the position */
  next_workflow_step: PositionWorkflowStep;
  /** previous workflow step for the position */
  previous_workflow_step: PositionWorkflowStep;
  /** all workflow steps for the position */
  workflow_steps: PositionWorkflowStep[];
  /** committee members for the position */
  "committee_members": {
      "id": number;
      "pid": number;
      "role_id": number;
      "user_id": number;
      "first_name": string;
      "last_name": string;
      "email": string;
  }[];
  /** if the position can be moved*/
  can_move: boolean;
  /** if the position can be moved forward*/
  can_move_forward: boolean;
  /** if the position can be moved backward */
  can_move_backward: boolean;
  /** if the position can be rejected */
  can_be_rejected: boolean;
  /** if the position can be resolved? */
  can_be_resolved: boolean;
  /** rejection information */
  rejection_info: any,
  selection_rejection_info: any,
  disposition_codes: { id: number; code: string }[];
}

/**
 * Class representing an Interfolio Position
 *
 */
export class PositionApi {
  /**
   * API request object for making the actual http requests
   */
  public readonly apiRequest: ApiRequest;

  public readonly Applications: ApplicationApi;
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

    this.Applications = new ApplicationApi(config);
  }

  /**
   * Create a new position
   * @param unitId
   * @param positionTypeId
   */
  async create(position: PositionInsert): Promise<PositionDetail> {
    return new Promise((resolve, reject) => {
      const url = POSITION_BASE_URL;
      this.apiRequest
          .executeRest({ url, method: 'POST', json: { position }})
          .then((response) => {
            resolve(PositionApi.removePositionDetailNesting(response.position));
          })
          .catch((error) => {
            reject(error);
          });
    });
  }

  /**
   * Delete the position
   * @example
   * ```javascript
   * await api.Search.Positions.delete({id: 9999});
   * ```
   */
  public async delete({ id }: { id: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = POSITION_URL.replace('{position_id}', id.toString());
      this.apiRequest
          .executeRest({ url, method: 'DELETE' })
          .then(() => resolve(true))
          .catch((error) => {
            //@todo remove this exception override once interfolio fixes the delete api call to to not throw this exception
            if(error.message === "Couldn't find Position with 'id'=" + id.toString()) {
              resolve(true);
            }
            else {
              reject(error)
            }
          });
    });
  }

  /**
   * Find a position based upon search term
   * @param limit
   * @param page
   * @param sort_by
   * @param sort_order
   * @param archived
   * @param current_status_name
   * @param position_type_id
   * @param search_term
   */
  async filterPositions({limit = 25, page=1, sort_by= "position_name", sort_order="asc", archived=null, current_status_name=null, position_type_id=null, search_term=null }: {
     limit?: number;
     page?: number;
     sort_by?: string;
     sort_order?: string;
     archived?: boolean | null;
     current_status_name?: string | null;
     position_type_id?: number | null;
     search_term?: string | null;
  }): Promise<{limit: number, page: number, total_count: number, results: any[]}> {
    return new Promise((resolve, reject) => {
      const url = POSITION_FILTER_URL.replace("{limit}", limit.toString())
        .replace("{page}", page.toString())
        .replace("{sort_by}", sort_by)
        .replace("{sort_order}", sort_order);
      const json: {filter: {
        archived?: boolean, current_status_name?: string, position_type_id?: number, search_term?: string
      }} = {filter: { }};
      if(archived !== null) json.filter.archived = archived;
      if(current_status_name !== null) json.filter.current_status_name = current_status_name;
      if(position_type_id !== null) json.filter.position_type_id = position_type_id;
      if(search_term !== null) json.filter.search_term = search_term;
      this.apiRequest
          .executeRest({ url, method: 'POST', json })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
    });
  }

  /**
   * Get a position from the positionId
   * @param id ID of the position
   *
   * @example
   * ```javascript
   * let position = await api.Search.Positions.getPosition({id: 9999});
   * ```
   */
  async getPosition({ id }: { id: number }): Promise<PositionDetail> {
    return new Promise((resolve, reject) => {
      const url = POSITION_URL.replace('{position_id}', id.toString());
      this.apiRequest
        .executeRest({ url, method: 'GET' })
        .then((response) => {
          resolve(PositionApi.removePositionDetailNesting(response.position));
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
  public static removePositionDetailNesting<T>(apiResponse: ApiResponse): T {
    const denestDef: DeNestingDef = {
      committee_members: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'committee_member',
      },
      ancestor_units: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'ancestor_unit'
      },
      acting_committee_managers: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'committee_member'
      },
      position_statuses: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: "position_status"
      },
      application_statuses: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: "application_status"
      },
      position_forms: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: "position_form"
      }
    };
    const position: unknown = Utils.deNest(apiResponse, denestDef);

    return position as T;
  }
}

export default PositionApi;

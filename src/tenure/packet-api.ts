import ApiRequest, { ApiResponse, INTERFOLIO_BYC_TENURE_V1 } from '../api-request';
import { ApiConfig } from '../index';

export const PACKET_BASE_URL = INTERFOLIO_BYC_TENURE_V1 + '/packets';
export const PACKET_URL = PACKET_BASE_URL + '/{packet_id}';
export const PACKET_CREATE_FROM_TEMPLATE_URL = PACKET_BASE_URL + '/create_from_template';
export const PACKET_MOVE_FORWARD_URL = PACKET_URL + '/move_forward';
export const PACKET_MOVE_BACKWARD_URL = PACKET_URL + '/move_backward';
export const PACKET_ARCHIVE_URL = PACKET_URL + '/archive';

//Imported after url consts since WorkflowStep uses them
import WorkflowStepApi, { WorkflowStep } from './packets/workflow-step-api';
import PlatformFormApi from './packets/platform-form-api';
import EvaluatorSectionApi, { EvaluatorSection } from './packets/evaluator-section-api';
import Utils, { DeNestingDef } from '../utils';

/** Packet Data that is returned after packet creation */
export type Packet = {
  /** flag indicating if comments are allowed */
  allow_comments: boolean;
  /** flag indicating if updates are allowed */
  allow_update: boolean;
  /** flag indicating if the packet has been altered for candidate transparency */
  altered_for_candidate_transparency: boolean;
  /** flag indicating if the applicant has submitted */
  applicant_has_submitted: boolean;
  /** flag indicating if the applicant has been notified */
  applicant_notified: boolean;
  /** applicant pid of the packet */
  applicant_pid: number;
  /** flag indicating if the template has been archived */
  archived: boolean;
  /** date on which the packet was archived */
  archived_on: string;
  /** data on which associated data was updated */
  associated_data_updated_at: string;
  /** flag indicating if review should be blind */
  blind_review: boolean;
  /** email of the candidate */
  candidate_email: string;
  /** first name of the candidate */
  candidate_first_name: string;
  /** flag indicating if the candidate will be submitting case materials */
  candidate_involvement: boolean;
  /** flag indicating that candidate involvement has been confirmed */
  candidate_involvement_confirmed: boolean;
  /** Last name of the candidate */
  candidate_last_name: string;
  /** Flag indicating if the packet is complete */
  complete: boolean;
  /** Time when the packet was created */
  created_at: string;
  /** email from which notifications are sent */
  default_email_from: string;
  /** flag indicating if this packet has been deleted */
  deleted: boolean;
  /** Time when the packet was deleted */
  deleted_on: string;
  /** Description of the case template */
  description: string;
  /** Due date for the packet */
  due_date: string;
  /** Date when the elastic search for this packet was last updated */
  elastic_search_updated_at: string;
  /** ID of the packet/template */
  id: number;
  /** flag indicating if hte internal sections should appear after candidate sections */
  internal_sections_on_bottom: boolean;
  /** flag indicating if the internal sort order has been altered */
  internal_sort_order_altered: boolean;
  /** Candidate Instructions for the packet */
  instructions: string;
  /** Name of the packet template */
  name: string;
  //?packet_change_emails: null
  //?packet_id: null
  /** Name of the template on which this packet was created */
  packet_template_name: string;
  /** id of the type of packet */
  packet_type_id: number;
  /** flag indicating if the packet is complete */
  percent_complete: boolean;
  /** flag indicating if the template is published */
  published: boolean;
  /** list of strings for which this packet can be searched */
  search_strings: null;
  /** ID of the status for the packet */
  status_id: string;
  /** Unit id of the packet */
  unit_id: number;
  /** Time the packet was last updated */
  updated_at: string;
  /** Flag indicating if the packet has been withdrawn */
  withdrawn: boolean;
};

/** Packet data that is returned from a GET request */
export type PacketDetail = {
  /** Flag indicating if additional documents are allowed */
  allow_additional_documents: boolean;
  /** Flag indicating if additional candidate sections are allowed */
  allow_candidate_sections: boolean;
  /** Flag indicating if comments are allowed */
  allow_comments: boolean;
  /** flag indicating if updates are allowed */
  allow_update: boolean;
  /** Flag indicating if the applicant can be notified */
  applicant_can_be_notified: boolean;
  /** Flag indicating if applicant has been notified */
  applicant_has_been_notified: boolean;
  /** flag indicating if the applicant has submitted */
  applicant_has_submitted: boolean;
  /** ID of the applicant */
  applicant_id: number;
  /** applicant pid of the packet */
  applicant_pid: number;
  /** Documents supplied by the applicant */
  application_documents: any[];
  /** Flag indicating if this case is archivable */
  archivable: boolean;
  /** flag indicating if the template has been archived */
  archived: boolean;
  /** Flag indicating if the case can be moved forward */
  can_be_moved_forward: boolean;
  /** Flag indicating if the the case can be commented on by the current user */
  can_comment_on: boolean;
  /** Flag indicating if the the comment settings can be edited by the current user*/
  can_edit_comment_settings: boolean;
  /** Flag indicating if the packet can be edited by the current user */
  can_edit_packet: boolean;
  /** Flag indicating if the packet settings can be edited by the current user */
  can_edit_packet_settings: boolean;
  /** email of the candidate */
  candidate_email: string;
  /** first name of the candidate */
  candidate_first_name: string;
  /** flag indicating if the candidate will be submitting case materials */
  candidate_involvement: boolean;
  /** flag indicating that candidate involvement has been confirmed */
  candidate_involvement_confirmed: boolean;
  /** Last name of the candidate */
  candidate_last_name: string;
  /** Flag indicating if comments are allowed by the institution */
  comments_allowed_by_institution: boolean;
  /** list of committee initiated evaluations */
  committee_initiated_evaluations: any[];
  /** list of confidential attachments */
  confidential_attachments: any[];
  /** Time when the packet was created */
  created_at: string;
  current_committee?: {
    id: number;
    unit_id: number;
    name: string;
    standing: boolean;
    note: string;
    requirements_fulfilled: boolean;
    members: [any];
    restricted: boolean;
    individual_committee: false;
    type: string;
  };
  /** committeess assigned to the current user */
  current_users_assigned_committees: { id: number; name: string }[];
  /** current workflow step */
  current_workflow_step: WorkflowStep;
  /** custom forms attached to this case */
  custom_forms: any[];
  /** list of documents by application section */
  documents_by_applicant_submitted_section: any[];
  /** list of documents by evaluator section */
  documents_by_evaluator_section: any[];
  /** list of documents by section */
  documents_by_section: any[];
  /** Due date for the packet */
  due_date: string | null;
  /** Due date to display */
  due_date_display: string | null;
  /** responses to forms */
  form_responses: any[];
  /** ID of the packet/template */
  id: number;
  /** instutiion id */
  institution_id: number;
  /** Candidate Instructions for the packet */
  instructions: string | null;
  /** internal data forms */
  internal_data_forms: any[];
  /** internal form responses */
  internal_form_responses: any[];
  /** flag indicating if hte internal sections should appear after candidate sections */
  internal_sections_on_bottom: boolean;
  /** name from template */
  name?: string;
  /** the next workflow step */
  next_workflow_step: WorkflowStep;
  /** packet attachments */
  packet_attachments: any[];
  /** flag indicating if packet downloading is allowed */
  packet_downloading_allowed: boolean;
  /** list of packet sections */
  packet_sections: EvaluatorSection[];
  /** id of the packet template */
  packet_template_id: number;
  /** id of the type of packet */
  packet_type_id: number | null;
  /** name of the packet type */
  packet_type_name: string | null;
  /** previous workflow step */
  previous_workflow_step: any;
  /** list of required documents for candidate */
  required_documents: {
    /** id of the required document */
    id: number;
    /** name of the required document */
    name: string;
    /** minimum required */
    lower_limit: number;
    /** maximim allowed (-1 for no max) */
    upper_limit: number;
    /** enforecment level e.g. optional etc */
    enforcement_level: number;
    /** note for the required document */
    note: string | null;
    /** if the requirement is in use */
    in_use: boolean;
    /** string version of enforcement level value */
    enforcement_level_value: string;
    /** if a placeholder for additional documents */
    for_additional_documents: boolean;
  }[];
  /** list of requirements by section */
  requirements_by_section: any[];
  /** status of the case */
  status: string | null;
  /** Unit id of the packet */
  unit_id: number;
  /** name of the unit for this case */
  unit_name: string;
  /** list of visible comments */
  visible_comments: any[];
  /** list of committees that this case is waiting on */
  waiting_on_committee: any[];
  /** list of workflow steps */
  workflow_steps: WorkflowStep[];
};

/**
 * Defines the parameters needed to create a packet from a packet template
 */
export type CreatePacketFromTemplateParams = {
  /** Id of the packet template to create from */
  packetId: number;
  /** Unit Id to create the case in */
  unitId: number;
  /** Candidate's first name */
  candidateFirstName: string;
  /** Candidate's Last name */
  candidateLastName: string;
  /** Candidate Email address */
  candidateEmail: string;
  /** If the candidate will be involved in the case */
  candidateInvolvement: boolean;
  /** Due date of the packet */
  dueDate?: string;
  /** unknown */
  name?: string;
  /** unknown */
  eppn?: string;
};

/**
 * Defines the parameters needed to move a packet forward/backward
 */
export type MoveParams = {
  /** id of the packet */
  id: number;
  /** if a notification should be sent */
  sendNotification: boolean;
  /** subject for the notification message  */
  notificationSubject?: string;
  /** body of the notification message */
  notificationBody?: string;
};

/**
 * Class representing Packet calls
 */
export class PacketApi {
  /**
   * API request object for making the actual http requests
   */
  private readonly apiRequest: ApiRequest;

  /** handle to PlatformFormApi */
  public PlatformForms: PlatformFormApi;

  /** handle to WorkflowStepApi */
  public WorkflowSteps: WorkflowStepApi;

  public EvaluatorSections: EvaluatorSectionApi;

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
    this.PlatformForms = new PlatformFormApi(config);
    this.WorkflowSteps = new WorkflowStepApi(config);
    this.EvaluatorSections = new EvaluatorSectionApi(config);
  }

  /**
   *
   * @param packetId
   * @param statusId
   */
  public async archive({ packetId, statusId }: { packetId: number; statusId: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = PACKET_ARCHIVE_URL.replace('{packet_id}', packetId.toString());
      const form = {
        'packet[status_id]': statusId,
        'packet[archived]': true,
      };
      this.apiRequest
        .executeRest({ url, method: 'PUT', form })
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Create a new packet (case)
   * @param unitId Unit id of the case
   * @param candidateFirstName Candidate's first (given) name
   * @param candidateLastName Candidate's last (family) name
   * @param candidateEmail Candidate's email address
   * @param candidateInvolvement Flag indicating if the candidate will be involved in the case
   * @param packetTypeId Packet Type ID of the case (e.g. Appointment/Promotion etc)
   *
   * @example
   * ```javascript
   * let case = await api.Tenure.Packets.create({unitId: 9999, candidateFirstName: "First",
   *     candidateLastName: "Last", candidateEmail:"firslast@email.com", candidateInvolvement: false, packetTypeId: 9999}):
   * ```
   */
  public async create({
    unitId,
    candidateFirstName,
    candidateLastName,
    candidateEmail,
    candidateInvolvement = false,
    packetTypeId,
  }: {
    unitId: number;
    candidateFirstName: string;
    candidateLastName: string;
    candidateEmail: string;
    candidateInvolvement: boolean;
    packetTypeId: number;
  }): Promise<Packet> {
    return new Promise((resolve, reject) => {
      const url = PACKET_BASE_URL;
      const form = {
        'packet[unit_id]': unitId,
        'packet[candidate_first_name]': candidateFirstName,
        'packet[candidate_last_name]': candidateLastName,
        'packet[candidate_email]': candidateEmail,
        'packet[candidate_involvement]': candidateInvolvement,
        'packet[packetTypeId]': packetTypeId,
      };
      this.apiRequest
        .executeRest({ url, form, method: 'POST' })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  /**
   * Create a new Case from a case template
   * @param packetId ID of the Packet Template
   * @param unitId ID of the unit for the case
   * @param candidateFirstName  Candidate's first name
   * @param candidateLastName  Candidate's last name
   * @param candidateEmail Candidate's email
   * @param candidateInvolvement  If the candidate will be involved in the case
   * @param name  ???
   * @param dueDate Due date for the case
   * @param eppn  ???
   *
   * @example
   * ```javascript
   * let case = await api.Tenure.Packets.createFromTemplate({
   *   packetId: 9999,
   *   unitId: 9999,
   *   candidateFirstName: "Holly",
   *   candidateLastName: "Doe",
   *   candidateEmail: "holly.doe@example.com"
   *   candidateInvolvement: false
   * });
   * ```
   */
  public async createFromTemplate({
    packetId,
    unitId,
    candidateFirstName,
    candidateLastName,
    candidateEmail,
    candidateInvolvement,
    name,
    dueDate,
    eppn,
  }: CreatePacketFromTemplateParams): Promise<PacketDetail> {
    return new Promise((resolve, reject) => {
      const url = PACKET_CREATE_FROM_TEMPLATE_URL;
      const form: any & { due_date?: string; name?: string; eppn?: string } = {
        'packet[packet_id]': packetId,
        'packet[unit_id]': unitId,
        'packet[candidate_first_name]': candidateFirstName,
        'packet[candidate_last_name]': candidateLastName,
        'packet[candidate_email]': candidateEmail,
        'packet[candidate_involvement]': candidateInvolvement,
      };
      if (dueDate) form.due_date = dueDate;
      if (name) form.name = name;
      if (eppn) form.eppn = eppn;
      this.apiRequest
        .executeRest({ url, form, method: 'POST' })
        .then(async (response) => {
          resolve(this.getPacket({ id: response.id }));
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Delete the case (note: can only be performed when API user has root unit admin permissions)
   * @param id
   *
   * @example
   * ```javascript
   * await api.Tenure.Packets.delete({id: 9999});
   * ```
   */
  public async delete({ id }: { id: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = PACKET_URL.replace('{packet_id}', id.toString());
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  /**
   * Get the packet detail information
   *
   * @param id Id of the packet
   *
   * @example
   * ```javascript
   * let packet = await api.Tenure.Packets.getPacket({id: 9999});
   * ```
   */
  public async getPacket({ id }: { id: number }): Promise<PacketDetail> {
    return new Promise((resolve, reject) => {
      const url = PACKET_URL.replace('{packet_id}', id.toString());
      this.apiRequest
        .executeRest({ url })
        .then((response) => {
          resolve(PacketApi.removePacketDetailNesting<PacketDetail>(response.packet));
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Send the case forward to the next workflow step
   * @param id  Packet id of the case
   * @param sendNotification  If a notification should be sent to the receiving committee
   * @param notificationSubject  Subject of the notification
   * @param notificationBody  Body of the notification
   *
   *
   * @example
   * ```javascript
   * await api.Tenure.Packets.moveBackward({id: 9999, sendNotification: false"});
   * await api.Tenure.Packets.moveBackward({id: 9999,
   *   sendNotifcation: true,
   *   selectedCommitteeId: 9999,
   *   notificationSubject:"Returned Case",
   *   notificationBody:"Case Returned for Corrections"
   * });
   * ```
   */
  public async moveBackward({
    id,
    sendNotification,
    notificationSubject,
    notificationBody,
  }: MoveParams): Promise<PacketDetail> {
    return new Promise((resolve, reject) => {
      const url = PACKET_MOVE_BACKWARD_URL.replace('{packet_id}', id.toString());
      const form: {
        send_step_change_notification: boolean;
        step_change_notification_subject?: string;
        step_change_notification_body?: string;
      } = {
        send_step_change_notification: sendNotification,
      };
      if (sendNotification === true) {
        form.step_change_notification_subject = notificationSubject
          ? notificationSubject
          : 'Interfolio Case Ready for Review';
        form.step_change_notification_body = notificationBody
          ? notificationBody
          : 'An Interfolio Case has been added to your queue for Review';
      }
      this.apiRequest
        .executeRest({ url, method: 'PUT', form: form })
        .then(() => {
          this.getPacket({ id })
            .then((response) => resolve(response))
            .catch((error) => reject(error));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Send the case forward to the next workflow step
   * @param id  Packet id of the case
   * @param sendNotification  If a notification should be sent to the receiving committee
   * @param notificationSubject  Subject of the notification
   * @param notificationBody  Body of the notification
   *
   *
   * @example
   * ```javascript
   * await api.Tenure.Packets.moveForward({id: 9999, sendNotification: false"});
   * await api.Tenure.Packets.moveForward({
   *   id: 9999,
   *   sendNotifcation: true,
   *   selectedCommitteeId: 9999,
   *   notificationSubject:"Review Case",
   *   notificationBody:"Here is a case to review"
   * });
   * ```
   */
  public async moveForward({
    id,
    sendNotification,
    notificationSubject,
    notificationBody,
  }: MoveParams): Promise<PacketDetail> {
    return new Promise((resolve, reject) => {
      const url = PACKET_MOVE_FORWARD_URL.replace('{packet_id}', id.toString());
      const form: {
        send_step_change_notification: boolean;
        step_change_notification_subject?: string;
        step_change_notification_body?: string;
      } = {
        send_step_change_notification: sendNotification,
      };
      if (sendNotification === true) {
        form.step_change_notification_subject = notificationSubject
          ? notificationSubject
          : 'Interfolio Case Ready for Review';
        form.step_change_notification_body = notificationBody
          ? notificationBody
          : 'An Interfolio Case has been added to your queue for Review';
      }
      this.apiRequest
        .executeRest({ url, method: 'PUT', form: form })
        .then(() => {
          this.getPacket({ id })
            .then((response) => resolve(response))
            .catch((error) => reject(error));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Remove the cumbersome second level for various nested values
   * @param apiResponse  The response from the API to remove the nesting from
   */
  public static removePacketDetailNesting<T>(apiResponse: ApiResponse): T {
    const denestDef: DeNestingDef = {
      workflow_steps: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'workflow_step',
        nestedDefs: {
          committees: {
            type: 'DENEST_ARRAY',
            nestedAttributeName: 'committee',
          },
        },
      },
      required_documents: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'required_document',
      },
      packet_sections: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'packet_section',
      },
      next_workflow_step: {
        type: 'DENEST_CHILD_OBJECT',
        nestedAttributeName: '',
        nestedDefs: {
          committees: {
            type: 'DENEST_ARRAY',
            nestedAttributeName: 'committee',
          },
        },
      },
      current_workflow_step: {
        type: 'DENEST_CHILD_OBJECT',
        nestedAttributeName: '',
        nestedDefs: {
          committees: {
            type: 'DENEST_ARRAY',
            nestedAttributeName: 'committee',
          },
        },
      },
    };
    const packetDetail: unknown = Utils.deNest(apiResponse, denestDef);

    return packetDetail as T;
  }
}

export default PacketApi;

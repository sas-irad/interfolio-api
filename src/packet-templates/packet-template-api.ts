import ApiRequest, { INTERFOLIO_BYC_TENURE_V1 } from '../api-request';
import { ApiConfig } from '../index';

/** Base url for template api calls */
export const TEMPLATE_BASE_URL = INTERFOLIO_BYC_TENURE_V1 + '/packet_templates';
export const TEMPLATE_URL = TEMPLATE_BASE_URL + '/{packet_template_id}';
export const TEMPLATE_SEARCH_URL = TEMPLATE_BASE_URL + '?limit={limit}&unit_id={unit_id}&search_text={search_text}';

/**
 * Class representing the an RPT Case Template
 *
 * @example
 * ```javascript
 * let units = await api.Units.getUnits();
 * ```
 */

export type PacketTemplate = {
  /** flag indicating if additional documents uploads by candidate are allowed */
  allow_additional_documents: boolean;
  /** flag indicating if the create of additional candidate sections is allowed */
  allow_candidate_sections: boolean;
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
  /** Candidate Instructions for the packet */
  instructions: string;
  /** flag indicating if hte internal sections should appear after candidate sections */
  internal_sections_on_bottom: boolean;
  /** flag indicating if the internal sort order has been altered */
  internal_sort_order_altered: boolean;
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

export class PacketTemplateApi {
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
   * Create a new case template
   *
   * @param unitId Unit ID of the template
   * @param name Name of the Template
   * @param description Description of the template
   * @param packetTypeId Id of the packet type (e.g. Appointment/Reappointment etc).
   *
   * @example
   * ```javascript
   * let template = await api.PacketTemplates.create({unitId: 9999, name: "Template Name", packetTypeId: 1});
   * ```
   */
  public async create({
    unitId,
    name,
    description,
  }: {
    unitId: number;
    name: string;
    description: string;
    packetTypeId: number;
  }): Promise<PacketTemplate> {
    return new Promise((resolve, reject) => {
      const url = TEMPLATE_BASE_URL;
      const form = {
        'packet_template[unit_id]': unitId,
        'packet_template[name]': name,
        'packet_template[description]': description,
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
   * Delete a packet template
   * @param id Id of the packet template to delete
   *
   * @example
   * ```javascript
   * let deleteSuccess = await api.PacketTemplates.delete({id: 9999});
   * ```
   */
  public async delete({ id }: { id: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = TEMPLATE_URL.replace('{packet_template_id}', id.toString());
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Find a unit template
   * @param params {
   *   email: email address of the user
   * }
   */
  public findUnitTemplate({ name, unitId }: { name: string; unitId: number }): Promise<PacketTemplate> {
    return new Promise((resolve, reject) => {
      const url = TEMPLATE_SEARCH_URL.replace('{limit}', '100')
        .replace('{search_text}', ApiRequest.rfc3986EncodeURIComponent(name))
        .replace('{unit_id}', unitId.toString());

      this.apiRequest
        .executeRest({ url: url })
        .then((response) => {
          let template = null;
          for (const t of response.results) {
            if (t.name == name && t.unit_id == unitId) {
              template = t;
            }
          }
          if (!template) {
            reject('No template with the name "' + name + '" found in unit "' + unitId.toString());
          } else {
            this.getTemplate({ id: template.id })
              .then((result) => resolve(result))
              .catch((error) => reject(error));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Get the template
   * @param id ID of the template
   *
   * @example
   * ```javascript
   * let template = await api.PacketTemplates.getTemplate({id: 9999});
   * ```
   */
  public async getTemplate({ id }: { id: number }): Promise<PacketTemplate> {
    return new Promise((resolve, reject) => {
      const url = TEMPLATE_URL.replace('{packet_template_id}', id.toString());
      this.apiRequest
        .executeRest({ url })
        .then((response) => {
          resolve(response.packet_template);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default PacketTemplateApi;

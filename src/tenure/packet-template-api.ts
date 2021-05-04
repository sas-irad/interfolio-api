import ApiRequest, { INTERFOLIO_BYC_TENURE_V1 } from '../api-request';
import { ApiConfig } from '../index';
import { PacketApi, Packet, PacketDetail } from './packet-api';

/** Base url for template api calls */
export const TEMPLATE_BASE_URL = INTERFOLIO_BYC_TENURE_V1 + '/packet_templates';
export const TEMPLATE_URL = TEMPLATE_BASE_URL + '/{packet_template_id}';
export const TEMPLATE_SEARCH_URL = TEMPLATE_BASE_URL + '?limit={limit}&unit_id={unit_id}&search_text={search_text}';

export type PacketTemplateDetail = PacketDetail & { description: string };

/**
 * Class representing the an RPT Case Template
 *
 */
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
   * let template = await api.Tenure.PacketTemplates.create({unitId: 9999, name: "Template Name", packetTypeId: 1});
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
  }): Promise<Packet> {
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
   * let deleteSuccess = await api.Tenure.PacketTemplates.delete({id: 9999});
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
  public findUnitTemplate({ name, unitId }: { name: string; unitId: number }): Promise<PacketTemplateDetail> {
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
   * let template = await api.Tenure.PacketTemplates.getTemplate({id: 9999});
   * ```
   */
  public async getTemplate({ id }: { id: number }): Promise<PacketTemplateDetail> {
    return new Promise((resolve, reject) => {
      const url = TEMPLATE_URL.replace('{packet_template_id}', id.toString());
      this.apiRequest
        .executeRest({ url })
        .then((response) => {
          const packetDetail = PacketApi.removePacketDetailNesting<PacketTemplateDetail>(response.packet_template);
          resolve(packetDetail);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default PacketTemplateApi;

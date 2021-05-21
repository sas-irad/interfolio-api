import ApiRequest, { INTERFOLIO_BYC_TENURE_V1 } from '../../api-request';
import { ApiConfig } from '../../index';
import { PacketDetail } from '../packet-api';

export const EVALUATOR_SECTIONS_BASE_URL = INTERFOLIO_BYC_TENURE_V1 + '/packets/{packet_id}/evaluator_sections';
export const EVALUATOR_SECTION_URL = EVALUATOR_SECTIONS_BASE_URL + '/{section_id}';
/**
 * Represents a Packet section to which requirements can be assigned and read by evaluators
 */
export type EvaluatorSection = {
  /** id of the section */
  id: number;
  /** name of the section */
  name: string;
  /** due date for the section */
  due_date: string | null;
  /** flag if additional documents are allowed */
  allow_additional_documents: boolean;
  /** the packet section sort order */
  requirement_sort_order: number | null;
  /** the interal sort order */
  internal_sort_order: number | null;
  /** the type (eg. Requirement Section / Evaluator Section  */
  type: string;
  /** Description of the packet section */
  description: null;
  /** if update is allowed */
  allow_update: boolean;
  /** if the section is in use */
  in_use: boolean;
  /** if this is a committee evaluation section */
  committee_evaluation_section: boolean;
};

/**
 * Class representing packet evaluator section api calls
 */
export class EvaluatorSectionApi {
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
   * Update descripiton/name for Packet section for holding attachments
   * @param packetId    ID of the packet
   * @param sectionId   ID of the section
   * @param name        Name of the section
   * @param description Description of the section
   *
   * @example
   * ```javascript
   * const updated = await api.Tenure.EvaulatorSections.updateSection({
   *   packetId: 9999,
   *   sectionId: 9999,
   *   name: "Section Name",
   *   description: "Section Description"
   * });
   * ```
   */
  public updateSection({
    packetId,
    sectionId,
    name,
    description,
  }: {
    packetId: number;
    sectionId: number;
    name: string;
    description: string;
  }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = EVALUATOR_SECTION_URL.replace('{packet_id}', packetId.toString()).replace(
        '{section_id}',
        sectionId.toString(),
      );
      this.apiRequest
        .executeRest({
          url,
          method: 'PUT',
          json: {
            packet_section: { name, description },
          },
        })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  /**
   * Find the packet section from the packet detail by section name
   * @param packetDetail detail for the entire packet
   * @param sectionName  section name to search for
   *
   * @example
   * ```javascript
   * import EvaluatorSectionApi from "@sas-irad/interfolio-api/lib/tenure/packets/evaluator-section-api";
   * const detail = await api.Tenure.Packets.getDetail(9999);
   * const section = EvaluatorSectionApi.findPacketSectionFromName({
   *   packetDetail: detail,
   *   sectionName: "Section Name"
   * };
   * ```
   */
  public static findPacketSectionFromName({
    packetDetail,
    sectionName,
  }: {
    packetDetail: PacketDetail;
    sectionName: string;
  }): EvaluatorSection | null {
    for (const section of packetDetail.packet_sections) {
      if (section.name === sectionName) {
        return section;
      }
    }
    return null;
  }
}

export default EvaluatorSectionApi;

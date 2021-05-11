import ApiRequest from '../../api-request';
import { ApiConfig } from '../../index';
import { PacketDetail } from '../packet-api';

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

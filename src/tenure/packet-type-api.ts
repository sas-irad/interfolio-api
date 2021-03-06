import ApiRequest, { INTERFOLIO_BYC_TENURE_V1 } from '../api-request';
import { ApiConfig } from '../index';

export type PacketType = {
  /** Id of the packet type */
  id: number;
  /** Name of the packet type */
  name: string;
};

export const PACKET_TYPE_BASE_URL = INTERFOLIO_BYC_TENURE_V1 + '/packet_types';

/**
 * Class representing Packet Type calls (e.g. Appointment/Reappointment)
 */
export class PacketTypeApi {
  /**
   * API request object for making the actual http requests
   */
  public readonly apiRequest: ApiRequest;

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
  }

  /**
   * Get the list of packet types
   *
   * @example
   * ```javascript
   * let packetTypes = await api.Tenure.PacketTypes.getList();
   * ```
   */
  public async getList(): Promise<PacketType[]> {
    return new Promise((resolve, reject) => {
      const url = PACKET_TYPE_BASE_URL;
      this.apiRequest
        .executeRest({ url })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }
}

export default PacketTypeApi;

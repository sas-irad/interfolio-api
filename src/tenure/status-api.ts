import ApiRequest, { INTERFOLIO_BYC_TENURE_V1 } from '../api-request';
import { ApiConfig } from '../index';

export type Status = {
  /** Id of the packet type */
  id: number;
  /** Name of the packet type */
  name: string;
  /** unit_id of the unit to which this status applies */
  unit_id: number;
  /** the color which the status is linked defined as css color e.g. "#800000" or "rgb(128, 0, 0)" */
  color: string;
  /** order in which to sort the statuses */
  sort_order: number;
};

export const STATUS_BASE_URL = INTERFOLIO_BYC_TENURE_V1 + '/statuses';

/**
 * Class representing Packet Type calls (e.g. Appointment/Reappointment)
 */
export class StatusApi {
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
   * let statuses = await api.Tenure.Statuses.getList();
   * ```
   */
  public async getList(): Promise<Status[]> {
    return new Promise((resolve, reject) => {
      const url = STATUS_BASE_URL;
      this.apiRequest
        .executeRest({ url })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }
}

export default StatusApi;

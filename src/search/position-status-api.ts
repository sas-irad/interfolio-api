import ApiRequest, {ApiResponse, INTERFOLIO_SEARCH_V1} from '../api-request';
import { ApiConfig } from '../index';

/** the base url for the search/position_status api */
export const POSITION_STATUS_BASE_URL = INTERFOLIO_SEARCH_V1 + '/units/{unit_id}/position_statuses';

export type PositionStatus = {
  allow_review: boolean,
  allow_update: boolean,
  created_at: string,
  current: boolean,
  default: boolean,
  display_to_applicant: boolean,
  elastic_search_updated_at: boolean,
  id: number,
  message_template_id: number,
  name: string,
  position_id : number,
  sort_order: number
  unit_id: number,
  updated_at: string,
  used: boolean
};

/**
 * Class representing Position Status calls
 */
export class PositionStatusApi {
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
   * Retrieve position statuses
   *
   * @example
   * ```javascript
   * let statuses = await api.Search.PositionStatus.getPositionStatuses({unitId: 9999});
   * ```
   */
  public getPositionStatuses({unitId}: {unitId: number}): Promise<PositionStatus[]> {
    return new Promise((resolve, reject) => {

      //handle optional params
      const url = POSITION_STATUS_BASE_URL.replace('{unit_id}', unitId.toString());
      this.apiRequest
        .executeRest({ url: url})
        .then((results) => {
          resolve(PositionStatusApi.removePositionStatusNesting(results));
        })
        .catch((error) => reject(error));
    });
  }

  public static removePositionStatusNesting(apiResponse: ApiResponse): PositionStatus[] {
    const statuses: PositionStatus[] = [];
    if(Array.isArray(apiResponse)) {
      for(const positionStatus of apiResponse) {
        statuses.push(positionStatus.position_status as PositionStatus);
      }
    }
    return statuses;
  }
}

export default PositionStatusApi;

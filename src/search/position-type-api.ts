import ApiRequest, { INTERFOLIO_SEARCH_V1 } from '../api-request';
import { ApiConfig } from '../index';

/** the base url for the search/position_types api */
export const POSITION_TYPE_BASE_URL = INTERFOLIO_SEARCH_V1 + '/position_types';

export type PositionType = {
  category_id: number;
  id: number;
  name: string;
  template_count: number;
  tenant_id: number;
};

/**
 * Class representing Position Type calls
 */
export class PositionTypeApi {
  /*
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
   * Retrieve position types
   *
   * @example
   * ```javascript
   * let types = await api.Search.PositionTypes.getPositionTypes();
   * ```
   */
  public getPositionTypes(): Promise<PositionType[]> {
    return new Promise((resolve, reject) => {
      this.apiRequest
        .executeRest({ url: POSITION_TYPE_BASE_URL })
        .then((results) => {
          resolve(results);
        })
        .catch((error) => reject(error));
    });
  }
}

export default PositionTypeApi;

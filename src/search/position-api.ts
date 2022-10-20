import { ApiConfig } from '../index';
import Utils, { DeNestingDef } from '../utils';
import ApiRequest, {ApiResponse} from '../api-request';
import { INTERFOLIO_SEARCH_V1 } from '../api-request';
import ApplicationApi from "./positions/application-api";

/**
 * @const Base url for position api calls
 */
export const POSITION_BASE_URL = INTERFOLIO_SEARCH_V1 + '/positions';
export const POSITION_URL = POSITION_BASE_URL + '/{position_id}';

/**
 * An Interfolio position definition
 */
export type Position = {
  /** ID of the commitee */
  id: number;
  /** Name of the position */
  name: string;
};

/**
 * Class representing an Interfolio Position
 *
 */
export class PositionApi {
  /**
   * API request object for making the actual http requests
   */
  private readonly apiRequest: ApiRequest;

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
   * Get a position from the positionId
   * @param id ID of the position
   *
   * @example
   * ```javascript
   * let position = await api.Search.Position.getPosition({id: 9999});
   * ```
   */
  async getPosition({ id }: { id: number }): Promise<Position> {
    return new Promise((resolve, reject) => {
      const url = POSITION_URL.replace('{position_id}', id.toString());
      this.apiRequest
        .executeRest({ url, method: 'GET' })
        .then((response) => {
          resolve(PositionApi.removePositionNesting(response.position));
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
  private static removePositionNesting(apiResponse: ApiResponse): Position {
    const denestDef: DeNestingDef = {
      committee_members: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'committee_member',
      },
    };
    const position: Position = Utils.deNest(apiResponse, denestDef) as Position;

    return position;
  }
}

export default PositionApi;

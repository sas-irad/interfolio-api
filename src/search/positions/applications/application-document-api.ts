import { INTERFOLIO_SEARCH_V2} from '../../../api-request';
import ApiRequest from '../../../api-request';
import { ApiConfig } from '../../../index';

export const APPLICATION_DOC_BASE_URL_V1 = INTERFOLIO_SEARCH_V2 + '/positions/{position_id}/applications/{application_id}/documents';
export const APPLICATION_DOC_URL = APPLICATION_DOC_BASE_URL_V1 + '/{document_id}';

/**
 * Class representing packet evaluator section api calls
 */
export class ApplicationDocumentApi {
  /**
   * API request object for making the actual http requests
   */
  public apiRequest: ApiRequest;

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
  async getDocument({ documentId, applicationId, positionId }: {
    documentId: number,
    applicationId: number,
    positionId: number
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = APPLICATION_DOC_URL.replace('{position_id}', positionId.toString())
          .replace('{application_id}', applicationId.toString())
          .replace('{document_id}', documentId.toString());
      url = url + "?dowload=0";

      this.apiRequest
          .executeRest({ url, method: 'GET', responseType: "text" })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
    });
  }
  /**
   * Save a document from the positionId
   * @param id ID of the position
   *
   * @example
   * ```javascript
   * let position = await api.Search.Position.getPosition({id: 9999});
   * ```
   */
  async saveDocument({ documentId, applicationId, positionId, filePath }: {
    documentId: number,
    applicationId: number,
    positionId: number,
    filePath: string
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = APPLICATION_DOC_URL.replace('{position_id}', positionId.toString())
          .replace('{application_id}', applicationId.toString())
          .replace('{document_id}', documentId.toString());
      // url = url + "?download=0";

      this.apiRequest
          .executeFileStream({ url, method: 'GET'},  filePath )
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
    });
  }

}

export default ApplicationDocumentApi;

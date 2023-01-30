import ApiRequest, { INTERFOLIO_SEARCH_V2 } from '../../../api-request';
import { ApiConfig } from '../../../index';
import fs from 'fs';
import FormData from 'form-data';
import { Buffer } from 'buffer';

export const APPLICATION_DOC_BASE_URL_V1 =
  INTERFOLIO_SEARCH_V2 + '/positions/{position_id}/applications/{application_id}/documents';
export const APPLICATION_DOC_URL = APPLICATION_DOC_BASE_URL_V1 + '/{document_id}';
export const APPLICATION_DOC_CREATE_ON_BEHALF_URL =
  INTERFOLIO_SEARCH_V2 + '/byc_applications/{application_id}/application_documents/create_on_behalf';
export const APPLICATION_DOC_DESTROY_ON_BEHALF_URL =
  INTERFOLIO_SEARCH_V2 + '/byc_applications/{application_id}/application_documents/{document_id}/destroy_on_behalf';

export type ApplicationDocumentListing = {
  /** if the document was uploaded by the committee */
  bycommittee_uploaded: boolean;
  /** status of the document being converted to Interfolio PDF */
  conversion_status: string;
  /** date the document was received */
  date_received: string;
  /** id of the document */
  id: number;
  /** if the document has been read */
  is_read: boolean;
  /** if the document has been received */
  is_received: boolean;
  /** name of the document */
  name: string;
  /** document type */
  type: string;
};

export type ApplicationDocumentUploadResponse = {
  /** application id of the application for this document */
  application_id: number;
  /** bookmarks associated with the document */
  bookmarks: any;
  /** if the document was not uploaded by the candidate */
  bycommittee_uploaded: boolean;
  /** if the application can be submitted with document processing is pending */
  can_submit_while_pending: boolean;
  /** status of the conversion to interfolio pdf */
  conversion_status: string;
  /** date the document was created in interfolio */
  created_at: string;
  /** date the document was received */
  date_received: string;
  /** description of the document */
  description: string;
  /** location of the document */
  document_location: string;
  /** original location of the document */
  document_original_location: string;
  /** document title */
  document_title: string;
  /** document type */
  document_type: string;
  /** document id */
  id: number;
  /** if the document has been received */
  is_received: boolean;
  /** the id of the document in the media box */
  media_box_document_id: number;
  /** format of the document (e.g. PDF) */
  media_format: string;
  /** who the document came from (e.g. byc_user) */
  origin: string;
  /** document id of the origin */
  origin_document_id: number;
  /** id of of the position required document */
  required_document_id: number;
  /** date the search was processed at */
  search_processed_at: string;
  /** sort order for the document */
  sort_order: number;
  /** url of the thumbnail */
  thumbnail_url: string;
  /** date the document was updated */
  updated_at: string;
  /** url of the document */
  url: string;
};

/**
 * Class representing api calls for documents attached to
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
  async getDocument({
    documentId,
    applicationId,
    positionId,
  }: {
    documentId: number;
    applicationId: number;
    positionId: number;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      let url = APPLICATION_DOC_URL.replace('{position_id}', positionId.toString())
        .replace('{application_id}', applicationId.toString())
        .replace('{document_id}', documentId.toString());
      url = url + '?dowload=0';

      this.apiRequest
        .executeRest({ url, method: 'GET', responseType: 'text' })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async createDocumentOnBehalf({
    applicationId,
    positionId,
    title,
    type,
    format,
    filePath,
    fileContents,
    fileExtension = 'txt',
    requiredDocumentId,
  }: {
    applicationId: number;
    positionId: number;
    title: string;
    type: string;
    format: string;
    filePath?: string;
    fileContents?: string;
    fileExtension?: string;
    requiredDocumentId?: number;
  }): Promise<ApplicationDocumentUploadResponse> {
    return new Promise((resolve, reject) => {
      const url = APPLICATION_DOC_CREATE_ON_BEHALF_URL.replace('{position_id}', positionId.toString()).replace(
        '{application_id}',
        applicationId.toString(),
      );

      const form = new FormData();
      form.append('application_document[document_title]', title);
      form.append('application_document[document_type]', type);
      form.append('application_document[format]', format);
      if (requiredDocumentId) {
        form.append('application_document[required_document_id]', requiredDocumentId);
      }
      if (filePath) {
        form.append('file', fs.createReadStream(filePath));
      } else if (fileContents) {
        form.append('file', Buffer.from(fileContents), 'upload.' + fileExtension);
      } else {
        reject('Either filePath or fileContents must be provided to ApplicationDocumentAPI.createDocumentOnBehalf');
        return false;
      }

      this.apiRequest
        .executeRest({ url, method: 'POST', body: form })
        .then((response) => resolve(response.application_document))
        .catch((error) => reject(error));
    });
  }

  async deleteDocument({
    documentId,
    applicationId,
    positionId,
  }: {
    documentId: number;
    applicationId: number;
    positionId: number;
  }): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const url = APPLICATION_DOC_URL.replace('{application_id}', applicationId.toString())
        .replace('{position_id}', positionId.toString())
        .replace('{document_id}', documentId.toString());
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => {
          reject(error);
        });
    });
  }

  async destroyDocumentOnBehalf({
    documentId,
    applicationId,
    positionId,
  }: {
    documentId: number;
    applicationId: number;
    positionId: number;
  }): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const url = APPLICATION_DOC_DESTROY_ON_BEHALF_URL.replace('{application_id}', applicationId.toString())
        .replace('{position_id}', positionId.toString())
        .replace('{document_id}', documentId.toString());
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
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
  async saveDocument({
    documentId,
    applicationId,
    positionId,
    filePath,
  }: {
    documentId: number;
    applicationId: number;
    positionId: number;
    filePath: string;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = APPLICATION_DOC_URL.replace('{position_id}', positionId.toString())
        .replace('{application_id}', applicationId.toString())
        .replace('{document_id}', documentId.toString());
      // url = url + "?download=0";

      this.apiRequest
        .executeFileStream({ url, method: 'GET' }, filePath)
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

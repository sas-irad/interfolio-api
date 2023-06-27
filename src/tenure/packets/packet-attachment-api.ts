import { INTERFOLIO_BYC_TENURE_V1, INTERFOLIO_BYC_TENURE_V2 } from '../../api-request';
import ApiRequest from '../../api-request';
import { ApiConfig } from '../../index';
import FormData from 'form-data';
import { Readable } from 'stream';

export const PACKET_ATTACHMENT_BASE_URL_V1 = INTERFOLIO_BYC_TENURE_V1 + '/packets/{packet_id}/packet_attachments';
export const PACKET_ATTACHMENT_URL = PACKET_ATTACHMENT_BASE_URL_V1 + '/{packet_attachment_id}';
export const PACKET_ATTACHMENT_BASE_URL_V2 = INTERFOLIO_BYC_TENURE_V2 + '/packets/{packet_id}/packet_attachments';

/**
 * Represents a document which has been added to a document
 */
export type PacketDocument = {
  /** ID of the document */
  id: number;
  /** ID of the packet */
  packet_id: number;
  /** ID of the workflow step in which the document was added */
  workflow_step_id: number;
  /** Original filename of the file */
  file_name: string;
  /** Name to display for the document */
  display_name: string;
  /** Date the document was added */
  created_at: string;
  /** Date the document was updated */
  updated_at: string;
  /** ???? */
  //document_type: null,
  /** ID of the user who uploaded the document */
  user_id: number;
  /** Order of the document within it's section */
  sort_order: number;
  /** Box id ??? */
  box_id: number;
  /** Status of the conversion to viewable document */
  conversion_status: string;
  /** If downloading the document is allowed */
  downloading_allowed: boolean;
  /** the access level for the document */
  access_level: number;
  /** ID of the document  */
  dossier_document_id: number;
  /** Location of the document */
  dossier_document_location: string;
  //dossier_processed_at: ;
  //dossier_document_original_location: null;
  //tenure_document_original_location: null;
  //tenure_document_location: null;
  //bookmarks: null;
  /** ID of the document in the media box*/
  media_box_document_id: number;
  //media_box_processed_at: null;
  /** If document is a share response ??? */
  is_share_response: boolean;
  /** url of the ducment */
  url: string;
  /** document description */
  description: string;
  /** media_format of the document */
  media_format: string;
  /** pid of the user */
  pid: number;
  /** url of the thumbnail for this document */
  thumbnail_url: string;
  /** id of the fullfillment for which this document applies */
  applicant_fulfillment_id: string;
};

/**
 * Class representing packet evaluator section api calls
 */
export class PacketAttachmentApi {
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
   * Add a document to a packet
   * @param packetId    ID of the packet/case
   * @param displayName Name of the document to be displayed in the reader
   * @param sectionId   Section ID in which to place the document
   * @param file        The file contents
   * @param fileName    The file name for the file
   */
  addDocument({
    packetId,
    displayName,
    sectionId,
    file,
    fileName,
  }: {
    packetId: number;
    displayName: string;
    fileName: string;
    sectionId: number;
    file: Readable | Buffer | string;
  }): Promise<PacketDocument> {
    return new Promise((resolve, reject) => {
      const url = PACKET_ATTACHMENT_BASE_URL_V2.replace('{packet_id}', packetId.toString());

      const formData = new FormData();
      formData.append('packet_id', packetId.toString());
      formData.append('packet_attachment[display_name]', displayName);
      formData.append('packet_section_id', sectionId.toString());
      formData.append('packet_attachment[file]', file, fileName);
      this.apiRequest
        .executeRest({ url, method: 'POST', body: formData })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  /**
   * delete a packet attachment (document uplaoded for the case)
   *
   * @param packetId   Packet id
   * @param packetAttachmentId  Packet attachment id
   *
   * @exmaple
   * ```javascript
   * const deleted = await api.Tenure.PacketAttachments.delete({packetId: 9999, packetAttachmentId: 9999});
   * ```
   */
  delete({ packetId, packetAttachmentId }: { packetId: number; packetAttachmentId: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = PACKET_ATTACHMENT_URL.replace('{packet_attachment_id}', packetAttachmentId.toString()).replace(
        '{packet_id}',
        packetId.toString(),
      );

      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }
}

export default PacketAttachmentApi;

import { INTERFOLIO_SEARCH_V1 } from '../../api-request';
import ApiRequest from '../../api-request';
import { ApiConfig } from '../../index';
import ApplicationDocumentApi, { ApplicationDocumentListing } from './applications/application-document-api';

export const APPLICATION_BASE_URL_V1 = INTERFOLIO_SEARCH_V1 + '/positions/{position_id}/applications';
export const APPLICATION_URL = APPLICATION_BASE_URL_V1 + '/{application_id}';
export const APPLICATION_DETAIL_URL = APPLICATION_URL + '/detail';

export type Application = {
  /** address line 1 of the applicant */
  address: string;
  /** address line 2 of the applicant */
  address2: string;
  /** alternate phone of the applicant */
  alternate_phone: string;
  /** city of the applicant */
  city: string;
  /** country of the applicant */
  country: string;
  /** email of the applicant */
  email: string;
  /** first name of the applicant */
  firstname: string;
  /** highest degree date of the applicant */
  highest_degree_date: string;
  /** highest degree school of the applicant */
  highest_degree_school: string;
  /** unique identifier for this application */
  id: number;
  /** last name of the applicant */
  lastname: string;
  /** position id to which this application is connected */
  position_id: number;
  /** state address of the applicant */
  state: string;
  /** telephone of the applicant */
  telephone: string;
  /** zip/postal code of the applicant */
  zip: string;
};
/**
 * Represents an application detail for a position
 */
export type ApplicationDetail = {
  /** applicant address line 1 */
  address: string;
  /** applicant address line 2 */
  address2: string;
  /** if all ratings and comments are visible for this applicant */
  all_ratings_and_comments_viewable: boolean;
  /** alternate phone for the applicant */
  alternate_phone: string;
  // application_attachments: string[];
  // application_comments: string[];
  /** if application comments are allowed */
  application_comments_allowed: boolean;
  /** documents submitted for the application */
  application_documents: ApplicationDocumentListing[];
  /** status of the application */
  application_status: string;
  /** of the application */
  application_status_id: number;
  /** if tagging is allowed */
  application_tagging_allowed: boolean;
  /** tags applied to this application */
  application_taggings: {
    id: number;
    editable: boolean;
    application_tag_id: number;
    application_tag_name: string;
    application_tag_editable: boolean;
  }[];
  /** if the application is archived */
  archived: boolean;
  /** available application statuses */
  available_application_statuses: {
    allow_review: boolean;
    allow_update: boolean;
    current: boolean;
    default: boolean;
    display_to_applicant: boolean;
    id: number;
    message_template_id: number;
    name: string;
    sort_order: number;
    unit_id: number;
    used: boolean;
  }[];
  /** tags available to apply to this application */
  available_application_tags: {
    id: number;
    name: string;
    position_id: number;
    user_id: number;
    pid: number;
    editable: boolean;
  }[];
  /** average rating of the application */
  average_rating: number;
  /** if the background check has been conducted */
  background_check_conducted: boolean;
  //@todo flesh out bookmark structure
  /** any bookmarks applied to this application */
  bookmarks: any[];
  /** applicant address city */
  city: string;
  //@todo flesh out committee evaluation structure
  /** committee evaluations */
  committee_evaluations: any[];
  /** completeness level of the application */
  completeness_level: string;
  /** country of the application */
  country: string;
  /** desired start date of the application */
  desired_start_date: string;
  /** desired start date display of the application */
  desired_start_date_display: boolean;
  /** disposition codes for the application */
  disposition_codes: { code: string; id: number }[];
  /** document requirements met of the application */
  document_requirements_met: boolean;
  /** editable of the application */
  editable: boolean;
  /** eeo flaggable of the application */
  eeo_flaggable: boolean;
  /** email of the application */
  email: string;
  /** scales for rating */
  evaluation_scales: {
    id: number;
    application_rating_id: number;
    name: string;
    average_rating: number;
    my_rating: number;
    current: boolean;
  }[];
  /** first date sent of the application */
  first_date_sent: string;
  /** firstname of the applicant */
  firstname: string;
  //@todo flesh out form responses
  /** form responses for this application */
  form_responses: any[];
  /** general notes for the application */
  general_notes: string;
  /** highest degree of the application */
  highest_degree: string;
  /** highest degree date of the applicant */
  highest_degree_date: string;
  /** highest degree school of the applicant*/
  highest_degree_school: string;
  /** hiring notes of the applicant */
  hiring_notes: string;
  /** unique identifier for this application */
  id: number;
  /** institution user id of the application */
  institution_user_id: number;
  /** job requisition number of the application */
  job_requisition_number: string;
  /** last date sent of the application */
  last_date_sent: string;
  /** if the last date sent should be displayed for this application */
  last_date_sent_display: string;
  /** last update nested of the application */
  last_update_nested: string;
  /** lastname of the applicant */
  lastname: string;
  /** if materials complete for the application */
  materials_complete: boolean;
  /** my rating of the application */
  my_rating: number;
  /** offer date of the application */
  offer_date: string;
  /** offer date display of the application */
  offer_date_display: boolean;
  /** if an offer was made */
  offer_made: boolean;
  /** other negotiated items for the offer */
  other_negotiated_items: null;
  /** overall rating of the application */
  overall_rating: number;
  /** pid of hte applicant */
  pid: 4486015;
  /** position id for the application */
  position_id: 101152;
  /** position name of the position */
  position_name: string;
  /** state address of the applicant */
  state: string;
  /** telephone of the applicant */
  telephone: string;
  /** if the application was withdrawn */
  withdrawn: boolean;
  /** zip code of the applicant */
  zip: string;
};

/**
 * Class representing packet evaluator section api calls
 */
export class ApplicationApi {
  /**
   * API request object for making the actual http requests
   */
  public apiRequest: ApiRequest;

  public Documents: ApplicationDocumentApi;
  /**
   * Constructor for the object
   * @param config Configuration for API calls
   */
  constructor(config: ApiConfig | ApiRequest) {
    if (config.constructor && config.constructor.name === 'ApiRequest') {
      this.apiRequest = config as ApiRequest;
      this.Documents = new ApplicationDocumentApi(config);
    } else {
      const apiConfig = config as ApiConfig;
      this.apiRequest = new ApiRequest(apiConfig);
      this.Documents = new ApplicationDocumentApi(apiConfig);
    }
  }

  /**
   * Create a new application for a position
   * @param positionId position id for the application
   * @param firstName  first name of the applicant
   * @param lastName   last name of the applicant
   * @param email      email of the applicant
   */
  async create({
    positionId,
    firstName,
    lastName,
    email,
  }: {
    positionId: number;
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<Application> {
    return new Promise((resolve, reject) => {
      const url = APPLICATION_BASE_URL_V1.replace('{position_id}', positionId.toString());
      this.apiRequest
        .executeRest({
          url,
          method: 'POST',
          json: {
            first_name: firstName,
            last_name: lastName,
            email,
          },
        })
        .then((response) => {
          resolve(response.application);
        })
        .catch((error) => {
          reject(error);
        });
    });
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
  async getDetail({
    applicationId,
    positionId,
  }: {
    applicationId: number;
    positionId: number;
  }): Promise<ApplicationDetail> {
    return new Promise((resolve, reject) => {
      const url = APPLICATION_DETAIL_URL.replace('{position_id}', positionId.toString()).replace(
        '{application_id}',
        applicationId.toString(),
      );

      this.apiRequest
        .executeRest({ url, method: 'GET' })
        .then((response) => {
          resolve(response.application);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default ApplicationApi;

import { INTERFOLIO_SEARCH_V1} from '../../api-request';
import ApiRequest from '../../api-request';
import { ApiConfig } from '../../index';
import {Position, POSITION_URL} from "../position-api";
import ApplicationDocumentApi from "./applications/application-document-api";

export const APPLICATION_BASE_URL_V1 = INTERFOLIO_SEARCH_V1 + '/positions/{position_id}/applications';
export const APPLICATION_URL = APPLICATION_BASE_URL_V1 + '/{application_id}';
export const APPLICATION_DETAIL_URL = APPLICATION_URL + '/detail';

/**
 * Represents a document which has been added to a document
 */
export type ApplicationDetail = {
  address: string;
  address2: string;
  all_ratings_and_comments_viewable: boolean;
  alternate_phone: string;
  // application_attachments: string[];
  // application_comments: string[];
  application_comments_allowed: boolean;
  application_documents: {
    id: number;
    name: string;
    type: string;
    date_received: string;
    bycommittee_uploaded: boolean;
    conversion_status: string;
    is_read: boolean;
    is_received: boolean;
  }[]
  /*application_status : null
  application_status_id : null
  application_tagging_allowed : true
  application_taggings : [{id: 1631499, editable: true, application_tag_id: 185748, application_tag_name: "No",…}]
  archived : false
  available_application_statuses : [,…]
  available_application_tags : [{id: 185750, name: "Caribbean", position_id: 101152, user_id: 49987, pid: 3014621, editable: true},…]
  average_rating : null
  background_check_conducted : null
  bookmarks : null
  city : "Laramie"
  committee_evaluations : []
  completeness_level : "Complete"
  country : "US"
  desired_start_date : null
  desired_start_date_display : null
  disposition_codes : [{code: "Does Not Meet Minimum Qualifications", id: 322},…]
  document_requirements_met : true
  editable : true
  eeo_flaggable : true
  email : "fdixon@uwyo.edu"
  evaluation_scales : []
  first_date_sent : "2022-08-30T09:08:40.000Z"
  firstname : "Fredrick Douglass"
  form_responses : [{form_name: "Where did you hear about this position?", form_id: 14997, form_questions: [{,…}]},…]
  general_notes : null
  highest_degree : "Ph.D."
  highest_degree_date : "2018-08-01"
  highest_degree_school : "University of Illinois Urbana-Champaign"
  hiring_notes : null
  */
  id : 3793769,
  /*
  institution_user_id : null
  job_requisition_number : ""
  last_date_sent : "2022-08-30T09:08:43.000Z"
  last_date_sent_display : "Aug 30, 2022"
  last_update_nested : "2022-10-13T02:04:20.000Z"
  lastname : "Dixon"
  materials_complete : true
  my_rating : null
  offer_date : null
  offer_date_display : null
  offer_made : null
  other_negotiated_items : null
  overall_rating : null
  pid : 4486015
  position_id : 101152
  position_name : "Assistant or Associate Professor of African American History"
  state : "WY"
  telephone : ""
  withdrawn : false
  zip : "82070"
   */
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
   * Get a position from the positionId
   * @param id ID of the position
   *
   * @example
   * ```javascript
   * let position = await api.Search.Position.getPosition({id: 9999});
   * ```
   */
  async getDetail({ applicationId, positionId }: { applicationId: number, positionId: number }): Promise<ApplicationDetail> {
    return new Promise((resolve, reject) => {
      const url = APPLICATION_DETAIL_URL.replace('{position_id}', positionId.toString())
          .replace('{application_id}', applicationId.toString());

      this.apiRequest
          .executeRest({ url, method: 'GET'})
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

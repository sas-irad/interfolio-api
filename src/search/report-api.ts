import ApiRequest, { INTERFOLIO_SEARCH_V1 } from '../api-request';
import { ApiConfig } from '../index';

export const SEARCH_REPORT_BASE_URL = INTERFOLIO_SEARCH_V1 + '/reports';
export const REPORT_APPLICATION_SEARCH_URL = SEARCH_REPORT_BASE_URL + '/application_search';


export type ApplicationSearchFacets = {
  /** id of the position */
  position_id: number;
  /** the date range in which to query closed date by */
  application_date_range?: {
    /** closed date start range */
    from: string;
    /** closed date end range */
    to: string;
  };
  /** the rating of the application */
  application_rating?: number;
  my_average_rating?: number;
  archived?: boolean;
  complete?: boolean;
  withdrawn?: boolean;
};

/**
 * Parameters to be sent to the report generate api call
 */
export type ApplicationSearchParams = {
  /** which columns to include */
  criteria?: {
    application: string[];
  };
  /** text to search for in packet */
  search_text?: string;
  /** the facets which to query the the packets by **/
  facets: ApplicationSearchFacets;
  /** the row to begin selecting records from  **/
  from?: number;
  /** the number of records to retrieve **/
  size?: number;
  /** the column and direction of the row sort **/
  sort?: {
    /** the column to sort by **/
    column: string;
    /** the direction to sort by ('asc'|'desc') **/
    direction: string;
  };
};

export type ApplicationData = {
  id: number
  firstname: string;
  lastname: string;
}

export type ApplicationSearchData = {
  applications: ApplicationData[];
  total: number;
}

/**
 * Class representing Report calls
 */
export class ReportApi {
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
   * Retrieve applications for a position
   * @param from            record number to start with
   * @param size            number of records to retrieve
   * @param facets          facets to include for filtering the results
   * @param criteria        list of fields to include
   * @param search_text     text to search on
   * @param sort_column     column to sort by
   * @param sort_direction  direction to sort by
   *
   * @example
   * ```javascript
   * let responses = await api.Search.Reports.applicationSearch({
   *   position_id: 9999,
   *   from: 0,
   *   size: 25,
   * });
   * ```
   */
  public applicationSearch({ from, size, facets, criteria, search_text, sort}: ApplicationSearchParams): Promise<ApplicationSearchData> {
    return new Promise((resolve, reject) => {
      //handle optional params
      if (!from) from = 0;
      if (!size) size = 100;
      if (!criteria) criteria = {"application": [
        "id",
        "firstname",
        "lastname",
        "highest_degree",
        "highest_degree_school",
        "application_status_name",
        "completeness_level",
        "last_date_sent",
        "labels",
        "my_average_rating"
      ]};
      if (!sort) sort = {column: "name", direction: "asc"};
      if (!search_text) search_text = '';

      const url = REPORT_APPLICATION_SEARCH_URL;
      const searchParams = { facets, criteria, sort, from, size, search_text};
      this.apiRequest
        .executeRest({ url: url, method: 'POST', json: searchParams  })
        .then((results) => {
          resolve(results);
        })
        .catch((error) => reject(error));
    });
  }

}

export default ReportApi;

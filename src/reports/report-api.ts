import ApiRequest, { INTERFOLIO_BYC_TENURE_V1 } from '../api-request';
import { ApiConfig } from '../index';

export const REPORT_BASE_URL = INTERFOLIO_BYC_TENURE_V1 + '/reports';
export const REPORT_PACKET_SEARCH_URL = REPORT_BASE_URL + '/packet_search';
export const REPORT_FORM_URL = INTERFOLIO_BYC_TENURE_V1 + '/forms/report';

/**
 * Data returned from a form report
 */
export type FormReportData = {
  /** the column names of the returned data */
  column_names: string[];
  /** the form name */
  form_name: string;
  /** the name of the unit this form is associated with */
  form_unit_name: string;
  /** the max number of records returned */
  limit: number;
  /** the page that these records belong to */
  page: number;
  /** the results of the form */
  results: {
    /** the packet id of the case */
    packet_id: string;
    /** the data ordered according to the column_names listed above */
    table_cells: string[];
  }[];
  /** the total number of records available for the data queried */
  total_count: number;
};

/**
 * Params to query the form report
 */
export type FormReportParams = {
  /** the id of the form */
  form_id: number;
  /** the type of the form (e.g. committee) */
  form_type: string;
  /** the packet ids for the forms of the data to be returned */
  packet_ids: number[];
  /** the number of records to be returned - default = 100 */
  limit?: number;
  /** the page number of the records to be returned - default = 1*/
  page?: number;
};

/**
 * Data returned from the Packet Search
 */
export type ReportPacket = {
  /** flag indicating if this packet is closed **/
  closed: boolean;
  /** date the packet was closed **/
  closed_date: string | null;
  /** date when the packet was created **/
  created_date: string;
  /** email of the candidate **/
  email: string | null;
  /** the formatted status of the packet **/
  formatted_status: string;
  /** First name of the candidate **/
  firstname: string | null;
  /** ID of the Packet/case **/
  id: number;
  /** Last name of the candidate **/
  lastname: string | null;
  /** name of the unit for this packet **/
  unit_name: string;
  /** current status of the packet **/
  status: null | {
    /** the css color designation of the status **/
    color: string;
    /** date that the status was created **/
    created_at: string;
    /** flag indicating if the status is deleted **/
    deleted: boolean;
    /** date the elastic search was updated **/
    elastic_search_updated_at: string;
    /** id of the status **/
    id: number;
    /** name of the status **/
    name: string;
    //packet_id ?//
    /** order for this status to be sorted **/
    sort_order: number;
    /** the unit id to which this status belongs **/
    unit_id: number;
    /** the last time this status was updated **/
    updated_at: string;
  };
};

export type ReportFacets = {
  /** criteria if the packet is archived */
  archived?: boolean;
  /** the date range in which to query closed date by */
  closed_date_range?: {
    /** closed date start range */
    from: string;
    /** closed date end range */
    to: string;
  };
  closed?: boolean;
  /** the date range in which to query created date by */
  created_date_range?: {
    /** created_date start range */
    from: string;
    /** created_date end range */
    to: string;
  };
  /** array of statuses to query by */
  status?: string[];
  /** array of template names to query by */
  template_name?: string[];
  /** array of unit names to query by */
  unit_names?: string[];
};

/**
 * Parameters to be sent to the report generate api call
 */
export type PacketSearchParams = {
  /** which columns to include */
  criteria?: {
    packet: string[];
    custom_forms?: { id: number; questions: number[] }[];
  };
  /** only include custom form facets */
  custom_form_facets_only?: boolean;
  /** text to search for in packet */
  search_text?: string;
  /** the facets which to query the the packets by **/
  facets?: ReportFacets;
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

/**
 * Class representing Report calls
 */
export class ReportApi {
  /**
   * API request object for making the actual http requests
   */
  private readonly apiRequest: ApiRequest;

  /**
   * Constructor for the object
   * @param apiConfig Configuration for API calls
   */
  constructor(apiConfig: ApiConfig) {
    this.apiRequest = new ApiRequest(apiConfig);
  }

  public formReport({ form_id, form_type, packet_ids, limit, page }: FormReportParams): Promise<FormReportData> {
    return new Promise((resolve, reject) => {
      //handle optional params
      if (!page) page = 1;
      if (!limit) limit = 100;

      const url = REPORT_FORM_URL;
      const formData = {
        limit: limit,
        form_id: form_id,
        form_type: form_type,
        'packet_ids[]': packet_ids,
        page: page,
      };
      this.apiRequest
        .executeRest({ url: url, method: 'POST', json: formData })
        .then((results) => {
          resolve(results);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Searches packets by provided criteria
   * @param params
   *
   * @example
   * ```javascript
   * let search = await api.Reports.packetSearch({
   *  from: 0,
   *  size: 100,
   *  search_text: "Test Candidate",
   *  facets: {
   *    unit_names: ["Biology"]
   *  }
   * });
   * ```
   */
  public async packetSearch(params: PacketSearchParams): Promise<{ total: number; data: ReportPacket[] }> {
    return new Promise((resolve, reject) => {
      const url = REPORT_PACKET_SEARCH_URL;
      this.apiRequest
        .executeRest({ url, method: 'POST', json: params })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }
}

export default ReportApi;

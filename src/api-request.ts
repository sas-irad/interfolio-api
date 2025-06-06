import * as crypto from 'crypto';
import got from 'got';
import { Options, Method } from 'got';
import { ApiConfig } from './index';
import { Readable } from 'stream';
import util, { promisify } from 'util';
import { createWriteStream } from 'fs';
import * as stream from 'stream';

/** The v1 core interfolio for global objects such as users and units */
export const INTERFOLIO_CORE_URL_V1 = '/byc/core/{module}/{tenant_id}';
/** the v2 core interfolio url for global objects such as users/ units) */
export const INTERFOLIO_CORE_URL_V2 = '/byc/core/v2/{module}/{tenant_id}';

/** the v1 tenure information endpoint root */
export const INTERFOLIO_BYC_TENURE_V1 = '/byc-tenure/{tenant_id}';
/** the v2 tenure information endpoint root */
export const INTERFOLIO_BYC_TENURE_V2 = '/byc-tenure/v2/{tenant_id}';

/** the v1 search information endpoint root */
export const INTERFOLIO_SEARCH_V1 = '/byc-search/{tenant_id}';
/** the v2 serach information endpoint root */
export const INTERFOLIO_SEARCH_V2 = '/byc-search/v2/{tenant_id}';

/**
 * The current Interfolio base urls for REST calls
 */
export const INTERFOLIO_REST_URLS = {
  /** The production REST URL */
  PRODUCTION: 'https://logic.interfolio.com',
  /** The Sandbox REST URL */
  SANDBOX: 'https://logic-sandbox.interfolio.com',
  /** The BETA REST URL */
  BETA: 'https://logic-beta.interfolio.com',
  /** The STAGIN REST URL */
  STAGING: 'https://logic.staging.interfolio.com',
};

/**
 * The current Interfolio base URLs for GraphQL Calls
 */
export const INTERFOLIO_GRAPHQL_URLS = {
  /** The Production GraphQL URL */
  PRODUCTION: 'https://caasbox.interfolio.com',
  /** The Sandbox GraphQL URL */
  SANDBOX: 'https://caasbox-sandbox.interfolio.com',
  /** The BETA GraphQL URL */
  BETA: 'https://caasbox-beta.interfolio.com',
  /** The STAGING GraphQL URL */
  STAGING: 'https://caasbox.staging.interfolio.com',
};

/**
 * The definition of the parameters necessary for a REST API call
 */
export type RestRequest = {
  /** The relative url for the endpoint */
  url: string;
  /** The http method to execute -defaults to GET*/
  method?: Method;
  /** The form elements to submit with the request */
  form?: string | any | undefined;
  /** The json object to submit with the request */
  json?: any | undefined;
  /** The body of the request */
  body?: string | Readable | Buffer | undefined;
  /** The response type expected from the call*/
  responseType?: 'text' | 'json' | 'buffer';
};

/**
 * The general type of response that is returned from an API Call
 */
export type ApiResponse = {
  [key: string]: ApiResponse | ApiResponse[] | string | string[] | number | number[] | boolean | unknown[];
};

/**
 * The definition of the paramenters necessary for a GraphQL Api Call
 */
export type GraphQlRequest = {
  /** The operation name e.g. "getForms" */
  operationName: string;
  /** Any variables required for the query  e.g. {searchText: "Form Name"} */
  variables?: any;
  /** The GraphQL query itself e.g. "query getForms($searchText: String!) {forms(searchText: $searchText...) {results {description id }}}*/
  query: string;
};

/**
 * Class to handle requests to the Interfolio API.  Generally not called directly but used by API functions to
 * actually make the call
 */
export class ApiRequest {
  /** The API Config  */
  private config: ApiConfig;

  /** Flag indicating if options sent to server should be output with console.log */
  public outputRequestOptions = false;

  /** Flag indicating if the response should be output*/
  public outputResponse = false;

  /** Flag indicating if upon an error the request and error should be output with console.error */
  public outputErrors = false;

  /** errors which were encountered */
  public errors: { error: any; url: string | URL | undefined; headers: any; method: Method | undefined }[];

  /** number of retries that should be attempted when encountering an error */
  public maxRetries = 2;

  /**
   * Initialize the request object with the necessary config options
   *
   * @param config The API Configuration settings (keys and base urls)
   * @constructor
   */
  constructor(config: ApiConfig) {
    this.errors = [];
    this.config = config;
  }

  /**
   * Execute the api using Got.js
   *
   * @param options
   */
  private async execute(options: Options): Promise<any> {
    if (this.outputRequestOptions) console.log(util.inspect(options, { showHidden: false, depth: null }));
    try {
      const response: any = await got(options);
      if (this.outputResponse) console.log(util.inspect(response, { showHidden: false, depth: null }));
      //if we got a response and are expected text
      if (response.body && options.responseType === 'text') {
        return response.body;
      }
      //if we gat a response and are expecting json
      else if (response.body && options.responseType === 'json' && typeof response.body === 'object') {
        //check for interfolio errors in the response body
        if (Object.hasOwnProperty.call(response.body, 'errors')) {
          throw Error(response.body.errors[0].message);
        }
        //return the response body
        return response.body;
      } else {
        return {};
      }
    } catch (error) {
      const errorObject = {
        error: error,
        url: options.url,
        headers: options.headers,
        method: options.method as Method,
      };
      this.errors.push(errorObject);
      if (this.outputErrors) {
        console.error(util.inspect(errorObject, { showHidden: false, depth: null }));
      } else if (this.outputResponse) {
        console.log(util.inspect(error, { showHidden: false, depth: null }));
      }
      //if an error response from interfolio exists, then return the first error message
      if (Array.isArray(error?.response?.body?.errors) && error.response.body.errors.length > 0) {
        throw Error(error.response.body.errors[0].message);
      }
      throw error;
    }
  }

  /**
   * Execute a request against the REST (logic.interfolio.com) endpoint
   *
   * @param url     url to send (should start with /)
   * @param method  HTTP Method (e.g GET, POST, DELETE)
   * @param form    Form to include in the body (can include form/body or json).
   * @param body    TEXT of the Body of the request
   * @param json    JSON to include as body of request
   * @param responseType  type of response expected (defaults to json)
   * @param retryNum The number of retries that this request is currently attempting
   */
  public async executeRest(
    { url, method = 'GET', form = undefined, body = undefined, json = undefined, responseType = 'json' }: RestRequest,
    retryNum = 0,
  ): Promise<any> {
    url = this.replaceSlugs(url);
    const options = this.getRequestOptions({ method, url, body, form, json, host: this.config.restUrl, responseType });
    try {
      return await this.execute(options);
    } catch (error) {
      retryNum++;
      if (retryNum <= this.maxRetries) {
        return this.executeRest({ url, method, form, body, json }, retryNum);
      }
      throw error;
    }
  }

  public async executeFileStream(
    { url, method = 'GET', form = undefined, body = undefined, json = undefined }: RestRequest,
    filePath: string,
  ): Promise<any> {
    url = this.replaceSlugs(url);
    const options = this.getRequestOptions({
      method,
      url,
      body,
      form,
      json,
      host: this.config.restUrl,
      responseType: 'buffer',
    });
    try {
      const pipeline = promisify(stream.pipeline);

      await pipeline(got.stream({ ...options, isStream: true }), createWriteStream(filePath));
    } catch (error) {
      //if an error response from interfolio exists, then return the first error message
      if (Array.isArray(error?.response?.body?.errors) && error.response.body.errors.length > 0) {
        throw Error(error.response.body.errors[0].message);
      }
      throw error;
    }
  }

  /**
   * Execute an API request against the GraphQL (caas-box) data endpoint
   *
   * @param gqlRequest
   * @param retryNum  The number of retries that this request is currently attempting
   */
  public async executeGraphQl(gqlRequest: GraphQlRequest, retryNum = 0): Promise<any> {
    const url = this.replaceSlugs('/{tenant_id}/graphql');
    const options = this.getRequestOptions({ method: 'POST', host: this.config.graphQlUrl, url, json: gqlRequest });
    try {
      return await this.execute(options);
    } catch (error) {
      retryNum++;
      if (retryNum <= this.maxRetries) {
        return this.executeGraphQl(gqlRequest, retryNum);
      }
      throw error;
    }
  }

  /**
   * Tests if a string is parsable JSON
   * @param str the string to test for json parseability
   */
  public static isJson(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * encode a string for url/form values
   *
   * @param str The string to encode
   * @return The encoded string
   */
  public static rfc3986EncodeURIComponent(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);
  }

  /**
   * Replace standard slugs (tenant id) a given url
   *
   * @param url   The url which contains the slugs to replace
   * @return {string}
   */
  private replaceSlugs(url: string): string {
    return url.replace(/{tenant_id}/g, this.config.tenantId.toString());
  }

  /**
   * Get the authorization http header value for interfolio hmac authentication
   *
   * @param method         The HTTP Method
   * @param requestString  The request string
   * @return The Authorization header needed for HMAC authentication
   */
  private getAuthorizationHeader(method: string, requestString: string) {
    const hmac = crypto.createHmac('sha1', this.config.privateKey);
    hmac.update(method + '\n\n\n' + this.getTimestamp() + '\n' + requestString);
    return 'INTF ' + this.config.publicKey + ':' + hmac.digest('base64');
  }

  /**
   * Get the Request
   * @param method          The Method of the Request (e.g. GET, POST etc)
   * @param requestString   The request string (i.e. everything that follows the domain name in the url)
   */
  private getRequestHeaders(method: Method, requestString: string) {
    return {
      TimeStamp: this.getTimestamp(),
      Authorization: this.getAuthorizationHeader(method, requestString),
    };
  }

  /**
   * Get the options to send to the got.js request
   *
   * @param {RestRequest} request - The request to be sent
   * @param {string} request.url - The url (not including host)
   * @param {string} request.host - The domain host the url
   */
  private getRequestOptions({
    url,
    host,
    method = 'GET',
    form,
    body,
    json,
    responseType = 'json',
  }: RestRequest & { host: string }): Options & { isStream?: true | undefined } {
    const options: Options & { isStream?: true | undefined } = { encoding: 'utf8', retry: 0 };
    //add the host to url
    options.url = host + this.replaceSlugs(url);
    options.method = method;
    options.headers = this.getRequestHeaders(method as Method, url);
    options.responseType = responseType;
    if (json) options.json = json;
    if (body) options.body = body;
    if (form) options.form = form;
    return options;
  }

  /**
   * Get the timestamp formatted as Intefolio Wants [YYYY-MM-DD HH:II:SS]
   * @returns {string}
   */
  private getTimestamp(): string {
    ///ISO returns something like '2018-09-28T09:05:12.345Z'
    //remove the T, the microseconds and the Z at the end;
    return new Date().toISOString().replace('T', ' ').replace(/\..*Z/, '');
  }

  /**
   * Converts a javascript object into form data
   * @param o object  (the object)
   * @param prefix string (prefex to append to parameter names)
   */
  public static objectToFormData(o: { [key: string]: any }, prefix = ''): string {
    let str = '';
    for (const index in o) {
      let fieldName = index;
      //add prefix to the index if necessary
      if (prefix.length > 0) {
        fieldName = prefix + '[' + index + ']';
      }

      //handle arrays
      if (Array.isArray(o[index])) {
        for (const val of o[index]) {
          str += fieldName + '[]=' + this.rfc3986EncodeURIComponent(val) + '&';
        }
      }
      //handle objects
      else if (typeof o[index] === 'object' && o[index] !== null) {
        str += ApiRequest.objectToFormData(o[index], fieldName);
      }
      //handle booleans
      else if (typeof o[index] === 'boolean') {
        str += fieldName + (o[index] ? '=true' : '=false');
      }
      //handle strings
      else if (typeof o[index] === 'string') {
        str += index + '=' + this.rfc3986EncodeURIComponent(o[index]) + '&';
      } else if (typeof o[index] === 'number') {
        str += index + '=' + o[index].toString() + '&';
      } else {
        str += index + '=' + this.rfc3986EncodeURIComponent(o[index].toString()) + '&';
      }
    }
    return str;
  }
}

export default ApiRequest;

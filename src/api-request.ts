import * as crypto from "crypto";
import got from "got";
import {Options, Method} from "got";
import {ApiConfig} from "./index";
import {Readable} from "stream";


export const INTERFOLIO_CORE_URL_V1 = '/byc/core/tenure/{tenant_id}';
// export const INTERFOLIO_CORE_URL_V2 = '/byc/core/v2/tenure/{tenant_id}';
// export const INTERFOLIO_BYC_TENURE_V1 = '/byc-tenure/{tenant_id}';
// export const INTERFOLIO_BYC_TENURE_V2 = '/byc-tenure/v2/{tenant_id}';

export type RestRequest = {
  url: string;
  method?: Method;
  form?: string | any | null;
  json?: any | null;
  body?: string | Readable | Buffer | undefined;
};

/**
 * Class to handle requests to the Interfolio API
 */
export default class ApiRequest {

  private config: ApiConfig;

  /**
   * Initialize the request object with the necessary config options
   * @param config ApiConfig
   * @constructor
   */
  constructor(config: ApiConfig) {
    this.config = config;
  }

  /**
   * Execute the api using Got.js
   * @param {Options} got.js options
   */
  private async execute(options: Options): Promise<any> {
    try {
      const response: any = await got(options);
      //if we got a response
      if(response.body && typeof response.body === "object") {
        return(response.body);
      }
      else {
        return({});
      }
    }
    catch (error) {
      //if an error response from interfolio exists, then return the first error message
      if(Array.isArray(error?.response?.body?.errors) && error.response.body.errors.length > 0) {
        if(error.response.body.errors.length > 0) {
          throw(error.response.body.errors[0].message)
        }
      }
      throw(error);
    }
  }

  public async executeRest({url, method = "GET", form = undefined, body = undefined, json = undefined}: RestRequest): Promise<any> {
    url = this.replaceSlugs(url);
    const options = this.getRequestOptions({method, url, body, form, json, host: this.config.restUrl});
    return await this.execute(options);
  }

  public async executeGraphQl(gqlRequest: {operationName: string, variables?: any, query: string}): Promise<any> {
    const url = this.replaceSlugs('/{tenant_id}/graphql');
    const options = this.getRequestOptions({method: "POST", host:  this.config.graphQlUrl, url, form: gqlRequest});
    return await this.execute(options);
  }

  /**
   * Tests if a string is parseable JSON
   * @param str
   */
  public static isJson(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  public static rfc3986EncodeURIComponent(str: string): string {
    return encodeURIComponent(str).replace(/[!'()*]/g, escape);
  }



  private replaceSlugs(url: string): string {
    return url.replace(/{tenant_id}/g, this.config.tenantId.toString());
  }
  /**
   * Get the timestamp formatted as Intefolio Wants [YYYY-MM-DD HH:II:SS]
   * @returns {string}
   */
  private getTimestamp(): string {
    ///ISO returns something like '2018-09-28T09:05:12.345Z'
    //remove the T, the microseconds and the Z at the end;
    return new Date().toISOString().replace('T',' ').replace(/\..*Z/, '');
  }

  private getAuthorizationHeader(method: string, requestString: string) {
    const hmac = crypto.createHmac('sha1', this.config.privateKey);
    hmac.update(method + "\n\n\n" + this.getTimestamp() + "\n" + requestString);
    return "INTF " + this.config.publicKey + ':' + hmac.digest('base64');
  }

  private getRequestHeaders(method: Method, requestString: string) {
    return {
      'TimeStamp': this.getTimestamp(),
      'Authorization': this.getAuthorizationHeader(method, requestString)
    };

  }

  /**
   * Get the options to send to the request.js request
   *
   * @param {RestRequest} request - The request to be sent
   * @param {string} request.url - The url (not including host)
   * @param {string} request.host - The domain host the url
   * @param {string|any} data - any data for the body of the request
   * @param formDataType - the format of the data in the body can be  [form / formData / json] this determines what to set request.option
   */
  private getRequestOptions({url, host, method="GET", form, body, json}: RestRequest & {host: string}): Options {
    const options: Options = {retry: 0};
    //add the host to url
    options.url = host + this.replaceSlugs(url);
    options.method = method;
    options.headers = this.getRequestHeaders(method, url);
    options.responseType = "json";
    if(json) options.json = json;
    if(body) options.body = body;
    if(form) options.form = form;
    return options;
  }


  /**
   * Converts a javascript object into form data
   * @param o object  (the object)
   * @param prefix string (prefex to append to parameter names)
   */
  public static objectToFormData(o: {[key: string]: any}, prefix = ""): string {
    let str = "";
    for(const index in o) {
      let fieldName = index;
      //add prefix to the index if necessary
      if(prefix.length > 0) {
        fieldName = prefix + '[' + index + ']';
      }

      //handle arrays
      if(Array.isArray(o[index])) {
        for(const val of o[index]) {
          str += fieldName + '[]=' + this.rfc3986EncodeURIComponent(val) + '&';
        }
      }
      //handle objects
      else if(typeof o[index] === 'object' && o[index] !== null) {
        str += ApiRequest.objectToFormData(o[index], fieldName);
      }
      //handle booleans
      else if(typeof o[index] === 'boolean') {
        str += fieldName + (o[index] ? "=true" : "=false");
      }
      //handle strings
      else if(typeof o[index] === 'string') {
        str += index + '=' + this.rfc3986EncodeURIComponent(o[index]) + '&';
      }
      else if(typeof o[index] === 'number') {
        str += index + '=' + o[index].toString() + '&'
      }
      else {
        str += index + '=' + this.rfc3986EncodeURIComponent(o[index].toString()) + '&';
      }
    }
    return str;
  }
}

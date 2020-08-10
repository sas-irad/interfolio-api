import ApiRequest from './api-request';
import UnitApi from "./unit/unit-api";


/**
 * Class which has references to all implemented Interfolio API calls
 */
export class API {
  /**
   * Handle to the Unit Api
   * @type {UnitApi}
   */
  public readonly Unit: UnitApi;

  /**
   * Creates the Interfolio API class with the tenant info and endpoint roots for accessing Interfolio data
   *
   * @constructor
   * @param {ApiConfig} config
   */
  constructor(config: ApiConfig) {
    this.Unit = new UnitApi(config);
  }
}
export default API;

/**
 * ApiConfig specifies the needed parameters to initialize API calls to Interfolio
 *
 * @property {string} restUrl  The Rest URL endpoint root with no final slash(e.g. https://logic.interfolio.com)
 * @property {string} graphQlUrl  The GraphQL URL endpoint root with not final slash (e.g. https://caasbox.interfolio.com)
 * @property {number} tenantId  The Interfolio tenant id
 * @property {string} publicKey  The public key provided by Interfolio for API access
 * @property {string} privateKey  The private key provided by Interfolio for API access
 */
export type ApiConfig = {
  restUrl: string;
  graphQlUrl: string;
  tenantId: number;
  publicKey: string;
  privateKey: string;
};


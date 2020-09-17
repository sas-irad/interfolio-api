import UnitApi from './units/unit-api';
import CommitteeApi from './committees/committee-api';
import UserApi from './users/user-api';

/**
 * Class which has references to all implemented Interfolio API calls
 *
 * To initialize the API object in javascript:
 * ```javascript
 *
 *const INTERFOLIO_API = require('@sas-irad/interfolio-api/lib');
 *
 *const api = new INTERFOLIO_API.API({
 *   "restUrl": "https://logic.interfolio.com",
 *   "graphQlUrl": "https://caasbox.interfolio.com",
 *   "tenantId": 99999,
 *   "privateKey": "Interfolio supplied Private Key",
 *   "publicKey": "Interfolio supplied Public Key"
 *});
 * ```
 *
 *
 * To inialize and use in a typescript project:
 * ```typescript
 *import API from '@sas-irad/interfolio-api/lib';
 *const api = new API({
 *  "restUrl": "https://logic.interfolio.com",
 *  "graphQlUrl": "https://caasbox.interfolio.com",
 *  "tenantId": 99999,
 *  "privateKey": "Interfolio supplied Private Key",
 *  "publicKey": "Interfolio supplied Public Key"
 *});
 * ```
 */
export class API {
  /** Handle to the Committee Api calls */
  public readonly Committees: CommitteeApi;
  /** Handle to the Unit Api calls */
  public readonly Units: UnitApi;
  /** Handle to the User Api calls */
  public readonly Users: UserApi;

  /**
   * Creates the Interfolio API class with the tenant info and endpoint roots for accessing Interfolio data
   *
   * @constructor
   * @param config The ApiConfig containing connection information
   */
  constructor(config: ApiConfig) {
    this.Committees = new CommitteeApi(config);
    this.Units = new UnitApi(config);
    this.Users = new UserApi(config);
  }
}
export default API;

/**
 * ApiConfig specifies the needed parameters to initialize API calls to Interfolio
 */
export type ApiConfig = {
  /** The Rest URL endpoint root with no final slash(e.g. https://logic.interfolio.com) */
  restUrl: string;
  /** The GraphQL URL endpoint root with not final slash (e.g. https://caasbox.interfolio.com) */
  graphQlUrl: string;
  /** The Interfolio tenant id */
  tenantId: number;
  /** The public key provided by Interfolio for API access */
  publicKey: string;
  /** The private key provided by Interfolio for API access */
  privateKey: string;
};

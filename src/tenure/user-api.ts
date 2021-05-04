import { ApiConfig } from '../index';
import ApiRequest, { ApiResponse } from '../api-request';
import { INTERFOLIO_CORE_URL_V1, INTERFOLIO_CORE_URL_V2 } from '../api-request';
import { Unit } from './unit-api';
import Utils, { DeNestingDef } from '../utils';

export const USER_URL_BASE = INTERFOLIO_CORE_URL_V1 + '/users';
export const USER_URL = USER_URL_BASE + '/{user_id}';
export const USER_CURRENT_URL = '/byc-tenure/{tenant_id}/users/current';
export const USER_SEARCH_URL =
  INTERFOLIO_CORE_URL_V1 + '/institutions/{tenant_id}/users/search?limit={limit}&search={search}';
export const USER_SSO_URL = INTERFOLIO_CORE_URL_V2 + '/institutions/{tenant_id}/users/{user_id}/sso_id';

/**
 * Committee membership returned for a user
 */
export type CommitteeMemberCommittee = {
  /** Id of the committee membership */
  committee_member_id: number;
  /** Id of the committee */
  id: number;
  /** Flog indicating if user is the manager of the committee */
  manager: boolean;
  /** Name of the commitee */
  name: string;
  /** Type of the committee (e.g. StandingCommittee)*/
  type: string;
  /** Unit id of the committee */
  unit_id: number;
};
/**
 * User type as returned by getUser()
 */
export type User = {
  /** Unit ids for which the user can act as an eeo officer */
  acts_as_eeo_officer_unit_ids: number[];
  // administrator_hierarchy: any[];
  // administrator_institution_ids: number[];
  // administrator_institutions: string[];
  /** Unit ids for which this user is an administrator */
  administrator_unit_ids: number[];
  // administrator_unit_names: []
  /** Units for which this user is an administrator */
  administrator_units: Unit[];
  //api_candidate_notify: boolean;
  /** Flag indicating if this user is an API user */
  api_user: boolean;
  /** Flag indicating if this user is a beta user */
  beta_user: boolean;
  // branding_timestamp: boolean;
  //committee_manager_unit_ids: number[];
  //committee_manager_unit_names: number[];
  //committee_manager_units: string[];
  /** Committees that the users is a member of  */
  committee_member_committees: CommitteeMemberCommittee[];
  /** Date the user was created */
  created_at: string;
  // display_banner_search: boolean;
  // display_banner_tenure: boolean;
  /** Unit Ids for which the users is an eeo officer */
  eeo_officer_unit_ids: number[];
  // eeo_officer_unit_names: []
  // eeo_officer_units: []
  /** Email address of the user */
  email: string;
  /** Flag indicating if the enterprise dossier is enabled for this user */
  enterprise_dossier_enabled: boolean;
  //evaluator_unit_ids:
  evaluator_units: Unit[];
  /** Flag indicating if the user is external */
  external_user: boolean;
  /** First name of the user */
  first_name: string;
  /** ID of the user */
  id: number;
  /** inistitutions the user is affiliated with */
  institution_affiliations: { id: number; name: string }[];
  //institutions_branding: []
  /** Last name of the user */
  last_name: string;
  /** Legacy PID of the user */
  legacy_pid: number;
  //permissions: []
  /** PID of the user */
  pid: number;
  /** Flag indicating if this user is a super user */
  superuser: false;
  /** ids for which this user has access */
  tenant_ids: number[];
  /** flag indicating if the tenant requires sso login */
  tenant_requires_sso: boolean;
  /** flag indicating if the tenant allows sso login */
  tenant_uses_sso: boolean;
  //titles: any[];
  /** Lookup mapping for the unit to it's ancestor */
  unit_to_ancestor_lookup: { [key: number]: number };
  /** Date when the user was last updated */
  updated_at: string;
};

/**
 * Class representing the Interfolio User
 *
 * ```javascript
 * let user = await api.Users.getUser(99999);
 * ```
 */
export class UserApi {
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

  /**
   * Find the interfolio user by searching by email
   * @param email Email address of the user
   *
   * @example
   * ```javascript
   * let user = await api.Users.findUserByEmail({email: "myemail@example.com"});
   * ```
   */
  public findUserByEmail({ email }: { email: string }): Promise<User> {
    const apiRequest = this.apiRequest;

    return new Promise((resolve, reject) => {
      const url = USER_SEARCH_URL.replace('{limit}', '100').replace('{search}', email);

      apiRequest
        .executeRest({ url: url })
        .then((response) => {
          //loop through all of the results and make sure that the email matche
          let user = null;
          for (const i in response.results) {
            if (response.results[i].email) user = response.results[i];
          }
          if (user === null) {
            reject('No User found with email = "' + email + '"');
          } else {
            this.getUser({ id: user.id })
              .then((user) => resolve(user))
              .catch((error) => reject(error));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Get the user record
   * @param id ID of the user
   *
   *
   * @example
   * ```javascript
   * let user = await api.Users.getUser({id: 9999});
   * ```
   */
  public async getUser({ id }: { id: number }): Promise<User> {
    return new Promise((resolve, reject) => {
      const url = USER_URL.replace('{user_id}', id.toString());
      this.apiRequest
        .executeRest({ url: url })
        .then((results) => {
          const user: User = this.deNest(results.user) as User;
          resolve(user);
        })
        .catch((error) => reject(error));
    });
  }

  /**
   * Create a new user
   * @param firstName First Name of the user
   * @param lastName Last Name of the user
   * @param email Email Address of the user (must be unique)
   * @param suppressWelcomeEmail Flag indicating if you want to suprress the welcome email (default true)
   * @param welcomeMessage  Welcome message
   * @param copySelf  Flag Indicating if the welcome email should be copied to the current user
   * @param unitId Unit id of the user
   *
   * @example
   * ```javascript
   * let user = await api.Users.create({firstName: "Jane", lastName: "Doe", email: "janedoe@example.com"};
   * ```
   */
  public async create({
    firstName,
    lastName,
    email,
    suppressWelcomeEmail = true,
    welcomeMessage = '',
    copySelf = false,
    unitId,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    suppressWelcomeEmail?: boolean;
    welcomeMessage?: string;
    copySelf?: boolean;
    unitId?: number;
  }): Promise<User> {
    return new Promise((resolve, reject) => {
      const url = USER_URL_BASE;
      const form = {
        'user[first_name]': firstName,
        'user[last_name]': lastName,
        'user[email]': email,
        suppress_welcome_email: suppressWelcomeEmail,
        welcome_message: welcomeMessage,
        copy_self: copySelf,
        unit_id: unitId,
      };
      this.apiRequest
        .executeRest({ url, method: 'POST', form: form })
        .then((response) => {
          resolve(this.getUser(response.id));
        })
        .catch((error) => reject(error));
    });
  }

  public currentUser(): Promise<User> {
    console.log(USER_CURRENT_URL);
    return new Promise((resolve, reject) => {
      this.apiRequest
        .executeRest({ url: USER_CURRENT_URL })
        .then((response) => {
          const user: User = this.deNest(response.user) as User;
          resolve(user);
        })
        .catch((error) => reject(error));
    });
  }

  private deNest(response: ApiResponse): User {
    const denestDefs: DeNestingDef = {
      administrator_units: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'administrator_unit',
      },
    };
    const user = Utils.deNest(response, denestDefs) as User;
    return user;
  }
}
export default UserApi;

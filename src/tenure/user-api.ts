import { ApiConfig } from '../index';
import ApiRequest, { ApiResponse } from '../api-request';
import { INTERFOLIO_CORE_URL_V1, INTERFOLIO_CORE_URL_V2 } from '../api-request';
import { Unit } from '../core/unit-api';
import Utils, { DeNestingDef } from '../utils';

export const USER_URL_BASE = INTERFOLIO_CORE_URL_V1.replace('{module}', 'tenure') + '/users';
export const USER_URL = USER_URL_BASE + '/{user_id}';
export const USER_CURRENT_URL = '/byc-tenure/{tenant_id}/users/current';
export const USER_SEARCH_URL =
  INTERFOLIO_CORE_URL_V1.replace('{module}', 'tenure') +
  '/institutions/{tenant_id}/users/search?limit={limit}&search={search}&page={page}';
export const USER_SSO_URL =
  INTERFOLIO_CORE_URL_V2.replace('{module}', 'tenure') + '/institutions/{tenant_id}/users/{user_id}/sso_id';

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
  /**  list of titles assigned to the user */
  titles: {
    /** ID of the title assginment */
    id: number;
    /** Name of the title */
    name: string;
    /** UnitID for the title */
    unit_id: number;
    /** Unit Name for the title */
    unit_name: string;
  }[];
  /** Lookup mapping for the unit to it's ancestor */
  unit_to_ancestor_lookup: { [key: number]: number };
  /** Date when the user was last updated */
  updated_at: string;
};

/** Type returnd by searching for a user */
type UserSearchResults = {
  limit: number;
  page: number;
  total_count: number;
  results: {
    /** User ID */
    id: number;
    /** User PID */
    pid: number;
    /** First Name of User */
    first_name: string;
    /** Last Name of User */
    last_name: string;
    /** Email of user */
    email: 'api-test@example.com';
    /** if user is an external user */
    external_user: boolean;
    /** list of unit names the user is administrator for */
    administrator_unit_names: string[];
    /** list of institution administrator ids */
    administrator_institution_ids: number[];
    /** list of unit ids the user is an administrator for */
    administrator_unit_ids: number[];
    /** List of unit names the user is an evaluator for */
    evaluator_unit_names: string[];
    /** list of unit ids the user is an evaluator for */
    evaluator_unit_ids: string[];
    titles: {
      /** ID of the title assginment */
      id: number;
      /** Name of the title */
      name: string;
      /** UnitID for the title */
      unit_id: number;
      /** Unit Name for the title */
      unit_name: string;
    }[];
  }[];
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
   * Find the interfolio user by searching by email
   * @param email Email address of the user
   *
   * @example
   * ```javascript
   * let user = await api.Tenure.Users.findUserByEmail({email: "myemail@example.com"});
   * ```
   */
  public findUserByEmail({ email }: { email: string }): Promise<User> {
    return new Promise((resolve, reject) => {
      this.searchUsers({ searchTerm: email })
        .then((response) => {
          //loop through all of the results and make sure that the email matches
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
   * let user = await api.Tenure.Users.getUser({id: 9999});
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
   * @param externalUser Flag indicating if the user is external
   * @param userType Type of the user (external, internal, etc)
   *
   * @example
   * ```javascript
   * let user = await api.Tenure.Users.create({firstName: "Jane", lastName: "Doe", email: "janedoe@example.com"};
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
    externalUser = true,
    userType = 'external',
  }: {
    firstName: string;
    lastName: string;
    email: string;
    suppressWelcomeEmail?: boolean;
    welcomeMessage?: string;
    copySelf?: boolean;
    unitId?: number;
    externalUser?: boolean;
    userType?: string;
  }): Promise<User> {
    return new Promise((resolve, reject) => {
      const url = USER_URL_BASE;
      const form = {
        'user[first_name]': firstName,
        'user[last_name]': lastName,
        'user[email]': email,
        'user[user_type]': userType,
        external_user: externalUser,
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

  /**
   * Get the current API User
   *
   * @example
   * ```javascript
   * let currentUser = await api.Tenure.Users.currentUser();
   * ```
   */
  public currentUser(): Promise<User> {
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

  /**
   * Search all users by search term
   * @param searchTerm  String to search by
   * @param limit       Number of results to return
   * @param page        Page of results to return if results are greater than the limit
   *
   * @example
   * ```javascript
   * const searchResults = await api.Tenure.Users.searchUsers({searchTerm: "Bob Jones"});
   * console.log(searchResults.results[0]);
   * ```
   */

  public searchUsers({
    searchTerm,
    limit = 100,
    page = 1,
  }: {
    searchTerm: string;
    limit?: number;
    page?: number;
  }): Promise<UserSearchResults> {
    return new Promise((resolve, reject) => {
      const url = USER_SEARCH_URL.replace('{limit}', limit.toString())
        .replace('{page}', page.toString())
        .replace('{search}', encodeURIComponent(searchTerm));
      this.apiRequest
        .executeRest({ url })
        .then((response) => resolve(response))
        .catch((error) => reject(error));
    });
  }

  /**
   * Denests user object by removeing administrator unit level
   * @param response
   * @private
   */
  private deNest(response: ApiResponse): User {
    const denestDefs: DeNestingDef = {
      administrator_units: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'administrator_unit',
      },
    };
    return Utils.deNest(response, denestDefs) as User;
  }
}
export default UserApi;

import { ApiConfig } from '../index';
import Utils, { DeNestingDef } from '../utils';
import ApiRequest, { ApiResponse } from '../api-request';
import { INTERFOLIO_BYC_TENURE_V1 } from '../api-request';

/**
 * @const Base url for committee api calls
 */
export const COMMITTEE_BASE_URL = INTERFOLIO_BYC_TENURE_V1 + '/committees';
export const COMMITTEE_URL = COMMITTEE_BASE_URL + '/{committee_id}';
export const STANDING_COMMITTEES_URL = COMMITTEE_BASE_URL + '/standing_committees';
export const STANDING_COMMITTEE_CREATE_URL = INTERFOLIO_BYC_TENURE_V1 + '/standing_committees';

//Imported after url consts since CommitteeMember uses them
import CommitteeMemberAPI, { CommitteeMember } from './committees/committee-member-api';

/**
 * An Interfolio committee definition
 */
export type Committee = {
  /** ID of the commitee */
  id: number;
  /** Name of the committee */
  name: string;
  /** Type of the committee (standing etc) */
  type: string;
  /** Unit id of the committee */
  unit_id: number;
  /** Packet ID of the committee for ad hoc committees assigned to a particular case */
  packet_id: number;
  /** Flag indicating if this is an individual committee */
  individual_committee: boolean;
  /** Flag indicating if this is a standing committee */
  standing: boolean;
  /** The committee members assigned to this committee */
  committee_members: CommitteeMember[];
  /** Committee members reqcuesd for the given packet */
  recused_committee_members: CommitteeMember[];
  /** Committee members temporarily added */
  temporary_committee_members: CommitteeMember[];
  /** Administrators of the committee */
  administrators: any[];
  /** Flag indicating if the current user can edit the committee and membership */
  can_edit_membership: boolean;
  /** Flag inidicating if the current user can recuse committee members */
  can_recuse: boolean;
};

/**
 * Data returned when searching for committees
 */
export type CommitteeListSummary = {
  /** ID of the committee */
  id: number;
  /** Name of the committee */
  name: string;
  /** Name of the unit to which this committee belongs */
  unit_name: string;
  /** Current number of committee members assigned to this committee */
  committee_member_count: number;
  /** flag inidicating if this committee has current assignments */
  in_use: boolean;
};

/**
 * Class representing an Interfolio Committee
 *
 */
export class CommitteeApi {
  /**
   * API request object for making the actual http requests
   */
  private readonly apiRequest: ApiRequest;

  public readonly CommitteeMembers: CommitteeMemberAPI;
  /**
   * Constructor for the object
   * @param apiConfig Configuration for API calls
   */
  constructor(apiConfig: ApiConfig) {
    this.apiRequest = new ApiRequest(apiConfig);
    this.CommitteeMembers = new CommitteeMemberAPI(apiConfig);
  }

  /**
   * Create a new standing committee
   * @param name  Name of the standing committee
   * @param unitId  Unit Id of the standing committee
   *
   * @example
   * ```javascript
   * let committee = await api.Tenure.Committees.createStandingCommittee({name: "Committee Name", unitId: 9999});
   * ```
   */
  public async createStandingCommittee({ name, unitId }: { name: string; unitId: number }): Promise<Committee> {
    return new Promise((resolve, reject) => {
      this.apiRequest
        .executeRest({
          url: STANDING_COMMITTEE_CREATE_URL,
          method: 'POST',
          form: { 'committee[unit_id]': unitId, 'committee[name]': name },
        })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Delete the committee
   * @param id ID of the Committee
   *
   * @example
   * ```javascript
   * await api.Tenure.Committees.delete({id: 9999});
   * ```
   */
  public async delete({ id }: { id: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = COMMITTEE_URL.replace('{committee_id}', id.toString());
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  /**
   * Find a committee belonging to a particular unit
   *
   * @param committeeName Name of the committee to search for
   * @param parentUnitId  ID of the parent in which to create the units
   *
   * @throws Throws error if no committee is found within the unit
   *
   * @example
   * ```javascript
   * let committee = await api.Tenure.Committees.findUnitCommittee({name: "Committee Name", unitId: 9999});
   * ```
   */
  public async findUnitStandingCommittee({
    unitId,
    committeeName,
  }: {
    committeeName: string;
    unitId: number;
  }): Promise<Committee> {
    return new Promise((resolve, reject) => {
      const url =
        STANDING_COMMITTEES_URL +
        '?unit_id=' +
        unitId.toString() +
        '&search_text=' +
        ApiRequest.rfc3986EncodeURIComponent(committeeName);
      this.apiRequest
        .executeRest({ url })
        .then(async (response) => {
          let committeeListing = null;
          for (const c of response.results) {
            if (c.name == committeeName) {
              committeeListing = c;
            }
          }
          if (!committeeListing) {
            reject('No committee with the name "' + committeeName + '" found in unit_id ' + unitId);
          } else {
            const committee = await this.getCommittee({ id: committeeListing.id });
            resolve(committee);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Get a committee from the committeeId
   * @param id ID of the committee
   *
   * @example
   * ```javascript
   * let committee = await api.Tenure.Committees.getCommittee({id: 9999});
   * ```
   */
  async getCommittee({ id }: { id: number }): Promise<Committee> {
    return new Promise((resolve, reject) => {
      const url = COMMITTEE_URL.replace('{committee_id}', id.toString());
      this.apiRequest
        .executeRest({ url, method: 'GET' })
        .then((response) => {
          resolve(CommitteeApi.removeCommitteeNesting(response.committee));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Remove the cumbersome second level for committee members
   * @param apiResponse  The response from the API to remove the nesting from
   */
  private static removeCommitteeNesting(apiResponse: ApiResponse): Committee {
    const denestDef: DeNestingDef = {
      committee_members: {
        type: 'DENEST_ARRAY',
        nestedAttributeName: 'committee_member',
      },
    };
    const committee: Committee = Utils.deNest(apiResponse, denestDef) as Committee;

    return committee;
  }
}

export default CommitteeApi;

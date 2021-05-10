import { ApiConfig } from '../../index';
import ApiRequest from '../../api-request';
import { COMMITTEE_URL } from '../committee-api';

export const COMMITTEE_MEMBER_BASE_URL = COMMITTEE_URL + '/committee_members';
export const COMMITTEE_MEMBER_URL = COMMITTEE_MEMBER_BASE_URL + '/{committee_member_id}';
/**
 * Data structure defining the member of a committee
 */
export type CommitteeMember = {
  /** ID for the committee membership */
  id: number;
  /** Flag indicating if the member is a manager of the committee */
  manager: boolean;
  /** First name of the committee member */
  first_name: string;
  /** Last name of the committee member */
  last_name: string;
  /** Email of the committee member */
  email: string;
  /** user_id of the committee member */
  user_id: number;
  /** Interfolio PID of the member */
  pid: number;
  /** The ID of the committee */
  committee_id: number;
  /** Flag indicating if this member is a temporary member of the committee */
  temporary: boolean;
  /** Flag indicating if the members is the current user */
  is_current_user?: boolean;
};

/**
 * Class representing an Interfolio Committee Memmber
 *
 */
export class CommitteeMemberApi {
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
   * Creates a new committee member
   *
   * @param committeeId ID of the committee
   * @param userId Id of the user
   * @param manager Flag indicating if the user is a committee manager (defaults to false)
   *
   * @example
   * ```javascript
   * let member = await api.Tenure.CommitteeMembers.create({committeeId: 9999, userId: 9999});
   * ```
   */
  public async create({
    committeeId,
    userId,
    manager = false,
  }: {
    committeeId: number;
    userId: number;
    manager?: boolean;
  }): Promise<CommitteeMember> {
    return new Promise((resolve, reject) => {
      const url = COMMITTEE_MEMBER_BASE_URL.replace('{committee_id}', committeeId.toString());
      this.apiRequest
        .executeRest({
          url,
          method: 'POST',
          form: { 'committee_member[user_id]': userId, 'committee_member[manager]': manager },
        })
        .then((response) => {
          resolve(response.committee_member);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Delete the committee member (remove from committee)
   * @param id ID of the committee membership (not the userId)
   * @param committeeId ID of the committee
   *
   * @example
   * ```javascript
   * await api.Committeess.CommitteeeMembers.delete({id: 9999, committeeId: 9999});
   * ```
   */

  public async delete({ id, committeeId }: { id: number; committeeId: number }): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = COMMITTEE_MEMBER_URL.replace('{committee_member_id}', id.toString()).replace(
        '{committee_id}',
        committeeId.toString(),
      );
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }
}

export default CommitteeMemberApi;

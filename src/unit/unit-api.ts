import { ApiConfig } from '../index';
import ApiRequest from '../api-request';
import { INTERFOLIO_CORE_URL_V1 } from '../api-request';

/**
 * @const {string} Base url to save units
 */
export const UNITS_URL = INTERFOLIO_CORE_URL_V1 + '/units';

/**
 * @type {Object}
 */
export type InterfolioUnit = {
  id: number;
  name: string;
  ancestor_institution_id: number;
  parent_unit_id: number;
  child_unit_ids: number[];
};

/**
 * Class representing the Interfolio Unit
 */
export class UnitApi {
  /**
   * the request object
   */
  private readonly apiRequest: ApiRequest;

  /**
   * Constructor for the object
   * @param apiConfig {ApiConfig}  The configuration for api calls
   */
  constructor(apiConfig: ApiConfig) {
    this.apiRequest = new ApiRequest(apiConfig);
  }

  /**
   * Create a new unit
   * @param unitName {string}  The Name of the unit
   * @param parentUnitId {number}  The ID of the parent in which to create the unit
   *
   * @return Promise<InterfolioUnit>
   */
  public async createUnit({
    unitName,
    parentUnitId,
  }: {
    unitName: string;
    parentUnitId: number;
  }): Promise<InterfolioUnit> {
    return new Promise((resolve, reject) => {
      this.apiRequest
        .executeRest({
          url: UNITS_URL,
          method: 'POST',
          form: { unit_id: parentUnitId, 'unit[name]': unitName },
        })
        .then((response) => {
          resolve(response.unit);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Delete a unit
   * @param unitId
   */
  public async deleteUnit(unitId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.apiRequest
        .executeRest({ url: UNITS_URL + '/' + unitId.toString(), method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  /**
   * Find a unit with the matching name (and parent unit if specified)
   * @param unitName {string}  The name of the unit to find
   * @param parentUnitId {number} The id of the parent unit to search in
   * @return Promise<InterfolioUnit | null>
   */
  public async findUnit({
    unitName,
    parentUnitId,
  }: {
    unitName: string;
    parentUnitId?: number;
  }): Promise<InterfolioUnit> {
    const units = await this.getUnits();
    for (const unit of units) {
      if (unit.name === unitName) {
        if (!parentUnitId) {
          return unit;
        } else {
          if (parentUnitId === unit.parent_unit_id) {
            return unit;
          }
        }
      }
    }
    //throw exception if no unit found
    let message = 'No unit with the name "' + unitName + '" found';
    if (parentUnitId) {
      message += ' with parent_unit_id ' + parentUnitId;
    }
    throw new Error(message);
  }

  /**
   * Get the units which the user has access to
   */
  public async getUnits(): Promise<Array<InterfolioUnit>> {
    return this.apiRequest.executeRest({ url: UNITS_URL + '/usage' }).then((response) => {
      const units: Array<InterfolioUnit> = [];
      for (const unit of response.user.administrator_units) {
        units.push(unit.administrator_unit);
      }
      return units;
    });
  }
}

export default UnitApi;

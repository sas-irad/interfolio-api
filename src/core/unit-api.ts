import { ApiConfig } from '../index';
import ApiRequest from '../api-request';
import { INTERFOLIO_CORE_URL_V1 } from '../api-request';

/**
 * @const {string} Base url to save units
 */
export const UNITS_URL = INTERFOLIO_CORE_URL_V1 + '/units';

/**
 * An Interfolio Unit definition
 */
export type Unit = {
  /** ID of the units */
  id: number;
  /** Name of the units */
  name: string;
  /** ID of the institution level units to which this units belongs */
  ancestor_institution_id: number;
  /** ID of the parent units */
  parent_unit_id: number;
  /** IDs of all child units */
  child_unit_ids: number[];
};

/**
 * Class representing the Interfolio Unit
 *
 * @example
 * ```javascript
 * let units = await api.Tenure.Units.getUnits();
 * ```
 */
export class UnitApi {
  /**
   * API request object for making the actual http requests
   */
  public readonly apiRequest: ApiRequest;

  public readonly module: 'tenure' | 'search';

  /**
   * Constructor for the object
   * @param config Configuration for API calls - of type either ApiConfig or ApiRequest
   *
   * note pass in ApiRequest to keep all errors in one object instance
   */
  constructor(config: ApiConfig | ApiRequest, module: 'tenure' | 'search' = 'search') {
    if (config.constructor && config.constructor.name === 'ApiRequest') {
      this.apiRequest = config as ApiRequest;
    } else {
      const apiConfig = config as ApiConfig;
      this.apiRequest = new ApiRequest(apiConfig);
    }
    this.module = module;
  }

  /**
   * Create a new Interfolio Unit
   *
   * @param unitName      Name of the units
   * @param parentUnitId  ID of the parent in which to create the units
   *
   * @example
   * ```javascript
   * let newUnit = await api.Core.Units.create({parentUnitId: 9999, unitName: "New Unit Name"});
   * ```
   */
  public async create({ unitName, parentUnitId }: { unitName: string; parentUnitId: number }): Promise<Unit> {
    return new Promise((resolve, reject) => {
      const url = UNITS_URL.replace('{module}', this.module);
      this.apiRequest
        .executeRest({
          url: url,
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
   * Delete a units
   * @param unitId The id of the units to delete
   *
   *
   * @example
   * ```javascript
   * await api.Core.Units.delete(9999);
   * ````
   */
  public async delete(unitId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = UNITS_URL.replace('{module}', this.module) + '/' + unitId.toString();
      this.apiRequest
        .executeRest({ url, method: 'DELETE' })
        .then(() => resolve(true))
        .catch((error) => reject(error));
    });
  }

  /**
   * Find a units with the matching name (and parent units if specified).
   * @param unitName      The name of the units to find
   * @param parentUnitId  The id of the parent units to search in
   *
   * @example
   * ```javascript
   * let units = await api.Core.Units.findUnit({unitName: "Biology"});
   * ```
   */
  public async findUnit({ unitName, parentUnitId }: { unitName: string; parentUnitId?: number }): Promise<Unit> {
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
    //throw exception if no units found
    let message = 'No units with the name "' + unitName + '" found';
    if (parentUnitId) {
      message += ' with parent_unit_id ' + parentUnitId;
    }
    throw new Error(message);
  }

  /**
   * Get the units which the user has access to.  Based upon administrative access
   *
   * @example
   * ```javascript
   * let units = await api.Core.Units.getUnits();
   * ```
   */
  public async getUnits(): Promise<Array<Unit>> {
    const url = UNITS_URL.replace('{module}', this.module) + '/usage';
    return this.apiRequest.executeRest({ url }).then((response) => {
      const units: Array<Unit> = [];
      for (const unit of response.user.administrator_units) {
        units.push(unit.administrator_unit);
      }
      return units;
    });
  }
}

export default UnitApi;

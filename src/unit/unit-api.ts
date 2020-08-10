import {ApiConfig} from "../index";
import ApiRequest from "../api-request";
import {INTERFOLIO_CORE_URL_V1} from "../api-request";

/**
 * @const {string} Base url to save units
 */
export const UNITS_URL = INTERFOLIO_CORE_URL_V1 + "/units/usage"


/**
 * @type {Object}
 */
export type InterfolioUnit = {
  id: number;
  name: string;
  ancestor_unit_id: number;
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
   * Find a unit with the matching name (and parent unit if specified)
   * @param unitName {string}  The name of the unit to find
   * @param parentUnitId {number} The id of the parent unit to search in
   * @return Promise<InterfolioUnit | null>
   */
  public async findUnit({unitName, parentUnitId}: {unitName: string, parentUnitId?: number}): Promise<InterfolioUnit> {
    let units = await this.getUnits();
    for(let unit of units) {
      if(unit.name === unitName) {
        if(!parentUnitId) {
          return unit;
        }
        else {
          if(parentUnitId === unit.parent_unit_id) {
            return unit;
          }
        }
      }
    }
    //throw exception if no unit found
    let message = "No unit with the name \"" + unitName + "\" found";
    if(parentUnitId) {
      message += " with parent_unit_id " + parentUnitId;
    }
    throw new Error(message);
  }

  /**
   * Get the units which the user has access to
   */
  public async getUnits(): Promise<Array<InterfolioUnit>> {
    return this.apiRequest.executeRest({url: UNITS_URL})
      .then((response)  =>  {
          let units: Array<InterfolioUnit> = [];
          for(let unit of response.user.administrator_units) {
            units.push(unit.administrator_unit);
          }
          return units;
        }
      );
  }
}

export default UnitApi;

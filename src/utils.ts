import { ApiResponse } from './api-request';

/**
 * The definition for de nesting a response retrieved from interfolio
 */
export type DeNestingDef = {
  [key: string]: {
    type: 'DENEST_ARRAY' | 'DENEST_CHILD_OBJECT';
    nestedAttributeName: string;
    nestedDefs?: DeNestingDef;
  };
};

/**
 * Function which takes an object returned from the API and removes unnecessary nesting according the the deNesting definition
 *
 * @param data Data (or subdata) returned from an API
 * @param deNestingDefs Defines which parameters (or subparameters) need to be denested
 *
 */

export const deNest = function (data: ApiResponse, deNestingDefs: DeNestingDef): ApiResponse {
  const deNested: ApiResponse = {};
  for (const key in data) {
    //if no nesting is defined just copy over the value
    if (!Object.prototype.hasOwnProperty.call(deNestingDefs, key)) {
      deNested[key] = data[key];
    } else {
      //get the denesting def
      const deNestingDef = deNestingDefs[key];

      //Handle removing the extra object layer in arrays of data
      if (deNestingDef.type === 'DENEST_ARRAY') {
        const origArray: ApiResponse[] = data[key] as ApiResponse[];
        const newArray: ApiResponse[] = [];

        //loop through the array members
        for (const obj of origArray) {
          //remove the unnecessary layer
          const deNested = obj[deNestingDef.nestedAttributeName] as ApiResponse;

          //if we need to go deeper into the structure do that
          if (deNestingDef.nestedDefs) {
            newArray.push(deNest(deNested, deNestingDef.nestedDefs));
          }
          //otherwise we are done
          else {
            newArray.push(deNested);
          }
        }
        deNested[key] = newArray;
      }

      //descend down one level to denest a child object
      else if (deNestingDef.type === 'DENEST_CHILD_OBJECT' && deNestingDef.nestedDefs) {
        const value: ApiResponse = data[key] as ApiResponse;
        deNested[key] = deNest(value, deNestingDef.nestedDefs);
      } else {
        deNested[key] = data[key];
      }
    }
  }
  return deNested;
};

/**
 * uandle to the functions defined by the utils
 */
export const Utils = {
  deNest: deNest,
};

export default Utils;

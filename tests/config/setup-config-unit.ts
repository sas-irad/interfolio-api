import prompts from "prompts";
import {TestConfig} from "./setup-config";
import API from "../../src"

/**
 * Prompts user for api user credentials and main api urls
 * @param config {TestConfig}
 */
const setupConfigUnit = async (config: TestConfig): Promise<TestConfig> => {

  //prompt to overwrite
  if(config.unit) {
    const update = await prompts({
      type: "select",
      name: "update",
      message: "The test unit unit information exists (" + config.unit.name + ")  Would you like to overwrite?",
      choices: [
        {title: 'No', value: false},
        {title: 'Yes', value: true}
      ]
    });

    if (!update.update) {
      return config;
    }
  }



  if(config.apiConfig === undefined) throw Error("To run Unit test setup the apiConfig (keys & urls) must first be defined");

  //go get the current units from the database
  const api = new API(config.apiConfig);
  const units = await api.Unit.getUnits();

  //create the unitLookup and unitMap from units
  const unitLookup: {title: string, value: number}[] = [];
  const unitMap: any = {};
  for(const i in units) {
    unitMap[units[i].id] = i;
    unitLookup.push({title: units[i].name, value: units[i].id});
  }
  //add the parent to the title if parent exists
  for(const i in units) {
    if(units[i].parent_unit_id && unitMap[units[i].id] !== undefined) {
      unitLookup[i].title += " (" + units[unitMap[units[i].parent_unit_id]].name + ")";
    }
  }

  //if the config is already defined, default to the current values
  let defaultParentName = "";
  let defaultUnitName = "Test Unit for API"
  if(config.unit) {
    defaultParentName = unitLookup[unitMap[config.unit.parent_unit_id]].title;
    defaultUnitName = config.unit.name;
  };

  //get the responses
  const responses =  await prompts([
    {
      type: 'autocomplete',
      name: 'parentUnitId',
      message: 'Pick the parent unit for the Test API Unit',
      choices: unitLookup,
      initial: defaultParentName,
    },
    {
      type: "text",
      name: "unitName",
      message: "Choose the name for the test unit",
      initial: defaultUnitName
    }
  ]);

  //look to see if the test unit already exists
  const parentUnit = units[unitMap[responses.parentUnitId]];
  for(const childUnitId of parentUnit.child_unit_ids) {
    const childUnit = units[unitMap[childUnitId]];
    if(childUnit.name === responses.unitName) {
      config.unit = childUnit;
      return config;
    }
  }

  //unit must not exist so create it
  const unit = await api.Unit.createUnit(responses)
  const subUnit1 = await api.Unit.createUnit({unitName: "Test SubUnit 1 for API", parentUnitId: unit.id});
  const subUnit2 = await api.Unit.createUnit({unitName: "Test Subunit 2 for API", parentUnitId: unit.id});

  config.unit = {
    id: unit.id,
    name: unit.name,
    parent_unit_id: unit.parent_unit_id,
    ancestor_institution_id: config.apiConfig.tenantId,
    child_unit_ids: [subUnit1.id, subUnit2.id]
  };
  console.log("creating unit id");



  return config;
};

export { setupConfigUnit };
export default setupConfigUnit ;

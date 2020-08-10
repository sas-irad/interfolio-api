import UnitApi from '../../src/unit/unit-api';
import { expect } from 'chai';
import Config from '../config/test-config.json';

/**
 * Test for UnitApi
 */
describe('Unit API Test', () => {
  const unitApi = new UnitApi(Config.apiConfig);

  //Test creation
  it('Create Unit Api', async() => {
    expect(typeof unitApi).to.equal('object', 'API created with type of object');
  });

  //Test getting all units
  it('Get Units', async () => {
    let units = await unitApi.getUnits();
    expect(units.length).to.be.greaterThan(0, "Number of units returned is greater than 0");
    expect(units[0].id).to.be.greaterThan(0, "First unit returned has non-zero id");
  });

  //Test finding api unit
  it('Find Unit', async () => {
    let unit = await unitApi.findUnit({unitName: Config.unit.name});
    expect(unit.id).to.equal(Config.unit.id, "Unit ID matches");
    expect(unit.name).to.equal(Config.unit.name, "Unit name matches");
  });

});

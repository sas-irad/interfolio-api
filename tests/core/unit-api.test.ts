import UnitApi from '../../src/core/unit-api';
import { expect } from 'chai';
import Config from '../config/test-config.json';

/**
 * Test for UnitApi
 */
describe('Unit API Test', () => {
  const unitApi = new UnitApi(Config.apiConfig, "search");

  //Test creation
  it('Create Unit Api', async () => {
    expect(typeof unitApi).to.equal('object', 'API created with type of object');
  });

  it('Create - Delete Unit', async () => {
    const unitName = 'Create Unit Test';
    const createdUnit = await unitApi.create({ unitName, parentUnitId: Config.unit.id });
    expect(createdUnit.name).to.equal(unitName, 'Created Unit name matches');

    //delete the units
    const deleteSuccess = await unitApi.delete(createdUnit.id);
    expect(deleteSuccess).to.equal(true, 'Expect the delete call to return a true value');
  });

  //Test getting all units
  it('Get Units', async () => {
    const units = await unitApi.getUnits();
    expect(units.length).to.be.greaterThan(0, 'Number of units returned is greater than 0');
    expect(units[0].id).to.be.greaterThan(0, 'First units returned has non-zero id');
  });

  //Test finding api units
  it('Find Unit', async () => {
    const unit = await unitApi.findUnit({ unitName: Config.unit.name });
    expect(unit.id).to.equal(Config.unit.id, 'Unit ID matches');
    expect(unit.name).to.equal(Config.unit.name, 'Unit name matches');
  });
});

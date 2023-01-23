import { expect } from 'chai';
import Config from '../config/test-config.json';
import PositionApi from "../../src/search/position-api";

/**
 * Test for PositionAPI
 */
describe('Position API Test', () => {
  const api = new PositionApi(Config.apiConfig);

  //Test creation
  it('Create Position Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });


  it('Get Position', async () => {
    const record = await api.getPosition({ id: Config.position.id });
    expect(record.name).to.eq(Config.position.name, 'position name matches');
  });

  it('Create/Delete Position', async () => {
    const positionInsert = {
      name: "Position for create/delete API test",
      unit_id: Config.unit.id,
      //@todo setup config for positionType instead of hardcoding
      position_type_id: 396
    }
    //Insert the position
    // api.apiRequest.outputRequestOptions = true;
    const record = await api.create(positionInsert);
    expect(record.name).to.eq(positionInsert.name, 'Position name matches');

    //Delete the recently created position
    // api.apiRequest.outputResponse = true;
    const deleteSuccess = await api.delete({ id: record.id });
    expect(deleteSuccess).to.equal(true, 'Expect the delete call to return a true value');
  });


  it('Filter Positions', async () => {
    const records = await api.filterPositions({ search_term: Config.position.name});
    expect(records.total_count).to.greaterThan(0, 'at least one position returned');
    //look for our record
    let found = false;
    for(const  position of records.results) {
      if(position.id === Config.position.id) {
        found = true;
      }
    }
    expect(found).to.eq(true, "Position found in filtered positions");
  });

});

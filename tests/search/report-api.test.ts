import { expect } from 'chai';
import Config from '../config/test-config.json';
import ReportApi from '../../src/search/report-api';

/**
 * Test for Report API
 */
describe('Search Report API Test', () => {
  const api = new ReportApi(Config.apiConfig);

  //Test creation
  it('Create Report Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  //Test the application search
  it('ApplicationSearch', async () => {
    const search = await api.applicationSearch({
      facets: {
        position_id: Config.position.id,
      },
    });
    expect(search.total).gt(0, 'Packet Search Returned at least one result');

    //loop through the results to make sure we found our packet
    let found = false;
    for (const row of search.applications) {
      if (row.id === Config.application.id) found = true;
    }
    expect(found).eq(true, 'Test packet found by search');
  });
});

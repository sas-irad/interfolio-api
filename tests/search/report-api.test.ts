import { expect } from 'chai';
import Config from '../config/test-config.json';
import ReportApi from '../../src/search/report-api';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

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
    //this needed since the application-document-api test was causing the record to not be returned if run immediately after
    await sleep(3000);
    const search = await api.applicationSearch({
      facets: {
        position_id: Config.position.id,
      },
    });
    expect(search.total).gt(0, 'Application Search Returned at least one result');

    //loop through the results to make sure we found our packet
    let found = false;
    for (const row of search.applications) {
      if (row.id === Config.application.id) found = true;
    }
    expect(found).eq(true, 'Test Application found by search');
  });
});

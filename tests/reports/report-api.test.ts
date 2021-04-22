import { expect } from 'chai';
import Config from '../config/test-config.json';
import ReportApi from '../../src/reports/report-api';

/**
 * Test for Report API
 */
describe('Report API Test', () => {
  const api = new ReportApi(Config.apiConfig);

  //Test creation
  it('Create Report Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  //Test the packet search
  it('Report Packet Search', async () => {
    const search = await api.packetSearch({
      from: 0,
      size: 100,
      search_text: Config.packet.candidate_first_name + ' ' + Config.packet.candidate_last_name,
      facets: {
        unit_names: [Config.unit.name],
      },
    });
    expect(search.total).gt(0, 'Packet Search Returned at least one result');

    //loop through the results to make sure we found our packet
    let found = false;
    for (const row of search.data) {
      if (row.id === Config.packet.id) found = true;
    }
    expect(found).eq(true, 'Test packet found by search');
  });
});

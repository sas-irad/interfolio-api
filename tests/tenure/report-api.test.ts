import { expect } from 'chai';
import Config from '../config/test-config.json';
import ReportApi from '../../src/tenure/report-api';

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
    const search = await api.packetReport({
      from: 0,
      size: 100,
      search_text: Config.packet.candidate_first_name,
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

  /**
   * Note - this is skipped since in sandbox environment often fails
   */
  it.skip('Report Packet Forms', async () => {
    const forms = await api.formReport({
      form_id: Config.form.id,
      form_type: 'committee_form',
      packet_ids: [Config.packet.id],
      limit: 100,
      page: 1,
    });
    expect(forms.form_name).eq(
      Config.form.title,
      'Form Title Matches (note: recently created forms may take up to 4 hours to be returned by API)',
    );
    expect(forms.results[0].packet_id).eq(Config.packet.id.toString(), 'Packet ID for form matches');

    //loop through field responses and check that they match
    for (const [field, value] of Object.entries(Config.formResponse.responseData)) {
      //table cell 6 is question 1
      if (field.indexOf('question_1') > -1) expect(forms.results[0].table_cells[6]).eq(value, 'Question 1 matches');

      //table cell 7 is question 2 - since it is a select we have to encode it to make sure they match
      if (field.indexOf('question_2') > -1) {
        const encodedValue = forms.results[0].table_cells[7].toLowerCase().replace(/ /g, '_');
        expect(encodedValue).eq(value, 'Question 2 matches');
      }
    }
  });

  /**
   * Test retrieving the info from the packet
   */
  it('Report Form Index', async () => {
    const packets = await api.formReportIndex({
      formId: Config.form.id,
      formType: 'committee_form',
      unitIds: [Config.unit.id],
    });
    let found = false;
    for (const packet of packets) {
      if (packet.id === Config.packet.id) {
        found = true;
        break;
      }
    }
    expect(found).eq(true, 'Packet index found in report form index');
  });
});

import { expect } from 'chai';
import Config from '../../config/test-config.json';
import EvaluatorSectionApi from '../../../src/tenure/packets/evaluator-section-api';

/**
 * Test for Packet Platform Form API
 */
describe('Evaluator Section API Test', () => {
  const api = new EvaluatorSectionApi(Config.apiConfig);

  //Test api initialization
  it('Create EvaluatorSection Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Find Section by Name', async () => {
    //find the section
    const section = EvaluatorSectionApi.findPacketSectionFromName({
      packetDetail: Config.packet,
      sectionName: Config.packet.packet_sections[0].name,
    });
    expect(section).not.equal(null, 'Section search returns non null value');
    if (section !== null) {
      expect(section.id).eq(Config.packet.packet_sections[0].id, 'Section id matches');
      expect(section.name).eq(Config.packet.packet_sections[0].name, 'Section name matches');
    }
  });

  it('Find Section by Name - does not exits', async () => {
    //find the section
    const section = EvaluatorSectionApi.findPacketSectionFromName({
      packetDetail: Config.packet,
      sectionName: 'bad name',
    });
    expect(section).equal(null, 'Section search returns null for bad name');
  });
});

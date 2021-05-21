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

  it('Update Section', async () => {
    const updated = await api.updateSection({
      packetId: Config.packet.id,
      sectionId: Config.packet.packet_sections[1].id,
      name: 'New Section Name',
      description: 'New Section Description',
    });
    expect(updated).eq(true, 'Section updated');

    //switch back
    await api.updateSection({
      packetId: Config.packet.id,
      sectionId: Config.packet.packet_sections[1].id,
      name: Config.packet.packet_sections[1].name,
      description: Config.packet.packet_sections[1].description || '',
    });
  });
});

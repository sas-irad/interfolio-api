import { expect } from 'chai';
import Config from '../../config/test-config.json';
import PacketAttachmentApi from '../../../src/tenure/packets/packet-attachment-api';

/**
 * Test for Packet Attachment API
 */
describe('Packet Attachment API Test', () => {
  const api = new PacketAttachmentApi(Config.apiConfig);

  //Test api initialization
  it('Create Packet Attachment Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Add / Delete  Packet Attachment', async () => {
    const doc = await api.addDocument({
      packetId: Config.packet.id,
      displayName: 'Test Document',
      sectionId: Config.packet.packet_sections[1].id,
      file: Buffer.from('Test Requirement Document Contents'),
      fileName: 'text.txt',
    });

    expect(doc.id).greaterThan(0, 'Attachment Id created and is greater than 0');

    const deleted = await api.delete({ packetId: Config.packet.id, packetAttachmentId: doc.id });
    expect(deleted).eq(true, 'Document Delete Returns True');
  });
});

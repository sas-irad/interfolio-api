import PacketTemplateApi from '../../src/packet-templates/packet-template-api';
import { expect } from 'chai';
import Config from '../config/test-config.json';

/**
 * Test for PacketTemplate API
 */
describe('Packet Template API Test', () => {
  const api = new PacketTemplateApi(Config.apiConfig);

  //Test creation
  it('Create Packet Template Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Create/Delete Template', async () => {
    const name = 'Test Template for API';
    const description = 'Description for the test template';
    const template = await api.create({
      unitId: Config.unit.id,
      name: name,
      description: description,
      packetTypeId: Config.packetType.id,
    });
    expect(template.name).to.eq(name, 'Name of created template matches');
    expect(template.description).to.eq(description, 'Description of created template matches');

    const deleteSuccess = await api.delete({ id: template.id });
    expect(deleteSuccess).to.eq(true, 'Successfully Deleted');
  });

  it('Get Template', async () => {
    const template = await api.getTemplate({ id: Config.packetTemplate.id });
    expect(template.name).to.eq(Config.packetTemplate.name);
    expect(template.description).to.eq(Config.packetTemplate.description);
    expect(template.unit_id).to.eq(Config.packetTemplate.unit_id);
  });
});

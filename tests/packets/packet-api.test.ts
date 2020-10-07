import { expect } from 'chai';
import Config from '../config/test-config.json';
import PacketApi from '../../src/packets/packet-api';

/**
 * Test for Packet API
 */
describe('Packet API Test', () => {
  const api = new PacketApi(Config.apiConfig);

  //Test creation
  it('Create Packet Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Create/Delete Packet', async () => {
    const packetDetail = await api.create({
      unitId: Config.unit.id,
      candidateLastName: Config.user.last_name,
      candidateFirstName: Config.user.first_name,
      candidateEmail: Config.user.email,
      candidateInvolvement: false,
      packetTypeId: Config.packetType.id,
    });

    expect(packetDetail.candidate_first_name).to.equal(
      Config.user.first_name,
      'Packet Template Candidate first name matches',
    );
    expect(packetDetail.candidate_last_name).to.equal(
      Config.user.last_name,
      'Packet Template Candidate last name matches',
    );
    expect(packetDetail.candidate_email).to.equal(Config.user.email, 'Packet Template Candidate email matches');

    //delete the packet
    const success = await api.delete({ id: packetDetail.id });
    expect(success).to.equal(true, 'Successfully deleted case/packet');
  });

  it('Create Packet From Template', async () => {
    const packetDetail = await api.createFromTemplate({
      packetId: Config.packetTemplate.id,
      candidateFirstName: Config.user.first_name,
      candidateLastName: Config.user.last_name,
      candidateEmail: Config.user.email,
      candidateInvolvement: false,
      unitId: Config.unit.id,
    });

    expect(packetDetail.candidate_first_name).to.equal(
      Config.user.first_name,
      'Packet Template Candidate name matches',
    );
    expect(packetDetail.candidate_last_name).to.equal(Config.user.last_name, 'Packet Template Candidate name matches');

    //delete the packet
    await api.delete({ id: packetDetail.id });
  });

  it('Get Packet', async () => {
    const packetDetail = await api.getPacket({ id: Config.packet.id });
    expect(packetDetail.candidate_first_name).to.eq(Config.user.first_name);
    expect(packetDetail.candidate_last_name).to.eq(Config.user.last_name);
    expect(packetDetail.unit_name).to.eq(Config.unit.name);
  });
});

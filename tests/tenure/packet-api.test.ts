import { expect } from 'chai';
import Config from '../config/test-config.json';
import PacketApi from '../../src/tenure/packet-api';

/**
 * Test for Packet API
 */
describe('Packet API Test', () => {
  const api = new PacketApi(Config.apiConfig);

  //Test creation
  it('Create Packet Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Archive Packet', async () => {
    const packetDetail = await api.create({
      unitId: Config.unit.id,
      candidateLastName: Config.user.last_name,
      candidateFirstName: Config.user.first_name,
      candidatePID: parseInt(Config.user.pid),
      candidateEmail: Config.user.email,
      candidateInvolvement: false,
      packetTypeId: Config.packetType.id,
    });
    expect(packetDetail.candidate_first_name).to.equal(
      Config.user.first_name,
      'Packet Template Candidate first name matches',
    );

    const archived = await api.archive({ packetId: packetDetail.id, statusId: Config.status.id });
    expect(archived).eq(true, 'Packet Archived');

    await api.delete({ id: packetDetail.id });
  });

  it('Create/Delete Packet', async () => {
    const packetDetail = await api.create({
      unitId: Config.unit.id,
      candidatePID: parseInt(Config.user.pid),
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
      candidatePID: parseInt(Config.user.pid),
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
    expect(packetDetail.packet_sections[0].name).to.eq(
      Config.packet.packet_sections[0].name,
      'First Packet Section name matches',
    );
  });

  /**
   * Send the case forward and backward
   */
  it('Send forward/backward', async () => {
    const packetDetail = await api.moveForward({ id: Config.packet.id, sendNotification: false });
    expect(packetDetail.current_workflow_step.step_number).to.eq(2, 'Step number moved to step 2');
    const packetDetail2 = await api.moveBackward({ id: Config.packet.id, sendNotification: false });
    expect(packetDetail2.current_workflow_step.step_number).to.eq(1, 'Step number moved to step 1');
  });
});

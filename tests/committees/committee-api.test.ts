import CommitteeApi from '../../src/committees/committee-api';
import { expect } from 'chai';
import Config from '../config/test-config.json';

/**
 * Test for CommitteeAPI
 */
describe('Committee API Test', () => {
  const api = new CommitteeApi(Config.apiConfig);

  //Test creation
  it('Create Committee Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Create - Delete Standing Committee', async () => {
    const name = 'Create Committee Test';
    const created = await api.createStandingCommittee({ name: name, unitId: Config.unit.id });
    expect(created.name).to.equal(name, 'Created committee name matches');

    //delete the committee
    const deleteSuccess = await api.delete({ id: created.id });
    expect(deleteSuccess).to.equal(true, 'Expect the delete call to return a true value');
  });

  //Test getting committee
  it('Get Committee', async () => {
    const record = await api.getCommittee({ id: Config.committee.id });
    expect(record.name).to.eq(Config.committee.name, 'Committee name matches');
    expect(record.unit_id).to.eq(Config.committee.unit_id, 'Committee unit id matches');
    expect(record.committee_members[0].user_id).to.eq(Config.currentUser.id, 'Committee Member user id matches');
  });

  it('Find Unit Standing Committee', async () => {
    const record = await api.findUnitStandingCommittee({
      unitId: Config.committee.unit_id,
      committeeName: Config.committee.name,
    });
    expect(record.name).to.eq(Config.committee.name, 'Committee name matches');
    expect(record.unit_id).to.eq(Config.committee.unit_id, 'Committee unit id matches');
    expect(record.committee_members[0].user_id).to.eq(Config.currentUser.id, 'Committee Member user id matches');

    //catch error for negative case
    const badName = 'bad committee name';
    try {
      await api.findUnitStandingCommittee({ unitId: Config.committee.unit_id, committeeName: badName });
      expect(true).to.eq(false, 'Exception should have been thrown');
    } catch (e) {
      expect(e).to.eq(
        'No committee with the name "' + badName + '" found in unit_id ' + Config.committee.unit_id.toString(),
      );
    }
  });
});

import CommitteeMemberApi from '../../../src/tenure/committees/committee-member-api';
import CommitteeApi, { Committee } from '../../../src/tenure/committee-api';
import { expect } from 'chai';
import Config from '../../config/test-config.json';

/**
 * Test for CommitteeMemberAPI

 */
describe('Committee Member API Test', () => {
  const api = new CommitteeMemberApi(Config.apiConfig);

  //temp committee that gets created with test
  let tempCommittee: Committee;

  //create a temporary committee to add the person to
  before(async () => {
    const committeeApi = new CommitteeApi(Config.apiConfig);
    tempCommittee = await committeeApi.createStandingCommittee({ name: 'Test Committee 2', unitId: Config.unit.id });
  });

  //Test creation
  it('Create Committee Member Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  it('Add and Remove a committee member', async () => {
    const created = await api.create({ userId: Config.user.id, committeeId: tempCommittee.id, manager: true });
    expect(created.first_name).to.equal(Config.user.first_name, 'Created committee member name matches');

    // //delete the committee member
    const deleteSuccess = await api.delete({ id: created.id, committeeId: created.committee_id });
    expect(deleteSuccess).to.equal(true, 'Expect the delete call to return a true value');
  });

  //clean up
  after(async () => {
    const committeeApi = new CommitteeApi(Config.apiConfig);
    committeeApi.delete({ id: tempCommittee.id });
  });
});

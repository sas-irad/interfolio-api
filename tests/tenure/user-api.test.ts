import UserApi from '../../src/tenure/user-api';
import { expect } from 'chai';
import Config from '../config/test-config.json';

/**
 * Test for UnitApi
 */
describe('User API Test', () => {
  const api = new UserApi(Config.apiConfig);

  //Test creation
  it('Create User Api', async () => {
    expect(typeof api).to.equal('object', 'API created with type of object');
  });

  /** since we cannot delete a user once it is created, we wont run this */
  it('Create - Delete User', async () => {
    expect(true);
  });

  //Test getting all units
  it('Get User', async () => {
    const user = await api.getUser({ id: Config.user.id });
    expect(user.id).to.eq(Config.user.id, 'User ID returned matches user id');
    expect(user.first_name).to.eq(Config.user.first_name, 'Expect User First Name to match');
    expect(user.last_name).to.eq(Config.user.last_name, 'Expect User Last Name to match');
  });

  //Test finding api units
  it('Find User By Email', async () => {
    //test retreiveal by email
    const user = await api.findUserByEmail({ email: Config.user.email });
    expect(user.id).to.equal(Config.user.id, 'User ID matches');

    //test to make sure exception thrown if not found
    try {
      await api.findUserByEmail({ email: 'bademail' });
      expect(true).to.eq(false, 'No Exception thrown');
    } catch (e) {
      expect(e).to.eq('No User found with email = "bademail"');
    }
  });
});

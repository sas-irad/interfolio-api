import prompts from 'prompts';
import { TestConfig } from '../setup-config';
import API from '../../../src';
import { CommitteeMember } from '../../../src/tenure/committees/committee-member-api';

/**
 * prompts user to set up a committee member for testing
 * @param config {TestConfig}
 */
const setupConfigCommitteeMember = async (config: TestConfig): Promise<TestConfig> => {
  //prompt to overwrite
  if (config.committeeMember) {
    const update = await prompts({
      type: 'select',
      name: 'update',
      message:
        'The test committee member information exists (' +
        config.committeeMember.first_name +
        ')  Would you like to overwrite?',
      choices: [
        { title: 'No', value: false },
        { title: 'Yes', value: true },
      ],
    });

    if (!update.update) {
      return config;
    }
  }

  if (config.apiConfig === undefined)
    throw Error('To run committee test setup the apiConfig (keys & urls) must first be defined');
  if (config.unit === undefined)
    throw Error('To run committee test setup the unit test config must already be defined');
  if (config.currentUser === undefined)
    throw Error('To run committee test setup the user test config must already be defined');
  if (config.committee === undefined)
    throw Error('To run committee member test setup the committee test config must already be defined');
  if (config.committee2 === undefined)
    throw Error('To run committee member test setup the committee2 test config must already be defined');

  //go get the current units from the database
  const api = new API(config.apiConfig);

  //look to see if the test committee already exists
  let committeeMember: CommitteeMember | null = null;
  if (config.committee.committee_members.length > 0) {
    for (const cm of config.committee.committee_members) {
      if (cm.user_id === config.currentUser.id) {
        committeeMember = cm;
      }
    }
  }
  //if we haven't yet found a committee member then create one
  if (committeeMember === null) {
    try {
      const member = await api.Tenure.CommitteeMembers.create({
        committeeId: config.committee.id,
        userId: config.currentUser.id,
        manager: true,
      });
      config.committeeMember = member;
      //add it the to the committee list
      config.committee.committee_members.push(member);
    } catch (e) {
      console.log(e);
      throw e;
    }
  } else {
    config.committeeMember = committeeMember;
  }

    //look to see if the test committee already exists
  let committeeMember2: CommitteeMember | null = null;
  if (config.committee2.committee_members.length > 0) {
    for (const cm of config.committee2.committee_members) {
      if (cm.user_id === config.currentUser.id) {
        committeeMember = cm;
      }
    }
  }

  //if we haven't yet found a committee member2 then create one
   if (committeeMember2 === null) {
    try {
      const member = await api.Tenure.CommitteeMembers.create({
        committeeId: config.committee2.id,
        userId: config.currentUser.id,
        manager: true,
      });
      //add it the to the committee list
      config.committee2.committee_members.push(member);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
  return config;
};
export { setupConfigCommitteeMember };
export default setupConfigCommitteeMember;

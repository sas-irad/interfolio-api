import prompts = require('prompts');
import fs = require('fs');
import setupConfigApi from './setup-config-api';
import { ApiConfig } from '../../src';
import { Unit } from '../../src/tenure/unit-api';
import setupConfigUnit from './setup-config-unit';
import { Committee } from '../../src/tenure/committee-api';
import setupConfigCommittee from './setup-config-committee';
import { User } from '../../src/tenure/user-api';
import setupConfigUser from './setup-config-user';
import { CommitteeMember } from '../../src/tenure/committees/committee-member-api';
import setupConfigCommitteeMember from './setup-config-committee-member';
import { PacketType } from '../../src/tenure/packet-type-api';
import setupConfigPacketType from './setup-config-packet-type';
import setupConfigPacketTemplate from './setup-config-packet-template';
import { PacketDetail } from '../../src/tenure/packet-api';
import setupConfigPacket from './setup-config-packet';
import { PacketTemplateDetail } from '../../src/tenure/packet-template-api';
import setupConfigForm from './setup-config-form';
import { Form } from '../../src/tenure/form-api';
import setupConfigPacketForm from './setup-config-packet-form';
import { PlatformFormSubmissionResponse } from '../../src/tenure/packets/platform-form-api';
import { CommitteeRequirements } from '../../src/tenure/packets/workflow-steps/workflow-step-committee-api';
import { Status } from '../../src/tenure/status-api';
import setupConfigStatus from './setup-config-status';

export type TestConfig = {
  apiConfig?: ApiConfig;
  unit?: Unit;
  user?: User;
  currentUser?: User;
  committee?: Committee;
  committee2?: Committee;
  committeeMember?: CommitteeMember;
  packetType?: PacketType;
  packetTemplate?: PacketTemplateDetail;
  packet?: PacketDetail;
  packetForm?: any;
  form?: Form;
  formResponse?: PlatformFormSubmissionResponse;
  committeeRequirements?: CommitteeRequirements;
  status?: Status;
};

export const createConfig = async (): Promise<{ filename: string; config: TestConfig } | null> => {
  const fileResponse = await prompts.prompt({
    type: 'text',
    name: 'filename',
    initial: __dirname.replace('lib-tests/tests', 'tests') + '/test-config.json',
    message: 'Config filename',
  });

  const filename: string = fileResponse.filename;

  try {
    const file = await fs.readFileSync(filename);
    const config = JSON.parse(file.toString());
    const overwrite = await prompts.prompt({
      type: 'select',
      name: 'overwrite',
      message: 'File already exists.  Would you like to update?',
      choices: [
        { title: 'Yes', value: true },
        { title: 'No/Cancel', value: false },
      ],
    });

    if (overwrite.overwrite) {
      return {
        filename,
        config,
      };
    } else {
      return null;
    }
  } catch (error) {
    const createNew = await prompts.prompt({
      type: 'select',
      name: 'createNew',
      message: 'File does not exist or is unparseable.  Would you like to overwrite/create new?',
      choices: [
        { title: 'Yes', value: true },
        { title: 'Cancel', value: false },
      ],
    });

    if (createNew.createNew) {
      return {
        filename,
        config: {},
      };
    } else {
      return null;
    }
  }
};

export const run = async (): Promise<void> => {
  try {
    //get the file and the config
    const fileAndConfig = await createConfig();
    if (fileAndConfig === null) return;

    const config = fileAndConfig.config;

    //setup connection
    await setupConfigApi(config);
    await setupConfigUnit(config);
    await setupConfigUser(config);
    await setupConfigCommittee(config);
    await setupConfigCommitteeMember(config);
    await setupConfigForm(config);
    await setupConfigPacketType(config);
    await setupConfigStatus(config);
    await setupConfigPacketTemplate(config);
    await setupConfigPacket(config);
    await setupConfigPacketForm(config);

    fs.writeFileSync(fileAndConfig.filename, JSON.stringify(config, null, '  '));
    console.log('Config File Saved');
  } catch (error) {
    console.log('There was an error');
    console.log(error);
  }
};

run();

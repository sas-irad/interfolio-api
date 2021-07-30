/**
 * Script to be run from the command line that executes an API function
 *
 * Uses prompts to prompt user for api call parameters if not supplied by command line arguments
 */
import prompts = require('prompts');
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import API, { ApiConfig } from '../index';
import { INTERFOLIO_GRAPHQL_URLS, INTERFOLIO_REST_URLS } from '../api-request';
import fs from 'fs';

//Run the command and retrieve arguments if supplied
interface Arguments {
  [x: string]: unknown;
  module: string;
  subApi?: string;
  function?: string;
  parameters?: string;
}

const argv: Arguments = yargs(hideBin(process.argv))
  .command(
    'exec',
    'execute an Interfolio API call',
    (yargs) => {
      return yargs;
    },
    (argv) => {
      if (argv.verbose) console.info(`here is the  :${argv.port}`);
      console.log(argv);
    },
  )
  .option('testConfigFile', {
    alias: 'c',
    description: 'The filename/path of the config file used for testing',
    type: 'string',
  })
  .option('restUrl', {
    alias: 'r',
    description: 'The rest-api url base (no trailing slash)',
    choices: [INTERFOLIO_REST_URLS.PRODUCTION, INTERFOLIO_REST_URLS.SANDBOX, INTERFOLIO_REST_URLS.BETA],
  })
  .option('graphQlUrl', {
    alias: 'g',
    description: 'The graphQL url base',
    choices: [INTERFOLIO_GRAPHQL_URLS.PRODUCTION, INTERFOLIO_GRAPHQL_URLS.SANDBOX, INTERFOLIO_GRAPHQL_URLS.BETA],
  })
  .option('tenantId', {
    alias: 't',
    description: 'Interfolio Tenant Id',
    type: 'number',
  })
  .option('privateKey', {
    alias: 'x',
    description: 'Interfolio Tenant Id',
    type: 'string',
  })
  .option('publicKey', {
    alias: 'k',
    description: 'Interfolio Tenant Id',
    type: 'string',
  })
  .option('module', {
    alias: 'm',
    description: 'The Interfolio Module for the call (e.g. Tenure/Search)',
    choices: ['Tenure'],
  })
  .option('subApi', {
    alias: 's',
    description: 'The specific sub api to call within the module',
    type: 'string',
  })
  .option('function', {
    alias: 'f',
    description: 'The function to call',
    type: 'string',
  })
  .option('parameters', {
    alias: 'p',
    description: 'The parameters to pass to the api function as a json string',
    type: 'string',
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
  }).argv as Arguments;

//Use prompts to gather additional information
(async () => {
  try {
    //use the test config file if it exists to set connection information
    let testConfigFilename = argv.testConfigFile as string;
    if (testConfigFilename == undefined) {
      const choices = [];
      if (fs.existsSync('tests/config/test-config.json')) {
        choices.push({ title: 'Use the config information in test/config/test-config.json', value: 'test_config' });
      }
      choices.push({ title: 'Enter path for apiconfig file', value: 'other' });
      choices.push({ title: 'Enter api config manually', value: 'manual' });
      const configResponse = await prompts({
        type: 'select',
        name: 'configFile',
        message: 'Would you like to enter a path for an api config file (same json format used for tests)?',
        choices: choices,
        initial: 0,
      });

      if (configResponse.configFile === 'test_config') {
        testConfigFilename = 'tests/config/test-config.json';
      } else if (configResponse.configFile === 'other') {
        const filePathResponse = await prompts({
          type: 'text',
          name: 'filePath',
          message: 'Enter the path to the config file',
        });
        testConfigFilename = filePathResponse.filePath;
      }
    }

    if (testConfigFilename) {
      const configFile = await fs.readFileSync(testConfigFilename);
      const config = JSON.parse(configFile.toString());
      if (argv.restUrl === undefined) argv.restUrl = config.apiConfig.restUrl;
      if (argv.graphQlUrl === undefined) argv.graphQlUrl = config.apiConfig.graphQlUrl;
      if (argv.tenantId === undefined) argv.tenantId = config.apiConfig.tenantId;
      if (argv.publicKey === undefined) argv.publicKey = config.apiConfig.publicKey;
      if (argv.privateKey === undefined) argv.privateKey = config.apiConfig.privateKey;
    }

    //##############################################  Get the Rest URL ##################################### //
    let restUrl = argv.restUrl as string;
    if (restUrl === undefined) {
      const choices = [
        { title: INTERFOLIO_REST_URLS.PRODUCTION, value: INTERFOLIO_REST_URLS.PRODUCTION },
        { title: INTERFOLIO_REST_URLS.SANDBOX, value: INTERFOLIO_REST_URLS.SANDBOX },
        { title: INTERFOLIO_REST_URLS.BETA, value: INTERFOLIO_REST_URLS.BETA },
      ];
      const rResponse = await prompts({
        type: 'select',
        name: 'restUrl',
        message: 'Interfolio Rest URL to use',
        choices: choices,
        initial: 0,
      });
      restUrl = rResponse.restUrl;
      console.log(restUrl);
    }

    //##############################################  Get the GraphQL URL ##################################### //
    let graphQlUrl: string = argv.graphQlUrl as string;
    if (graphQlUrl === undefined) {
      const choices = [
        { title: INTERFOLIO_GRAPHQL_URLS.PRODUCTION, value: INTERFOLIO_GRAPHQL_URLS.PRODUCTION },
        { title: INTERFOLIO_GRAPHQL_URLS.SANDBOX, value: INTERFOLIO_GRAPHQL_URLS.SANDBOX },
        { title: INTERFOLIO_GRAPHQL_URLS.BETA, value: INTERFOLIO_GRAPHQL_URLS.BETA },
      ];
      const gResponse = await prompts({
        type: 'select',
        name: 'graphQlUrl',
        message: 'Interfolio GraphQL URL to use',
        choices: choices,
        initial: 0,
      });
      graphQlUrl = gResponse.graphQlUrl;
    }

    //##############################################  Get the Tenant ID ##################################### //
    let tenantId: number = argv.tenantId as number;
    if (tenantId === undefined) {
      const response = await prompts({
        type: 'number',
        name: 'tenantId',
        message: 'Interfolio Tenant Id',
      });
      tenantId = response.tenantId;
    }

    //##############################################  Get the public key ##################################### //
    let publicKey: string = argv.publicKey as string;
    if (publicKey === undefined) {
      const response = await prompts({
        type: 'text',
        name: 'publicKey',
        message: 'Interfolio API Public Key',
      });
      publicKey = response.publicKey;
    }

    //##############################################  Get the Private Key##################################### //
    let privateKey: string = argv.privateKey as string;
    if (privateKey === undefined) {
      const response = await prompts({
        type: 'text',
        name: 'privateKey',
        message: 'Interfolio API Private Key',
      });
      privateKey = response.privateKey;
    }

    //initialize the api
    const aConf: ApiConfig = { graphQlUrl, restUrl, publicKey, privateKey, tenantId };
    const api = new API(aConf);

    // ######################################## Get the module ######################################## //
    let moduleName: 'Tenure' = argv.module as 'Tenure';
    if (moduleName === undefined) {
      const moduleChoices = [];
      for (const attribute in api) {
        if (attribute !== 'apiRequest') moduleChoices.push({ title: attribute, value: attribute });
      }
      const mResponse = await prompts({
        type: 'select',
        name: 'module',
        message: 'Interfolio module for api call',
        choices: moduleChoices,
      });
      moduleName = mResponse.module;
    }
    const module = api[moduleName as keyof typeof api];

    // ######################################## Get the subApiName ######################################## //
    let subApiName: string = argv.subApi || '';
    if (subApiName === '') {
      const subApiChoices = [];
      for (const subApi in module) {
        subApiChoices.push({ title: subApi, value: subApi });
      }
      const sResponse = await prompts({
        type: 'select',
        name: 'subApi',
        message: 'Sub API for api call',
        choices: subApiChoices,
      });
      subApiName = sResponse.subApi;
    }

    // ######################################## Get the functionName ######################################## //
    let functionName = argv.function || '';
    if (functionName === '') {
      const functionChoices = [];
      //@todo remove if statment and specify "typeof module" below instead of "typeof api.Tenure"
      if (moduleName === 'Tenure') {
        for (const fName of Object.getOwnPropertyNames(
          api[moduleName][subApiName as keyof typeof api.Tenure].constructor.prototype,
        )) {
          if (fName !== 'constructor') functionChoices.push({ title: fName, value: fName });
        }
      }

      const fResponse = await prompts({
        type: 'select',
        name: 'functionName',
        message: 'Select Function',
        choices: functionChoices,
      });
      functionName = fResponse.functionName;
    }

    // ############################################## get the functionParameters ############################### //
    let parametersString = argv.parameters || '';
    if (parametersString === '') {
      const pResponse = await prompts({
        type: 'text',
        name: 'subApi',
        message: 'Enter parameters in json format',
        initial: '{}',
      });
      parametersString = pResponse.subApi;
    }
    const functionParameters = JSON.parse(parametersString);

    // ################################################ make the api call ######################################## //
    const response = await api.exec({
      moduleName: moduleName,
      subApiName: subApiName,
      functionName: functionName,
      functionParameters: functionParameters,
    });
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    try {
      JSON.parse(error);
      console.log(JSON.stringify(error, null, 2));
    } catch {
      console.log(error);
    }
  }
})();

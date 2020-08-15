import prompts, {PromptObject} from "prompts";
import {TestConfig} from "./setup-config";
import {ApiConfig} from "../../src";
import {INTERFOLIO_REST_URLS, INTERFOLIO_GRAPHQL_URLS} from "../../src/api-request";


/**
 * Prompts user for api user credentials and main api urls
 * @param config
 */
const setupConfigApi = async (config: TestConfig): Promise<TestConfig> => {

  // Set up the basic questions for urls and credentials
  const questions: PromptObject[] = [
    {
      type: "select",
      name: "restUrl",
      message: "Choose the Rest URL",
      choices: [
        { title: "production", description: INTERFOLIO_REST_URLS.PRODUCTION, value: INTERFOLIO_REST_URLS.PRODUCTION},
        { title: "sandbox", description: INTERFOLIO_REST_URLS.SANDBOX, value: INTERFOLIO_REST_URLS.SANDBOX},
        { title: "beta", description: INTERFOLIO_REST_URLS.BETA, value: INTERFOLIO_REST_URLS.BETA}
      ]
    },
    {
      type: "select",
      name: "graphQlUrl",
      message: "Choose the GraphQL URL",
      choices: [
        { title: "production", description: INTERFOLIO_GRAPHQL_URLS.PRODUCTION, value: INTERFOLIO_GRAPHQL_URLS.PRODUCTION},
        { title: "sandbox", description: INTERFOLIO_GRAPHQL_URLS.SANDBOX, value: INTERFOLIO_GRAPHQL_URLS.SANDBOX},
        { title: "beta", description: INTERFOLIO_GRAPHQL_URLS.BETA, value: INTERFOLIO_GRAPHQL_URLS.BETA}
      ]
    },
    {
      type: "number",
      name: "tenantId",
      message: "Enter Interfolio Tenant ID",
      validate: value => value < 1 ? "Must Provide valid Tenant ID" : true
    },
    {
      type: "text",
      name: "publicKey",
      message: "Public Key",
      validate: value => value.length < 10 ? "Public Key must be at least 10 characters long" : true
    },
    {
      type: "text",
      name: "privateKey",
      message: "Private Key"
    }
  ];



  //if the apiConfig already exists prompt to overwrite
  if(config.apiConfig) {
    const update = await prompts({
      type: "select",
      name: "update",
      message: "The connection information already exists.  Would you like to overwrite? (public key = " + config.apiConfig.publicKey + ")",
      choices: [
        {title: 'No', value: false},
        {title: 'Yes', value: true}
      ]
    });

    if(!update.update) {
      return config;
    }
    else {
      //set defaults to exists choices
      switch(config.apiConfig.restUrl) {
        case INTERFOLIO_REST_URLS.PRODUCTION: questions[0].initial = 0; break;
        case INTERFOLIO_REST_URLS.SANDBOX:    questions[0].initial = 1; break;
        case INTERFOLIO_REST_URLS.BETA:       questions[0].initial = 2; break;
        //add option for exisiting value
        default:
          if(config.apiConfig.restUrl) {
            if(questions[0].choices === undefined) questions[0].choices = [];
            questions[0].choices.push({title: "custom", description: config.apiConfig.restUrl, value: config.apiConfig.restUrl})
            questions[0].initial = 3;
          }
      }


      switch(config.apiConfig.graphQlUrl) {
        case INTERFOLIO_GRAPHQL_URLS.PRODUCTION: questions[1].initial = 0; break;
        case INTERFOLIO_GRAPHQL_URLS.SANDBOX:    questions[1].initial = 1; break;
        case INTERFOLIO_GRAPHQL_URLS.BETA:       questions[1].initial = 2; break;
        default:
          //add option for exisiting value
          if(config.apiConfig.graphQlUrl) {
            if(questions[1].choices === undefined) questions[1].choices = [];
            questions[1].choices.push({title: "custom", description: config.apiConfig.graphQlUrl, value: config.apiConfig.graphQlUrl})
            questions[1].initial = 3;
          }
      }
    }

    questions[2].initial = config.apiConfig.tenantId;
    questions[3].initial = config.apiConfig.publicKey;
    questions[4].initial = config.apiConfig.privateKey;
  }


  const answers  = await prompts(questions) as ApiConfig;
  config.apiConfig = answers;

  return config;
};

export { setupConfigApi };
export default setupConfigApi ;

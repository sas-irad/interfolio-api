import CommitteeApi from './tenure/committee-api';
import FormApi from './tenure/form-api';
import PacketTemplateApi from './tenure/packet-template-api';
import PacketTypeApi from './tenure/packet-type-api';
import PacketApi from './tenure/packet-api';
import ReportApi from './tenure/report-api';
import UnitApi from './tenure/unit-api';
import UserApi from './tenure/user-api';
import CommitteeMemberApi from './tenure/committees/committee-member-api';
import WorkflowStepApi from './tenure/packets/workflow-step-api';
import PlatformFormApi from './tenure/packets/platform-form-api';
import WorkflowStepCommitteeApi from './tenure/packets/workflow-steps/workflow-step-committee-api';
import EvaluatorSectionApi from './tenure/packets/evaluator-section-api';
import PacketAttachmentApi from './tenure/packets/packet-attachment-api';
import ApiRequest from './api-request';
import StatusApi from './tenure/status-api';

/**
 * ApiConfig specifies the needed parameters to initialize API calls to Interfolio
 */
export type ApiConfig = {
  /** The Rest URL endpoint root with no final slash(e.g. https://logic.interfolio.com) */
  restUrl: string;
  /** The GraphQL URL endpoint root with not final slash (e.g. https://caasbox.interfolio.com) */
  graphQlUrl: string;
  /** The Interfolio tenant id */
  tenantId: number;
  /** The public key provided by Interfolio for API access */
  publicKey: string;
  /** The private key provided by Interfolio for API access */
  privateKey: string;
};

/**
 * Class which has references to all implemented Interfolio API calls
 *
 * To initialize the API object in javascript:
 * ```javascript
 *
 *const INTERFOLIO_API = require('@sas-irad/interfolio-api/lib');
 *
 *const api = new INTERFOLIO_API.API({
 *   "restUrl": "https://logic.interfolio.com",
 *   "graphQlUrl": "https://caasbox.interfolio.com",
 *   "tenantId": 99999,
 *   "privateKey": "Interfolio supplied Private Key",
 *   "publicKey": "Interfolio supplied Public Key"
 *});
 * ```
 *
 *
 * To inialize and use in a typescript project:
 * ```typescript
 *import API from '@sas-irad/interfolio-api/lib';
 *const api = new API({
 *  "restUrl": "https://logic.interfolio.com",
 *  "graphQlUrl": "https://caasbox.interfolio.com",
 *  "tenantId": 99999,
 *  "privateKey": "Interfolio supplied Private Key",
 *  "publicKey": "Interfolio supplied Public Key"
 *});
 * ```
 */
export class API {
  /** handle the the apiRequest object **/
  public readonly apiRequest: ApiRequest;
  /** RPT (Review, Promotion and Tenure) api calls */
  public readonly Tenure: {
    /** Handle to the Committee Api calls */
    Committees: CommitteeApi;
    /** Handle to the CommitteeMember Api calls */
    CommitteeMembers: CommitteeMemberApi;
    /** Handle to Packet Evaluator Section Api calls */
    EvaluatorSections: EvaluatorSectionApi;
    /** Handle to the Forms Api calls */
    Forms: FormApi;
    /** Handle to the Packet Api */
    Packets: PacketApi;
    /** Handle to the PacketAttachment Api */
    PacketAttachments: PacketAttachmentApi;
    /** Handle to the PacketTemplate Api */
    PacketTemplates: PacketTemplateApi;
    /** Handle to the PacketType api */
    PacketTypes: PacketTypeApi;
    /** Handle to the Platform Form Api */
    PlatformForms: PlatformFormApi;
    /** Handle to the Report api */
    Reports: ReportApi;
    /** Handle to the Status api */
    Statuses: StatusApi;
    /** Handle to the Unit Api calls */
    Units: UnitApi;
    /** Handle to the User Api calls */
    Users: UserApi;
    /** Handle to Workflow Step Api calls */
    WorkflowSteps: WorkflowStepApi;
    /** Handle to the Workflow Step Committee Api Calls */
    WorkflowStepCommittees: WorkflowStepCommitteeApi;
  };

  /**
   * Creates the Interfolio API class with the tenant info and endpoint roots for accessing Interfolio data
   *
   * @constructor
   * @param config Configuration for API calls - of type either ApiConfig or ApiRequest
   *
   * note pass in ApiRequest to keep all errors in one object instance
   */
  constructor(config: ApiConfig | ApiRequest) {
    if (config.constructor && config.constructor.name === 'ApiRequest') {
      this.apiRequest = config as ApiRequest;
    } else {
      const apiConfig = config as ApiConfig;
      this.apiRequest = new ApiRequest(apiConfig);
    }
    this.Tenure = {
      Committees: new CommitteeApi(this.apiRequest),
      CommitteeMembers: new CommitteeMemberApi(this.apiRequest),
      EvaluatorSections: new EvaluatorSectionApi(this.apiRequest),
      Forms: new FormApi(this.apiRequest),
      Packets: new PacketApi(this.apiRequest),
      PacketAttachments: new PacketAttachmentApi(this.apiRequest),
      PacketTemplates: new PacketTemplateApi(this.apiRequest),
      PacketTypes: new PacketTypeApi(this.apiRequest),
      PlatformForms: new PlatformFormApi(this.apiRequest),
      Reports: new ReportApi(this.apiRequest),
      Statuses: new StatusApi(this.apiRequest),
      Units: new UnitApi(this.apiRequest),
      Users: new UserApi(this.apiRequest),
      WorkflowSteps: new WorkflowStepApi(this.apiRequest),
      WorkflowStepCommittees: new WorkflowStepCommitteeApi(this.apiRequest),
    };
  }

  /**
   * Execute the designated module/subApi/function
   * @param moduleName
   * @param subApiName
   * @param functionName
   * @param functionParameters
   */
  async exec({
    moduleName = 'Tenure',
    subApiName,
    functionName,
    functionParameters,
  }: {
    moduleName?: 'Tenure';
    subApiName: string;
    functionName: string;
    functionParameters: any | null;
  }): Promise<any> {
    const module = this[moduleName];
    const subApi = module[subApiName as keyof typeof module];
    const apiFunction = subApi.constructor.prototype[functionName as keyof typeof subApi];
    return apiFunction.call(subApi, functionParameters);
  }
}
export default API;

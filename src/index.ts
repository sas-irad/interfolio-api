import ApiRequest from "./api-request";

export default class API {
  private request: ApiRequest;

  constructor(config: ApiConfig) {
    this.request = new ApiRequest(config);
  }
}

export type ApiConfig = {
  restUrl:    string;
  graphQlUrl: string;
  tenantId:   number;
  publicKey:  string;
  privateKey: string;
}


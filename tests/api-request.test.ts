import ApiRequest, {INTERFOLIO_CORE_URL_V1} from "../src/api-request";
import { expect } from "chai";
import config from "./config/test-config.json";


/**
 * Test for ApiRequest class
 */
describe('API Request Test', () => {
  //Test the rest request endpoint
  it('rest api request', async () => {
    const request = new ApiRequest(config);
    const url = INTERFOLIO_CORE_URL_V1 + "/units/usage";
    const response = await request.executeRest({ url });
    expect(typeof response.user).to.equal("object", "Api returns an object with attribute user and type of object");
  });


  //Api Request Failure
  it('rest api request failure', async () => {
    try {
      const request = new ApiRequest(config);
      const url = INTERFOLIO_CORE_URL_V1 + "/badUrl";
      await request.executeRest({ url });
      throw("no error thrown");
    }
    catch (error) {
      expect(error).to.equal("Invalid URL or method", "error message not thrown");
     }
  });

  //Test a Graphql endpoint
  it('graphql api request', () => {
    //@todo implement test
  });
});

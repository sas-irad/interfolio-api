import ApiRequest, { INTERFOLIO_CORE_URL_V1 } from '../src/api-request';
import { expect } from 'chai';
import Config from './config/test-config.json';
import { GraphQlRequest } from '../lib/api-request';

/**
 * Test for ApiRequest class
 */
describe('API Request Test', () => {
  //Test the rest request endpoint
  it('rest api request', async () => {
    const request = new ApiRequest(Config.apiConfig);
    const url = (INTERFOLIO_CORE_URL_V1 + '/units/usage').replace('{module}', 'search');
    const response = await request.executeRest({ url });
    expect(typeof response.user).to.equal('object', 'Api returns an object with attribute user and type of object');
  });

  //Api Request Failure - test to make sure the error is returned
  it('rest api request failure', async () => {
    const request = new ApiRequest(Config.apiConfig);
    const url = INTERFOLIO_CORE_URL_V1 + '/badUrl';
    try {
      await request.executeRest({ url });
      throw 'no error thrown';
    } catch (error) {
      expect(error.message).to.equal('Invalid URL or method', 'error message not thrown');
      expect(request.errors.length).eq(request.maxRetries + 1, 'Expect number of errors to equal maxRetries + 1');
    }
  });

  //Api Request Failure - test to make sure the error is returned
  it('grapql request failure', async () => {
    const request = new ApiRequest(Config.apiConfig);
    const gqlReq: GraphQlRequest = {
      operationName: 'badName',
      query: 'badQuery',
    };
    try {
      await request.executeGraphQl(gqlReq);
      throw 'no error thrown';
    } catch (error) {
      expect(error.message).to.contain('Parse error on "badQuery', 'error message not thrown');
      expect(request.errors.length).eq(request.maxRetries + 1, 'Expect number of errors to equal maxRetries + 1');
    }
  });

  //Test a Graphql endpoint
  it('graphql api request', async () => {
    const request = new ApiRequest(Config.apiConfig);
    const gqlRequest: GraphQlRequest = {
      operationName: 'getForms',
      variables: { searchText: Config.form.title },
      query:
        'query getForms($searchText: String!) {forms(limit: 50, page: 1, sortBy: "id", searchText: $searchText, sortOrder: DESC, unitId: null) {results {description id title unitId __typename}__typename}}',
    };
    const response = await request.executeGraphQl(gqlRequest);
    expect(response.data.forms.results[0].title).eq(Config.form.title, 'Graphql response form title matches');
  });
});

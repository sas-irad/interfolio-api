import API from '../src/index';
import { expect } from 'chai';
import config from "./config/test-config.json";

describe('API test', () => {
  it('create API', () => {
    const api = new API(config);
    expect(typeof api).to.equal("object", "API created with type of object");
  });
});

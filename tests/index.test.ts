import API from '../src/index';
import { expect } from 'chai';

describe('API test', () => {
  it('should create API', () => {
    const api = new API({ attribute: 'my attribute' });
    expect(api.getAttribute()).to.equal('my attribute');
  });
});

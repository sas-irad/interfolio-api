# Interfolio API

This is the [TypeDoc](https://typedoc.org) generated documentation for the Interfolio API project.
Most examples assume you have already instantiated an ```api``` object which can be done in the following way:

JavaScript Projects
```javascript
const INTERFOLIO_API = require('@sas-irad/interfolio-api/lib');

let api = new INTERFOLIO_API.API({
  "restUrl": "https://logic.interfolio.com", 
  "graphQlUrl": "https://caasbox.interfolio.com", 
  "tenantId": 99999, 
  "privateKey": "Interfolio supplied Private Key",
  "publicKey": "Interfolio supplied Public Key"
});
```

TypeScript Projects
```typescript
import API from '@sas-irad/interfolio-api/lib';

let api = new API({
  "restUrl": "https://logic.interfolio.com",
  "graphQlUrl": "https://caasbox.interfolio.com",
  "tenantId": 99999,
  "privateKey": "Interfolio supplied Private Key",
  "publicKey": "Interfolio supplied Public Key"
});
```

# Interfolio Api

Library which contains methods that utilize Interfolio's API to view and edit data from an Interfolio instance. 

## Background

This API middleware was developed by the University of Pennsylvania School of Arts and Sciences
for their integration with Interfolio.  As the integration did not require all available APIs
to be utilized there are many which have not yet been implemented.  Most of the endpoints are 
 related to the "Review Promotion and Tenure (RPT)" module.  You are free to use and further 
 development is certainly encouraged.  Visit the project wiki for information on how to contribute.
 

## Uses

The primary purpose of this library is to provide a typescript/javascript interface to the Interfolio API.
This library takes the grunt work out of actually making the calls to Interfolio.  It can be used as 
middle-ware to help script backend integrations.  Since the instantiation of the library
requires a private key to acheive authentication, it is not intended for use in a public 
front end application. 

## Installation

```bash
npm install @sas-irad/interfolio-api
```

## API Documentation

Documentation for all of the implemented API calls can be found on the [github documentation site](https://sas-irad.github.io/interfolio-api).

## Contributing

Developer guide for making (much appreciated) contributions can be found ont the [github wiki](https://github.com/sas-irad/interfolio-api/wiki).

## Getting Started

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
let units = await api.Unit.getUnits();
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
let units = await api.Unit.getUnits();
```

Once the ```api``` object has been instantiated you can run any of the implemented Interfolio API functions e.g.
```javascript
let units = await api.Units.getUnits();
```




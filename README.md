# Interfolio Api

Library which contains methods that utilize Interfolio's API to view and edit data from an Interfolio instance. 

## Background

This API middleware was developed by the University of Pennsylvania School of Arts and Sciences
for their integration with Interfolio.  As the integration did not require all available APIs
to be utilized there are many which have not yet been implemented.  Most of the endpoints are 
 related to the "Review Promotion and Tenure (RPT)" module.  You are free to use and further 
 development is certainly encourged.  Visit the project wiki for information on how to contribute.
 
## Installation

```bash
npm install @sas-irad/interfolio-api
```

## Getting Started

To initiate the API it is necessary to supply the urls, tenantId and public/private keys.  
The reason to supply the urls is to allow testing against endpoints such as ```https://logic-sandbox.interfolio.com```

.js initialization 
```js
const INTERFOLIO_API = require('@sas-irad/interfolio-api/lib');

let api = new INTERFOLIO_API.API({
  "restUrl": "https://logic.interfolio.com", 
  "graphQlUrl": "https://caasbox.interfolio.com", 
  "tenantId": 99999, 
  "privateKey": "Interfolio supplied Private Key",
  "publicKey": "Interfolio supplied Public Key"
});
```

.ts initialization
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

## A Note on CamelCase vs. Underscore

The case battle rages on!  Since camel case is the generally excepted format for Javascript/Typescript
most parameter/attribute names are in camel case (e.g ```packetId``` instead of ```packet_id```).  However, 
many of the Interfolio API endpoints return and accept data elements using underscores.  The general rule used in
this library is if data is coming back directly from the api or being sent directly to the api the case will 
match the format required/returned by the Interfolio API (usually underscore).  Otherwise the parameter/attribute names
will be in camel case.


## A Note on Nested Data Structures

In many cases, when Intefolio API endpoints return a nested data structure, the nested elements have an additional layer in the 
object that is returned.  As this creates extra steps and confusion when utilizing the returned data these extra levels
are generally removed after the data is retrieved.

For example: 
The following 
```js
{
  packetId: 99999,
  workflow_steps: [
    {
      workflow_step: {
        id: 1,
        name: "Step 1",
        ...
      }
    },
    {
      workflow_step: {
        id: 2,
        name: "Step 2",
        ...
      }
    }
  ]
}
```

is converted to
```js
{
  packetId: 99999,
  workflow_steps: [
    {
      id: 1,
      name: "Step 1",
      ...
    },
    {
      id: 2,
      name: "Step 2",
      ...
    }
  ]
}
```




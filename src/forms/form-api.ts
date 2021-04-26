import ApiRequest, {GraphQlRequest} from '../api-request';
import { ApiConfig } from '../index';

/**
 * Type defining the form field
 */
export type FormField = {
  /** the type of field (e.g. text, collection, select) */
  field_type: string;
  /** id of the field (e.g. q1_text_99999) */
  id: string;
  /** label for the question */
  label: string;
  /** additioanl data about the field */
  meta: {maxlength?: number, type: string};
  /** name of the field (similar to id) */
  name: string;
  /** flag indicating the field is required */
  required: boolean;
};

/**
 * Type defining the form version
 */
export type FormVersion = {
  /** id uniquely identifying the form version */
  id: number;
  versionData: {
    /** the description of the form including html styling elements (e.g. <p>description text</p>) **/
    description: string;
    /** array of fieldsets for this form. main form fields contained in fieldset[0] */
    fieldsets: {
      /** array of fields in this field set */
      fields: FormField[];
      /** the id of the fieldset */
      id: string;
    }[];
    /** id uniquely identifying this version in the form of Name_of_form_12345666 */
    id: string;
    /** the name of the form */
    name: string;
  }
}

/**
 * Type defining a Form
 */
export type Form = {
  /** flag indicating if the current user can administer the form */
  canAdminister: boolean;
  /** the current version of the form */
  currentVersion: FormVersion;
  /** the description of the form including html styling elements (e.g. <p>description text</p>) **/
  description: string;
  /** id uniquely identifying the form */
  id: number;
  /** the number of response to this form */
  responseCount: number;
  /** the title of the form */
  title: string;
  /** the unit_id of the unit this form belongs to */
  unitId: number;
};


/**
 * Listing returned from the getForms call
 */
export type FormListing = {
  /** The number of associations this form has */
  associationsCount: number;
  /** if the current user can administer this form */
  canAdminister: boolean;
  /** description of form including html tags **/
  description: string;
  /** id uniquely identifying this form */
  id: number;
  /** slug for the form */
  slug: string;
  /** tenant id for the form */
  tenantId: number;
  /** title of the form */
  title: string;
  /** unitId of the form */
  unitId: number
  /** unit name of the form */
  unitName: string;
}


export class FormApi {
  /**
   * API request object for making the actual http requests
   */
  private readonly apiRequest: ApiRequest;

  /**
   * Constructor for the object
   * @param apiConfig Configuration for API calls
   */
  constructor(apiConfig: ApiConfig) {
    this.apiRequest = new ApiRequest(apiConfig);
  }

  /**
   * Create a new custom form for committees
   * @param title
   * @param description
   * @param unitId
   */
  public async createForm({title, description, unitId}: {title: string, description: string, unitId: number}) : Promise<number> {
    return new Promise((resolve, reject) => {
      reject('Create Form Not Enabled via API');
      return;
      const formId = title.replace(' ', '_').toLowerCase() + "_" + Date.now().toString();
      const gqlReq: GraphQlRequest = {
        operationName: "createForm",
        query: "mutation createForm($input: CreateFormAttributes!) {createForm(input: $input) {form {id\n      tenantId\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n",
        variables: {
          input: {
            title: title,
            description: description,
            unitId: unitId,
            serviceId: 1,
            formData: {
              description: description,
              id: formId,
              name: title,
              fieldsets: [ {id: formId + '_fieldset', fields: []} ]
            }
          }
        }
      };

      this.apiRequest.executeGraphQl(gqlReq)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Delete the Form (not yet available via API call
   * @param id
   */
  public async deleteForm({id}: {id: number}) : Promise<boolean> {
    return new Promise((resolve, reject) => {
      reject('Delete Form Not Enabled via API');
      return;
      const gqlReq: GraphQlRequest = {
        operationName: "deleteForm",
        query: "mutation deleteForm($id: Int!) {\n  deleteForm(id: $id) {\n    deleted\n    __typename\n  }\n}\n",
        variables: {id}
      };
      this.apiRequest.executeGraphQl(gqlReq)
        .then(response => {
          resolve(response);
        })
      .catch(error => {
        reject(error);
      })
    });
  }


  /**
   * Find a Commmittee form in a particular unit
   * @param title
   * @param unitId
   */
  public async findCommitteeForm({title, unitId}: {title: string, unitId: number}): Promise<FormListing> {
    return new Promise<FormListing>((resolve, reject) => {
      const gqlRequest: GraphQlRequest = {
        "operationName": "getForms",
        "variables": {"searchText": title},
        "query": "query getForms($searchText: String!) {forms(limit: 50, page: 1, sortBy: id, searchText: $searchText, sortOrder: DESC, unitId: null) {results {description id title unitId __typename}__typename}}"
      };
      this.apiRequest.executeGraphQl(gqlRequest)
        .then((response) => {
          let found = false;
          //loop through results and check to see if it matches
          for (const f of response.data.forms.results) {
            if (f.title == title && f.unitId == unitId) {
              resolve(f);
              found = true;
              break;
            }
          }
          if (!found) {
            reject('No Form with the name "' + title + '" could be found');
          }
        })
        .catch((error) => reject(error));
    });
  }


  public async getForm({id}: {id: number}): Promise<Form> {
    return new Promise<Form>((resolve, reject) => {
      const gqlRequest: GraphQlRequest = {
        "operationName": "getForm",
        "variables": {id},
        "query": "query getForm($id: Int!) {\n  form(id: $id) {\n    id\n    unitId\n    title\n    description\n    canAdminister\n    currentVersion {\n      id\n      versionData\n    }\n     }\n}\n"
      };
      this.apiRequest.executeGraphQl(gqlRequest)
        .then((response) => {
          resolve(response.data.form);
        })
        .catch((error) => reject(error));
    });
  }
}

export default FormApi;

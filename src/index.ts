export default class API {
  private attribute: string;

  constructor(params: { attribute: string }) {
    this.attribute = params.attribute;
  }

  public getAttribute(): string {
    return this.attribute;
  }
}

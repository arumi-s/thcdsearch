import { ItemCriteria, Options } from "../../options";

export interface SearchParam {
  criteria: ItemCriteria;
  mode: number;
}

export class SearchRequest {
  criteria: ItemCriteria = {};
  hash = "";
  total = -1;
  token = "";
  limit = 50;
  offset = 0;
  more = true;
  private valid = false;

  constructor({ criteria }: SearchParam) {
    this.criteria = {
      ...Options.ExtraCriteria
    };
    let fieldName: keyof ItemCriteria;
    let fieldCount = 0;
    for (fieldName in criteria) {
      if (criteria.hasOwnProperty(fieldName)) {
        const field = criteria[fieldName];
        if (field != null && field.length > 0) {
          this.criteria[fieldName] = field;
          ++fieldCount;
        }
      }
    }
    if (fieldCount > 0) {
      this.total = 0;
      this.hash = "";
      //this.quer + "|" + this.reqs + "|" + this.pred + "|" + this.sort + "|" + this.orde + "|limit=" + this.limit;
      this.valid = true;
    } else {
      this.valid = false;
    }
  }

  isValid() {
    return this.valid;
  }

  /*
  getFullQuery() {
    return {
      action: "uask",
      pre: this.pred,
      query: this.quer,
      result: this.reqs,
      token: this.toke,
      sort: this.sort,
      order: this.orde,
      limit: this.perp,
      offset: 0
    };
  }*/
}

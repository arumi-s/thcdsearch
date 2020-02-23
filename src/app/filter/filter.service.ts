import { Injectable } from "@angular/core";
import { Item, ItemCriteria, ItemField } from "../options";
import { filterOptions } from "./filter-options";

@Injectable({
  providedIn: "root"
})
export class FilterService {
  criteria: ItemCriteria = {};

  propSuggestion: {
    [key in ItemField]?: Array<any>;
  } = {};

  constructor() {}

  updateOptions() {
    filterOptions.forEach(option => {
      if (option.content == null) option.content = {};
      if (option.init) {
        const suggestion: Array<any> = this.propSuggestion[option.id as keyof FilterService["propSuggestion"]];
        option.init.call(this, option, suggestion || []);
      }
    });
  }

  get filterOptions() {
    return filterOptions;
  }
}

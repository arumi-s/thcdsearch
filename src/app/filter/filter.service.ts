import { Injectable } from "@angular/core";
import { ItemCriteria, ItemField } from "../options";
import { filterOptions } from "./filter-options";
import { SearchService } from "../services/search.service";

@Injectable({
  providedIn: "root"
})
export class FilterService {
  criteria: ItemCriteria = {};

  propSuggestion: {
    [key in ItemField]?: Array<any>;
  } = {};

  constructor(private searchService: SearchService) {}

  updateOptions() {
    filterOptions.forEach(option => {
      if (option.content == null) option.content = {};
      if (option.init) {
        const suggestion: Array<any> = this.propSuggestion[option.id as keyof FilterService["propSuggestion"]];
        option.init.call(this, option, suggestion || []);
      }
    });
  }

  search(mode: number) {
    this.searchService.search({
      criteria: { ...this.criteria },
      mode
    });
  }

  get filterOptions() {
    return filterOptions;
  }
}

import { Injectable } from "@angular/core";
import { ItemCriteria, ItemField } from "../options";
import { filterOptions } from "./filter-options";
import { SearchService } from "../services/search.service";
import { SearchRequest } from "../apis/search/search-request";

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

  createSearchRequest(mode: number) {
    return this.searchService.createSearchRequest({
      criteria: { ...this.criteria },
      mode
    });
  }

  next(request: SearchRequest) {
    return this.searchService.next(request);
  }

  get filterOptions() {
    return filterOptions;
  }
}

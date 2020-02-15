import { Injectable } from "@angular/core";
import { Craft, CraftInfo, CraftCriteria, CraftField } from "../craft/craft.component";
import { filterOptions } from "./filter-options";

@Injectable({
  providedIn: "root"
})
export class FilterService {
  crafts: Array<Craft>;

  criteria: CraftCriteria = {};

  propSuggestion: {
    [key in CraftField]?: Array<any>;
  } = {};
  infoSuggestion: {
    [key in keyof CraftInfo]?: Array<any>;
  } = {};

  constructor() {}

  setCrafts(crafts: Array<Craft>) {
    this.crafts = crafts;
    this.updateOptions();
  }

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

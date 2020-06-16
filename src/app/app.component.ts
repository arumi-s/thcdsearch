import { Component, OnInit } from "@angular/core";
import { map, distinctUntilChanged } from "rxjs/operators";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Options, ItemCriteria, Item } from "./options";
import { TranslationService } from "./services/translation.service";
import { SvgIconRegistryService } from "angular-svg-icon";
import { FilterService } from "./filter/filter.service";
import { SearchRequest } from "./apis/search/search-request";

@Component({
  selector: "thcd",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent implements OnInit {
  loading = false;
  sort: string;
  request: SearchRequest = null;
  matchedCount = 0;
  search = "";

  filterOptionsReady = false;
  filterCountSubject = new Subject<(c: ItemCriteria) => number>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public filterService: FilterService,
    public translate: TranslationService,
    private iconReg: SvgIconRegistryService
  ) {
    this.addIcon("filter");
    this.addIcon("search");
    this.addIcon("sort");
    this.addIcon("clear");
    this.addIcon("matched");
    this.addIcon("language");
  }

  addIcon(name: string) {
    this.iconReg.addSvg(name, require("!!raw-loader?!../assets/icons/tools/" + name + ".svg").default as string);
  }

  ngOnInit() {
    this.subscribeRoute();
    this.filterService.updateOptions();
    this.filterOptionsReady = true;
  }

  get Options() {
    return Options;
  }

  subscribeRoute() {
    this.observeParam("sort").subscribe(sort => {
      if (sort == null || sort === "") sort = "year";
      if (sort.startsWith("-")) {
        //this.filterService.isotopeOptions.sortBy = sort.substr(1);
        //this.filterService.isotopeOptions.sortAscending = true;
      } else {
        //this.filterService.isotopeOptions.sortBy = sort;
        //this.filterService.isotopeOptions.sortAscending = false;
      }
    });
  }

  observeParam(id: string): Observable<string> {
    return this.route.queryParamMap.pipe(
      map(queryParamMap => (queryParamMap.has(id) ? queryParamMap.get(id).trim() : null)),
      distinctUntilChanged()
    );
  }

  routeTo(queryParams: Params) {
    this.router.navigate([], { queryParams, queryParamsHandling: "merge" });
  }

  clearFilters() {
    this.router.navigate([], { queryParams: { sort: this.sort } });
  }

  async submit(mode: number) {
    this.request = this.filterService.getSearchRequest();
    console.log(this.request);
    if (this.request) {
      await this.request.getCount();
    }
    this.onScroll();
  }

  async onScroll() {
    if (this.request != null) {
      await this.request.getNext();
    }
  }

  toggleLang() {
    this.translate.use(this.translate.currentLang === "zh" ? "en" : "zh");
  }
}

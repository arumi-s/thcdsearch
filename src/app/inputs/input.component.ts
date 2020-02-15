import { OnInit, HostBinding, OnDestroy, Component } from "@angular/core";
import { Subscription } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { CraftCriteria } from "../craft/craft.component";
import { FilterOption } from "../filter/filter-options";

@Component({
  selector: "input-base",
  templateUrl: "./input.component.html"
})
export class InputBaseComponent implements OnInit, OnDestroy {
  @HostBinding("attr.id")
  id: string;
  option: FilterOption;

  @HostBinding("class.field")
  classField = true;

  routeSub: Subscription;
  _value: any;

  constructor(public app: AppComponent, public http: HttpClient) {}
  ngOnInit() {
    this.routeSub = this.app.observeParam(this.id).subscribe(route => {
      this._value = this.routeToValue(route);
      const key = this.id as keyof CraftCriteria;
      this.app.filterService.criteria[key] = this.valueToCriteria(this._value);
    });
    this.onInit();
  }
  onInit() {}

  get value(): any {
    return this._value;
  }
  set value(value: any) {
    this.app.routeTo({ [this.id]: this.valueToRoute(value) });
  }

  valueToCriteria(value: any): Array<string> {
    return [value];
  }

  valueToRoute(value: any): string {
    return value;
  }

  routeToCriteria(route: string): Array<string> {
    return this.valueToCriteria(this.routeToValue(route));
  }

  routeToValue(route: string): any {
    return route == null ? "" : route;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.onDestroy();
  }

  onDestroy() {}
}

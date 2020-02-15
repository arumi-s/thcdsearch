import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  Type
} from "@angular/core";
import { AppComponent } from "../app.component";
import { Subscription } from "rxjs";
import { InputList } from "../inputs/inputs.module";
import { InputBaseComponent } from "../inputs/input.component";
import { RangeComponent } from "../inputs/range/range.component";
import { ChecklistComponent } from "../inputs/checklist/checklist.component";
import { FilterOption, FilterInputType } from "./filter-options";
import { TaglistComponent } from "../inputs/taglist/taglist.component";

@Component({
  selector: "filter",
  templateUrl: "./filter.component.html",
  styleUrls: ["./filter.component.less"],
  entryComponents: InputList
})
export class FilterComponent implements OnInit {
  @Input()
  option: FilterOption;

  @HostBinding("attr.id")
  get id() {
    return this.option.id;
  }

  @HostBinding("class.collapsed")
  collapsed = false;

  _sort = "";
  sortNext = "";
  routeSub: Subscription;

  componentRef_: ComponentRef<InputBaseComponent>;

  constructor(private app: AppComponent, private componentResolver: ComponentFactoryResolver) {}

  @ViewChild("content", { read: ViewContainerRef, static: true })
  container: ViewContainerRef;

  static matchClass(type?: FilterInputType) {
    switch (type) {
      case "range":
        return RangeComponent;
      case "checklist":
        return ChecklistComponent;
      case "taglist":
        return TaglistComponent;
    }
    return InputBaseComponent;
  }

  /*get sort(): string {
    return this._sort == null ? "" : this._sort;
  }
  set sort(sort: string) {
    this.app.routeTo({ [this.id + SORT_SUFFIX]: sort === "" ? null : sort });
  }*/

  ngOnInit(): void {
    if (this.option.collapse) this.collapsed = true;
    this.container.clear();
    const factoryClass = FilterComponent.matchClass(this.option.type);
    const componentFactory = this.componentResolver.resolveComponentFactory(factoryClass as Type<InputBaseComponent>);
    this.componentRef_ = this.container.createComponent(componentFactory);
    this.option.component = this.componentRef_.instance;
    this.componentRef_.instance.id = this.id;
    this.componentRef_.instance.option = this.option;

    /*this.routeSub = this.app
      .observeParam(this.id + SORT_SUFFIX, true)
      .subscribe(sort => {
        this._sort = sort;
      });*/
  }

  onClear() {
    this.app.routeTo({ [this.id]: "" });
  }
}

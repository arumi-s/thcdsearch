import { Component, HostBinding } from "@angular/core";
import { InputBaseComponent } from "../input.component";
import { take } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import { ItemCriteria } from "../../options";

export interface ChecklistItem {
  value: string;
  text?: string;
  color?: string;
  class?: string;
  count?: number;
  omit?: boolean;
}

function sortCount({ count: a }: ChecklistItem, { count: b }: ChecklistItem) {
  return (b || 0) - (a || 0);
}

@Component({
  selector: "input-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: ["./checklist.component.less"]
})
export class ChecklistComponent extends InputBaseComponent {
  _value: Array<string> = [];
  checked: { [key: string]: boolean } = new Proxy(
    {},
    {
      get: (target, key: string) => {
        if (key === "_") {
          return this._value.length === 0;
        }
        return this._value.includes(key);
      },
      set: (target, key: string, value: boolean) => {
        if (key === "_") {
          this._value = [];
          this.value = this._value;
          return true;
        }
        if (value === this._value.includes(key)) return true;
        if (value) {
          this._value.push(key);
        } else {
          this._value = this._value.filter(c => c !== key);
        }
        this.value = this._value;
        return true;
      }
    }
  );
  sum = 0;

  updateCountSubject: Subject<void> = new Subject<void>();
  filterCountSub: Subscription;

  @HostBinding("class.has-omit")
  hasOmit = false;

  @HostBinding("class.show-omit")
  showOmit = false;

  onInit() {
    this.updateCountSubject.pipe(take(1)).subscribe(() => {
      this.sum = this.option.content.list.reduce((prev: number, { count }: ChecklistItem) => prev + (count || 0), 0);
      let sortList: Array<ChecklistItem>;
      if (this.option.content.noSort !== true) {
        this.option.content.list.sort(sortCount);
        sortList = this.option.content.list;
      } else {
        sortList = this.option.content.list.slice(0);
        sortList.sort(sortCount);
      }
      if (this.option.content.noOmit !== true && this.sum > 0) {
        let partial = 0;
        sortList.forEach((item: ChecklistItem) => {
          if (partial / this.sum > 0.8) {
            item.omit = true;
            this.hasOmit = true;
          }
          partial += item.count || 0;
        });
      }
    });
    this.filterCountSub = this.app.filterCountSubject.subscribe(countFunction => {
      this.option.content.list.forEach((item: ChecklistItem) => {
        item.count = countFunction({
          [this.id as keyof ItemCriteria]: this.valueToCriteria([item.value.toString()])
        });
      });
      this.hasOmit = this.option.content.list.some((item: ChecklistItem) => item.count === 0 || item.omit);
      this.updateCountSubject.next();
    });
  }

  valueToCriteria(value: Array<string>) {
    return value.length === 0 ? null : value;
  }

  valueToRoute(value: Array<string>): string {
    return value.length === 0 ? null : value.join("!-!");
  }

  routeToValue(route: string) {
    return route == null ? [] : route.split(/\s*!-!\s*/g).filter(v => v !== "");
  }

  toggleOmit(event: MouseEvent) {
    event.preventDefault();
    this.showOmit = !this.showOmit;
  }

  onDestroy() {
    this.filterCountSub.unsubscribe();
  }
}

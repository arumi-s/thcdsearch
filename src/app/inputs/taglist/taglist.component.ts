import { Component, HostBinding } from "@angular/core";
import { InputBaseComponent } from "../input.component";
import { CraftCriteria } from "src/app/craft/craft.component";
import { take, debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { Subject, Subscription, Observable } from "rxjs";
import { NgbTypeaheadSelectItemEvent } from "@ng-bootstrap/ng-bootstrap";
import { Options } from "src/app/options";

export interface TaglistItem {
  value: string;
  text?: string;
  color?: string;
  class?: string;
  count?: number;
  omit?: boolean;
}

function sortCount({ count: a }: TaglistItem, { count: b }: TaglistItem) {
  return (b || 0) - (a || 0);
}

@Component({
  selector: "input-taglist",
  templateUrl: "./taglist.component.html",
  styleUrls: ["./taglist.component.less"]
})
export class TaglistComponent extends InputBaseComponent {
  _value: Array<string> = [];
  isStatic = true;
  loading = false;
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
          if (this.option.content.list.every(({ value: cmpKey }) => cmpKey !== key)) {
            if (this.isStatic) {
              const item = this.option.content.tagList.find(({ value: cmpKey }) => cmpKey === key);
              if (item != null) {
                this.option.content.list.push(item);
                this._value.push(key);
              }
            } else {
              this.option.content.list.push({ value: key, text: key });
              this._value.push(key);
            }
          } else {
            this._value.push(key);
          }
        } else {
          this._value = this._value.filter(c => c !== key);
        }
        this.value = this._value;
        return true;
      }
    }
  );
  sum = 0;
  typeahead = "";

  updateCountSubject: Subject<void> = new Subject<void>();
  filterCountSub: Subscription;

  //@HostBinding("class.has-omit")
  hasOmit = false;

  //@HostBinding("class.show-omit")
  showOmit = false;

  onInit() {
    this.isStatic = this.option.content.tagList != null || this.option.content.tagListSource == null;
    if (this.option.content.list == null) this.option.content.list = [];
    if (this.option.content.tagList == null) this.option.content.tagList = [];
    this.updateCountSubject.pipe(take(1)).subscribe(() => {
      this.sum = this.option.content.list.reduce((prev: number, { count }: TaglistItem) => prev + (count || 0), 0);
      let sortList: Array<TaglistItem>;
      if (this.option.content.noSort !== true) {
        this.option.content.list.sort(sortCount);
        sortList = this.option.content.list;
      } else {
        sortList = this.option.content.list.slice(0);
        sortList.sort(sortCount);
      }
      if (this.option.content.noOmit !== true && this.sum > 0) {
        let partial = 0;
        sortList.forEach((item: TaglistItem) => {
          if (partial / this.sum > 0.8) {
            item.omit = true;
            this.hasOmit = true;
          }
          partial += item.count || 0;
        });
      }
    });
    this.filterCountSub = this.app.filterCountSubject.subscribe(countFunction => {
      this.option.content.list.forEach((item: TaglistItem) => {
        item.count = countFunction({
          [this.id as keyof CraftCriteria]: this.valueToCriteria([item.value.toString()])
        });
      });
      this.hasOmit = this.option.content.list.some((item: TaglistItem) => item.count === 0 || item.omit);
      this.updateCountSubject.next();
    });
  }

  search = (text: Observable<string>) => {
    return text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      this.isStatic ? map(this.staticSearch) : switchMap(this.remoteSearch)
    );
  };

  staticSearch = (term: string) => {
    if (term.length === 0) return [];
    const segs = term
      .split(/\s+/)
      .filter(t => t !== "")
      .map(t => t.toLowerCase());
    if (segs.length === 0) return [];
    return this.option.content.tagList
      .filter(v => segs.every(seg => v.value.toLowerCase().indexOf(seg) > -1))
      .slice(0, 10);
  };
  remoteSearch = (term: string) => {
    this.loading = true;
    return this.http
      .get(Options.SApi, {
        params: {
          action: "inopt",
          title: this.option.content.tagListSource,
          value: term
        },
        responseType: "text"
      })
      .pipe(
        map((result: string) => {
          const html = new DOMParser().parseFromString(result, "text/html");
          this.loading = false;
          return Array.from(html.querySelectorAll("div")).map(child => {
            return {
              text: child.textContent,
              value: child.getAttribute("value") || child.textContent
            };
          });
        })
      );
  };

  format(result: TaglistItem): string {
    return result.text || result.value;
  }

  selectItem(event: NgbTypeaheadSelectItemEvent) {
    event.preventDefault();
    this.typeahead = "";
    if (event.item != null) {
      this.checked[event.item.value] = true;
    }
  }

  valueToCriteria(value: Array<string>) {
    return value.length === 0 ? null : value;
  }

  valueToRoute(value: Array<string>): string {
    return value.length === 0 ? null : value.join("!-!");
  }

  routeToValue(route: string) {
    const value = route == null ? [] : route.split(/\s*!-!\s*/g).filter(v => v !== "");
    value.forEach(key => {
      this.checked[key] = true;
    });
    return value;
  }

  toggleOmit(event: MouseEvent) {
    event.preventDefault();
    this.showOmit = !this.showOmit;
  }

  onDestroy() {
    this.filterCountSub.unsubscribe();
  }
}

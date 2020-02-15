import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from "@angular/core";
import { Subscription } from "rxjs";
import { HashMap } from "../options";
import { TranslationService, I18NParameter } from "./translation.service";

@Injectable()
@Pipe({
  name: "i18n",
  pure: false // required to update the value when the promise is resolved
})
export class I18nPipe implements PipeTransform, OnDestroy {
  value = "";
  lastKey: string;
  lastParams: Array<any>;

  onLangChange: Subscription;

  constructor(private translate: TranslationService, private _ref: ChangeDetectorRef) {}

  equals(o1: any, o2: any): boolean {
    if (o1 === o2) return true;
    if (o1 == null || o2 == null) return false;
    if (o1 !== o1 && o2 !== o2) return true; // NaN === NaN
    const t1 = typeof o1,
      t2 = typeof o2;
    let length: number, key: any, keySet: any;
    if (t1 === t2 && t1 === "object") {
      if (Array.isArray(o1)) {
        if (!Array.isArray(o2)) return false;
        if ((length = o1.length) === o2.length) {
          for (key = 0; key < length; key++) {
            if (!this.equals(o1[key], o2[key])) return false;
          }
          return true;
        }
      } else {
        if (Array.isArray(o2)) {
          return false;
        }
        keySet = Object.create(null);
        for (key in o1) {
          if (o1.hasOwnProperty(key)) {
            if (!this.equals(o1[key], o2[key])) {
              return false;
            }
            keySet[key] = true;
          }
        }
        for (key in o2) {
          if (!(key in keySet) && typeof o2[key] !== "undefined") {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  updateValue(key: string, interpolateParams?: I18NParameter, translations?: any) {
    const onTranslation = (res: string) => {
      this.value = res !== undefined ? res : key;
      this.lastKey = key;
      this._ref.markForCheck();
    };
    if (translations) {
      const res = this.translate.getParsedResult(translations, key, interpolateParams);
      if (typeof res.subscribe === "function") {
        res.subscribe(onTranslation);
      } else {
        onTranslation(res);
      }
    }
    this.translate.get(key, interpolateParams).subscribe(onTranslation);
  }

  transform(query: string, ...args: Array<any>): any {
    if (!query || query.length === 0) {
      return query;
    }

    // if we ask another time for the same key, return the last value
    if (this.equals(query, this.lastKey) && this.equals(args, this.lastParams)) {
      return this.value;
    }

    let interpolateParams: I18NParameter;
    if (args[0] != null && args.length) {
      if (Array.isArray(args[0]) || typeof args[0] === "object") {
        interpolateParams = args[0];
      } else {
        interpolateParams = args;
      }
    }

    // store the query, in case it changes
    this.lastKey = query;

    // store the params, in case they change
    this.lastParams = args;

    // set the value
    this.updateValue(query, interpolateParams);

    // if there is a subscription to onLangChange, clean it
    this._dispose();

    // subscribe to onLangChange event, in case the language changes
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onChangeLang.subscribe(translations => {
        if (this.lastKey) {
          this.lastKey = null; // we want to make sure it doesn't return the same value until it's been updated
          this.updateValue(query, interpolateParams, translations);
        }
      });
    }
    return this.value;
  }

  /**
   * Clean any existing subscription to change events
   */
  private _dispose(): void {
    if (typeof this.onLangChange !== "undefined") {
      this.onLangChange.unsubscribe();
      this.onLangChange = undefined;
    }
  }

  ngOnDestroy(): void {
    this._dispose();
  }
}

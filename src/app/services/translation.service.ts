import { Injectable } from "@angular/core";
import { HashMap } from "../options";
import { of, merge, BehaviorSubject } from "rxjs";
import { toArray, map } from "rxjs/operators";
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";

export class PluralStruct {
  NONE?: string;
  SINGULAR?: string;
  PLURAL?: string;
}
export type I18NParameter = Array<string | number>;
export type Language = "zh" | "en";
export type Translation = string | Function | PluralStruct;
export type TranslationData = {
  [lang in Language]?: HashMap<Translation>;
};

@Injectable({
  providedIn: "root"
})
export class TranslationService {
  data: TranslationData = {};
  templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;
  defaultLang: Language = "zh";
  currentLang: Language = "zh";
  useDefaultLang = false;
  languages: Array<Language> = ["zh", "en"];

  onChangeLang: BehaviorSubject<TranslationData> = new BehaviorSubject<TranslationData>({});

  constructor(private httpService: HttpClient, private cookieService: CookieService) {
    this.detectLanguage();
  }

  detectLanguage(): void {
    if (this.cookieService.check("lang") && this.use(this.cookieService.get("lang").substr(0, 2))) return;
    if ("languages" in navigator) {
      for (let index = 0; index < navigator.languages.length; index++) {
        if (this.use(navigator.languages[index].substr(0, 2))) break;
      }
    }
  }

  use(lang: string): boolean {
    if (this.languages.includes(lang as Language)) {
      this.currentLang = lang as Language;
      this.cookieService.set("lang", this.currentLang, 30, "/", undefined, true, "Strict");
      if (this.data[this.currentLang] == null) {
        this.httpService
          .get(`./assets/i18n/${this.currentLang}.json`)
          .toPromise()
          .then((json: HashMap<Translation>) => {
            this.data[this.currentLang] = json;
            this.onChangeLang.next(this.data[this.currentLang]);
          });
      } else {
        this.onChangeLang.next(this.data[this.currentLang]);
      }
      return true;
    } else {
      return false;
    }
  }

  interpolate(expr: Translation, params?: I18NParameter): string {
    if (expr == null) return "";
    if (typeof expr === "string") {
      return this.interpolateString(expr, params);
    } else if (typeof expr === "function") {
      return this.interpolateFunction(expr, params);
    } else if (typeof expr === "object") {
      return this.interpolateObject(expr, params);
    }
    // this should not happen, but an unrelated TranslateService test depends on it
    return expr as string;
  }

  private interpolateObject(obj: PluralStruct, params?: I18NParameter) {
    let expr = this.plural(
      typeof params !== "undefined" && typeof params[0] !== "undefined" ? params[0] : 0,
      obj.NONE,
      obj.SINGULAR,
      obj.PLURAL
    );
    if (expr == null) {
      if (obj.SINGULAR == null) {
        return params.toString();
      }
      expr = obj.SINGULAR;
    }
    return this.interpolateString(expr, params);
  }

  private interpolateFunction(fn: Function, params?: I18NParameter) {
    return fn(params);
  }

  private interpolateString(expr: string, params?: I18NParameter) {
    if (params == null || expr.indexOf("$") === -1) {
      return expr;
    }
    if (params.length > 1) {
      return this.strtr(
        expr,
        params.map((v, k: number) => "$" + (k + 1)).reverse(),
        params.map(v => v.toString()).reverse()
      );
    }
    const single = typeof params[0] !== "undefined" ? params[0] : "";
    return expr.replace(/\$1/g, single.toString());
  }

  getValue(target: any, key: string): string | Function | PluralStruct {
    const keys = key.split(".");
    key = "";
    do {
      key += keys.shift();
      if (target != null && target[key] != null && (typeof target[key] === "object" || !keys.length)) {
        target = target[key];
        key = "";
      } else if (!keys.length) {
        target = null;
      } else {
        key += ".";
      }
    } while (keys.length);
    return target;
  }

  plural(value: number | string, zero: string, one: string, more: string) {
    if (typeof value !== "number") {
      value = this.getFloat(value);
    }
    return value === 0 ? zero : value === 1 ? one : more;
  }

  getFloat(value: string): number {
    return Math.min(Math.max(parseFloat(value) || 0, -Number.MAX_VALUE), Number.MAX_VALUE);
  }

  strtr(str: string, from: Array<string>, to: Array<string>) {
    let ret = "";
    let match = false;

    const lenStr = str.length;
    const lenFrom = from.length;

    for (let i = 0; i < lenStr; i++) {
      match = false;
      let j = 0;
      for (; j < lenFrom; j++) {
        if (str.substr(i, from[j].length) === from[j]) {
          match = true;
          i += from[j].length - 1;
          break;
        }
      }
      ret += match ? to[j] : str.charAt(i);
    }

    return ret;
  }
  get(key: string, interpolateParams: I18NParameter) {
    if (typeof key === "undefined" || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    const res = this.getParsedResult(this.data[this.currentLang], key, interpolateParams);
    if (typeof res.subscribe === "function") {
      return res;
    } else {
      return of(res);
    }
  }

  getParsedResult(translations: any, key: string | Array<string>, interpolateParams: I18NParameter) {
    let res;
    if (Array.isArray(key)) {
      const result: any = {};
      let observables = false;
      for (const k of key) {
        result[k] = this.getParsedResult(translations, k, interpolateParams);
        if (typeof result[k].subscribe === "function") {
          observables = true;
        }
      }
      if (observables) {
        let mergedObs;
        for (const k of key) {
          const obs = typeof result[k].subscribe === "function" ? result[k] : of(/** @type {?} */ result[k]);
          if (typeof mergedObs === "undefined") {
            mergedObs = obs;
          } else {
            // tslint:disable-next-line: deprecation
            mergedObs = merge(mergedObs, obs);
          }
        }
        return mergedObs.pipe(
          toArray(),
          map((arr: Array<any>) => {
            const obj: HashMap<any> = {};
            arr.forEach((value, index) => {
              obj[key[index]] = value;
            });
            return obj;
          })
        );
      }
      return result;
    }
    if (translations) {
      res = this.interpolate(this.getValue(translations, key), interpolateParams);
    }
    if (
      typeof res === "undefined" &&
      this.defaultLang &&
      this.defaultLang !== this.currentLang &&
      this.useDefaultLang
    ) {
      res = this.interpolate(this.getValue(this.data[this.defaultLang], key), interpolateParams);
    }
    if (typeof res === "undefined") {
      /** @type {?} */
      const params = { key, translateService: this } as {
        key: string;
        translateService: TranslationService;
        interpolateParams?: I18NParameter;
      };
      if (typeof interpolateParams !== "undefined") {
        params.interpolateParams = interpolateParams;
      }
      res = "<" + key + ">";
    }
    return typeof res !== "undefined" ? res : key;
  }
}

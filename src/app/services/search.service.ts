import { Injectable } from "@angular/core";
import { ItemCriteria, Options } from "../options";
import { HttpClient } from "@angular/common/http";
// https://angular.aru.mi/?vocal=%E7%AF%89%E5%B1%B1%E3%81%95%E3%81%88&circle=Amateras%20Records!-!556%E3%83%9F%E3%83%AA%E3%83%A1%E3%83%BC%E3%83%88%E3%83%AB&region=%E6%97%A5%E6%9C%AC&time=199:505

interface SearchParam {
  criteria: ItemCriteria;
  mode: number;
}

function encodeProp(fieldName: string) {
  const code = Options.PropList.indexOf(fieldName);
  if (code === -1) return false;
  if (code > 51) return String.fromCharCode(code - 4);
  else if (code > 25) return String.fromCharCode(code + 71);
  return String.fromCharCode(code + 65);
}

class SearchResult {}
class Output {
  prop: Array<string>;
  para: Array<string> = [];
  quer = "";
  orde = "";
  sort = "";

  constructor(public tyid: number) {
    this.prop = Options.OutputFields[this.tyid][1];
  }
  checkField(fieldName: keyof ItemCriteria) {
    if (!this.prop.includes(fieldName)) return false;
    return encodeProp(fieldName);
  }
  addVal(code: string, value: Array<string>) {
    this.quer += code + "0" + value.join("\t") + "\n";
  }
  getInner() {
    if (this.quer !== "") return "{" + this.tyid + this.quer + "}";
    return "";
  }
  getOuter() {
    return this.quer;
  }
  getReqs() {
    return Options.OutputFields[this.tyid][2].map(encodeProp).join("");
  }
}

class SearchRequest {
  quer = "";
  reqs = "";
  sort = "";
  orde = "";
  hash = "";
  tota = -1;
  pred = "";
  toke = "";
  perp = 50;
  outp: Array<Output>;

  constructor(public mode: number) {
    this.pred = Options.OutputFields[mode][0];
    this.outp = [
      new Output(mode),
      ...Options.OutputFields.filter((_, k) => k !== this.mode).map((_, k) => new Output(k))
    ];
  }
  getQuery(criterion: ItemCriteria) {
    let fieldName: keyof ItemCriteria;
    for (fieldName in criterion) {
      if (criterion.hasOwnProperty(fieldName)) {
        const field = criterion[fieldName];
        if (field == null) continue;
        for (let type = 0; type < this.outp.length; type++) {
          const output = this.outp[type];
          const code = output.checkField(fieldName);
          if (code) {
            this.reqs += code;
            output.addVal(code, field);
            break;
          }
        }
      }
    }
    this.quer +=
      this.outp
        .filter((_, k) => k !== 0)
        .map(output => output.getInner())
        .join("") + this.outp[0].getOuter();
    if (this.quer !== "") {
      this.quer = this.quer.replace(/&/g, "%26");
      this.reqs = this.outp[0].getReqs() + this.reqs;
      this.sort = this.outp[0].sort;
      this.orde = this.outp[0].orde;
      this.tota = 0;
      this.hash =
        this.quer + "|" + this.reqs + "|" + this.pred + "|" + this.sort + "|" + this.orde + "|limit=" + this.perp;
      return true;
    }
    return false;
  }
  /*
  getFullQuery() {
    return {
      action: "uask",
      pre: this.pred,
      query: this.quer,
      result: this.reqs,
      token: this.toke,
      sort: this.sort,
      order: this.orde,
      limit: this.perp,
      offset: 0
    };
  }*/
}

@Injectable({
  providedIn: "root"
})
export class SearchService {
  lock = false;
  currentResult = "";

  constructor(private httpService: HttpClient) {}

  search({ criteria, mode }: SearchParam) {
    if (this.lock) return;
    this.lock = true;
    const req = new SearchRequest(mode);
    if (!req.getQuery(criteria)) {
      alert(Options["NoOption"]);
      this.lock = false;
    } else {
      //if ((this.currentResult = findResult(req)) !== false) this.currentResult.dump(0);
      //else {
      this.getTotal(req).then(request => {
        //this.curResult = new SearchResult(this);
        ///Resultlist.push(this.curResult);
        //this.curResult.post();
      });
      //}
    }
  }

  getTotal(request: SearchRequest) {
    //startQuery();
    return this.httpService
      .post(
        Options.Api,
        {},
        {
          responseType: "text",
          params: {
            action: "uask",
            pre: request.pred,
            query: request.quer,
            sort: request.sort
          }
        }
      )
      .toPromise()
      .then(result => {
        if (result !== "") {
          const param = result.split(" ");
          request.tota = parseInt(param[0] ?? "0", 10);
          request.toke = param[1] ?? "";
        } else request.tota = 0;
        return request;
      });
  }
}

function findResult(req: SearchRequest) {
  // 检查是否已查询过的查询
  //req = req.hash;
  //for ( var i = 0, len = Resultlist.length; i < len; ++i ) if ( Resultlist[i].hash == req ) return Resultlist[i];
  return false;
}

import { Injectable } from "@angular/core";
import { Options } from "../options";
import { HttpClient } from "@angular/common/http";
import { SearchRequest, SearchParam } from "../apis/search/search-request";
import { SearchResponse } from "../apis/search/search-response";
import { SearchResult } from "../apis/search/search-result";
// https://localhost:4200/?vocal=%E7%AF%89%E5%B1%B1%E3%81%95%E3%81%88&circle=Amateras%20Records!-!556%E3%83%9F%E3%83%AA%E3%83%A1%E3%83%BC%E3%83%88%E3%83%AB&region=%E6%97%A5%E6%9C%AC&time=199:505

@Injectable({
  providedIn: "root"
})
export class SearchService {
  lock = false;
  currentResult = "";

  constructor(private httpService: HttpClient) {}

  async createSearchRequest(searchParam: SearchParam) {
    if (this.lock) return;
    this.lock = true;
    const request = new SearchRequest(searchParam);
    if (!request.isValid()) {
      alert(Options.NoOption);
      this.lock = false;
    } else {
      this.lock = false;
      return request;
    }
  }

  async next(request: SearchRequest) {
    if (this.lock || !request.more) return;
    this.lock = true;
    try {
      const response = await this.getResult(request, request.limit, request.offset);
      request.offset += request.limit;
      request.more = response.more;
      this.lock = false;
      return new SearchResult(response);
    } catch (e) {
      this.lock = false;
      console.log(e);
    }
  }

  getResult(request: SearchRequest, limit = 50, offset = 0) {
    return this.httpService
      .post<SearchResponse>(
        `${Options.QueryApi}/${limit}/${offset}?origin=${encodeURIComponent(location.origin).replace(/\./g, "%2E")}`,
        JSON.stringify(request.criteria)
      )
      .toPromise();
  }

  getTotal(request: SearchRequest) {
    //startQuery();
    return this.httpService
      .post<SearchResponse>(Options.QueryApi, JSON.stringify(request.criteria))
      .toPromise()
      .then(result => {
        console.log(result.results.map(row => row.cover));
        /*if (result !== "") {
          const param = result.split(" ");
          request.tota = parseInt(param[0] ?? "0", 10);
          request.toke = param[1] ?? "";
        } else request.tota = 0;*/
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

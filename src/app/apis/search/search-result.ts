import { SearchResponse } from "./search-response";
import { Item } from "../../options";

export class SearchResult implements SearchResponse {
  count: number;
  hash: string;
  more: boolean;
  offset: number;
  prints: Array<string>;
  query: string;
  results: Array<Item>;
  serializer: string;
  time: number;
  version: number;

  constructor(response: SearchResponse) {
    this.count = response.count;
    this.hash = response.hash;
    this.more = response.more;
    this.offset = response.offset;
    this.prints = response.prints;
    this.query = response.query;
    this.results = response.results;
    this.serializer = response.serializer;
    this.time = response.time;
    this.version = response.version;
  }
}

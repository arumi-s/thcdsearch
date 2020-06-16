import { Item } from "../../options";

export interface SearchResponse {
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
}

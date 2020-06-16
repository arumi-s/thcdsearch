export type DataTypeid = "_wpg" | "_txt" | "_num" | "_dat" | "_pri" | "_dur" | "_lin";

export interface DataValue {
  _wpg: WpgValue;
  _txt: TxtValue;
  _num: NumValue;
  _dat: DatValue;
  _pri: PriValue;
  _dur: DurValue;
  _lin: LinValue;
}

export interface WpgValue {
  fulltext: string;
  fullurl: string;
  namespace: number;
  exists: boolean;
  displaytitle: string;
}
export type TxtValue = string;
export type NumValue = number;
export type DatValue = number;
export interface PriValue {
  value: number;
  unit: string;
}
export type DurValue = number;
export interface LinValue {
  url: string;
  alter: string;
}

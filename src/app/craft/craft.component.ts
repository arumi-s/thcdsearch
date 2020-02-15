import { Component, OnInit, Input, HostBinding, ElementRef } from "@angular/core";

export interface CraftTypeInfo {
  code: string;
  text: string;
  name?: string;
  color: string;
  color2?: string;
  list: Array<string>;
  cnlist: Array<string>;
}

// colors: https://materialuicolors.co/
export const CraftTypes = {
  A: {
    code: "A",
    text: "Attacker / Naval Bomber",
    color: "#3F51B5", // indigo
    color2: "#C5CAE9",
    cnlist: ["攻击机", "俯冲轰炸机", "鱼雷轰炸机"],
    list: ["Attacker", "Dive Bomber", "Torpedo Bomber"]
  } as CraftTypeInfo,
  B: {
    code: "B",
    text: "Bomber",
    color: "#795548", // brown
    color2: "#D7CCC8",
    cnlist: ["水平轰炸机", "战略轰炸机"],
    list: ["Horizontal Bomber", "Strategic Bomber"]
  } as CraftTypeInfo,
  C: {
    code: "C",
    text: "Cargo / Passenger",
    color: "#4CAF50", // green
    color2: "#C8E6C9",
    cnlist: ["运输机", "客机"],
    list: ["Cargo Plane", "Passenger Plane"]
  } as CraftTypeInfo,
  F: {
    code: "F",
    text: "Modern Jet",
    color: "#607D8B", // blue grey
    color2: "#CFD8DC",
    cnlist: ["现代喷气战斗机", "导弹喷气战斗机"],
    list: ["Modern Jet Fighter", "Missile Jet Fighter"]
  } as CraftTypeInfo,
  H: {
    code: "H",
    text: "Mixed-Power",
    color: "#FF5722", // deep orange
    color2: "#FFCCBC",
    cnlist: ["混合动力战斗机", "螺旋桨喷气混动战斗机"],
    list: ["Mixed-Power Fighter", "Propeller-Jet Hybrid Fighter"]
  } as CraftTypeInfo,
  J: {
    code: "J",
    text: "Early Jet",
    color: "#F44336", // red
    color2: "#FFCDD2",
    cnlist: ["早期喷气战斗机"],
    list: ["Early Jet Fighter"]
  } as CraftTypeInfo,
  P: {
    code: "P",
    text: "Propeller",
    color: "#FFEB3B", // yellow
    color2: "#FFF9C4",
    cnlist: ["螺旋桨战斗机", "活塞战斗机"],
    list: ["Propeller Fighter", "Piston Engine Fighter"]
  } as CraftTypeInfo,
  S: {
    code: "S",
    text: "Reconnaissance / Early Warning",
    color: "#9C27B0", // purple
    color2: "#E1BEE7",
    cnlist: ["侦察机", "观测机", "预警机"],
    list: ["Reconnaissance Aircraft", "Surveillance Aircraft", "Airborne Early Warning"]
  } as CraftTypeInfo,
  U: {
    code: "U",
    text: "Unmanned Aerial Vehicle",
    color: "#252525", // black
    color2: "#d6d6d6",
    cnlist: ["无人机"],
    list: ["Unmanned Aerial Vehicle"]
  } as CraftTypeInfo,
  V: {
    code: "V",
    text: "Helicopter",
    color: "#03A9F4", // light blue
    color2: "#B3E5FC",
    cnlist: ["直升机"],
    list: ["Helicopter"]
  } as CraftTypeInfo,
  X: {
    code: "X",
    text: "Unconventional Propulsion",
    color: "#E91E63", // pink
    color2: "#F8BBD0",
    cnlist: ["火箭动力战斗机", "核动力战斗机", "非传统动力战斗机"],
    list: ["Rocket-Powered Fighter", "Nuclear-Powered Fighter", "Unconventional Propulsion Fighter"]
  } as CraftTypeInfo
};
export type CraftType = keyof typeof CraftTypes;

let key: CraftType;
for (key in CraftTypes) {
  if (CraftTypes.hasOwnProperty(key)) {
    CraftTypes[key].name = CraftTypes[key].code + " " + CraftTypes[key].text;
  }
}

export interface Craft {
  designation: string;
  thumb: string;
  code: CraftType;
  number: number;
  variant: string;
  name: string;
  cnname: string;
  note: string;
  origin: string;
  year: number;
  file: string;
  rating: number;
  subtype: string;
  info: CraftInfo;
}
export interface CraftEngineInfo {
  count: number;
  name: string;
}
export interface CraftWeaponInfo {
  count: number;
  name: string;
  weight: number;
}
export interface CraftInfo {
  role: Array<string>;
  part: Array<string>;

  length: number;
  width: number;
  height: number;

  mass: number;
  crew: number;
  cargo: number;

  burst_mass: number;
  payload_mass: number;
  payload_type: Array<string>;
  gun: Array<CraftWeaponInfo>;
  turret: Array<CraftWeaponInfo>;
  missile: Array<CraftWeaponInfo>;
  bomb: Array<CraftWeaponInfo>;
  rocket: Array<CraftWeaponInfo>;
  torpedo: Array<CraftWeaponInfo>;
  laser: Array<CraftWeaponInfo>;

  radar: Array<CraftWeaponInfo>;
  cm: Array<string>;

  engine: Array<CraftEngineInfo>;
  engine_type: Array<string>;
  electric_engine: Array<CraftEngineInfo>;
  rocket_engine: Array<CraftEngineInfo>;
  propeller_engine: Array<CraftEngineInfo>;
  jet_engine: Array<CraftEngineInfo>;
  nuclear_engine: Array<CraftEngineInfo>;
  gimbal: string;

  carrier_capable: boolean;
  carrier: Array<string>;
}

export type CraftField = keyof Craft;

export type CraftCriteria = {
  [field in CraftField]?: Array<string>;
};

@Component({
  selector: "craft",
  templateUrl: "./craft.component.html",
  styleUrls: ["./craft.component.less"]
})
export class CraftComponent implements OnInit {
  ngOnInit() {}
}

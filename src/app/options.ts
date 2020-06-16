import { DataValue } from "./apis/smw/data-types";

export enum OutputType {
  Album = 0,
  Track = 1,
  Circle = 2
}
export type InputType = "range" | "mltor" | "dropd" | "sgnot" | "price" | "durat";
export interface InputOption<T> {
  id: ItemField;
  type: InputType;
  content: T;
}
export interface InputContentRange {
  min: number;
  minDefault: string;
  max: number;
  maxDefault: string;
}
export interface InputContentMltor {
  suggestList: string;
}
export interface InputContentDropd {
  options: Array<string>;
}

export interface HashMap<T> {
  [hash: string]: T;
}

export interface ItemPropTypeid {
  self: "_wpg";
  circle: "_wpg";
  date: "_dat";
  type: "_wpg";
  time: "_dur";
  ogmusic: "_wpg";
  ogmusicno: "_num";
  noth: "_wpg";
  ogwork: "_wpg";
  ogworkno: "_num";
  original: "_wpg";
  arrange: "_wpg";
  vocal: "_wpg";
  lyric: "_wpg";
  compose: "_wpg";
  script: "_wpg";
  dub: "_wpg";
  perform: "_wpg";
  name: "_txt";
  discno: "_num";
  trackno: "_num";
  alname: "_txt";
  event: "_wpg";
  year: "_num";
  rate: "_txt";
  number: "_txt";
  disc: "_num";
  track: "_num";
  property: "_txt";
  style: "_txt";
  only: "_txt";
  price: "_pri";
  eventprice: "_pri";
  shopprice: "_pri";
  cover: "_wpg";
  official: "_lin";
  shop: "_lin";
  coverchar: "_wpg";
  region: "_txt";
  establish: "_num";
  work: "_txt";
  state: "_txt";
}

export type ItemField = keyof ItemPropTypeid;

export type Item = {
  id: string;
  self: DataValue[ItemPropTypeid["self"]];
} & {
  [field in ItemField]?: Array<DataValue[ItemPropTypeid[field]]>;
};

export type ItemCriteria = {
  [field in ItemField]?: Array<string>;
};

export namespace Options {
  // 设定主要参数
  export const Api = "https://thwiki.cc/rest/asktrack/v0"; // 搜寻器Api地址
  export const SuggestApi = "https://thwiki.cc/ajax.php"; // 输入建议Api根地址
  export const Sort = ["a", "d"]; // 设定允许的排序值
  export const Currency = ["日元", "人民币", "韩圆", "新台币", "港币", "美元", "港元", "英镑", "波兰兹罗提"]; // 设定可选取的货币列表
  export const NoOption = "请定义至少一个筛选条件"; // 设定没有提交任何合法搜索条件时的提示文字
  export const NoConnect = "连接出错"; // 设定链接Api出错时的提示文字
  export const NoResult = "请检查是否输入了多余的字符或是使用了未实装的条件，仍然不行的话可以试试减少搜索条件"; // 设定搜索结果为空时的提示文字
  export const SidebarSpeed = 300; // 设定侧选项栏显示隐藏速度
  export const Speed = 400; // 设定输入栏显示隐藏速度

  export const ExtraCriteria: ItemCriteria = {
    // 设定查询结果固定请求的属性
    name: [],
    alname: null,
    circle: null,
    time: null,
    arrange: null,
    vocal: null,
    lyric: null,
    ogmusic: null,
    discno: null,
    trackno: null,
    ogwork: null,
    cover: null
  };

  export const Inputs: Array<InputOption<any>> = [
    // 设定属性对应的类
    // 设定类型为范围的属性
    {
      id: "establish",
      type: "range",
      content: { min: 1970, minDefault: "2012", max: 2032, maxDefault: "2015" }
    },
    {
      id: "year",
      type: "range",
      content: { min: 1970, minDefault: "2012", max: 2032, maxDefault: "2015" }
    },
    {
      id: "disc",
      type: "range",
      content: { min: 1, minDefault: "1", max: 99, maxDefault: "2" }
    },
    {
      id: "track",
      type: "range",
      content: { min: 1, minDefault: "6", max: 500, maxDefault: "12" }
    },
    {
      id: "ogmusicno",
      type: "range",
      content: { min: 1, minDefault: "1", max: 500, maxDefault: "6" }
    },
    {
      id: "ogworkno",
      type: "range",
      content: { min: 1, minDefault: "1", max: 500, maxDefault: "6" }
    },

    // 设定类型为允许多值的属性
    {
      id: "event",
      type: "mltor",
      content: { suggestList: "发售展会建议" }
    },
    {
      id: "circle",
      type: "mltor",
      content: { suggestList: "制作方建议" }
    },
    { id: "number", type: "mltor", content: { suggestList: "" } },
    {
      id: "ogmusic",
      type: "mltor",
      content: { suggestList: "曲目原曲建议" }
    },
    {
      id: "ogwork",
      type: "mltor",
      content: { suggestList: "曲目来源建议" }
    },
    {
      id: "style",
      type: "mltor",
      content: { suggestList: "风格类型建议" }
    },
    {
      id: "arrange",
      type: "mltor",
      content: { suggestList: "编曲建议" }
    },
    {
      id: "vocal",
      type: "mltor",
      content: { suggestList: "演唱建议" }
    },
    {
      id: "lyric",
      type: "mltor",
      content: { suggestList: "作词建议" }
    },
    {
      id: "compose",
      type: "mltor",
      content: { suggestList: "作曲建议" }
    },
    {
      id: "script",
      type: "mltor",
      content: { suggestList: "剧本建议" }
    },
    {
      id: "dub",
      type: "mltor",
      content: { suggestList: "配音建议" }
    },
    {
      id: "coverchar",
      type: "mltor",
      content: { suggestList: "封面角色建议" }
    },

    // 设定类型为允许非的属性
    {
      id: "region",
      type: "dropd",
      content: {
        options: ["日本", "中国", "韩国", "台湾", "美国", "英国", "德国", "澳大利亚"]
      }
    },
    {
      id: "work",
      type: "dropd",
      content: {
        options: ["同人音乐", "同人游戏", "同人志", "同人动画", "周边", "其他"]
      }
    },
    {
      id: "state",
      type: "dropd",
      content: { options: ["活动", "休止", "解散"] }
    },
    {
      id: "property",
      type: "dropd",
      content: {
        options: ["单曲", "Demo", "合作", "精选集", "B面", "盒装", "Live", "混音集", "原声集", "印象集"]
      }
    },
    {
      id: "rate",
      type: "dropd",
      content: { options: ["R18", "R15", "一般向"] }
    },
    {
      id: "only",

      type: "sgnot",
      content: { type: "text", placeholder: "东方红魔乡" }
    },
    {
      id: "type",
      type: "dropd",
      content: {
        options: ["Arrange", "Vocal", "再编曲", "翻唱", "配音", "合唱", "纯东方", "混合"]
      }
    },
    { id: "noth", type: "dropd", content: { options: ["非东方"] } },
    { id: "original", type: "dropd", content: { options: ["原创"] } },

    // 设定类型为价格的属性
    { id: "price", type: "price", content: false },
    { id: "eventprice", type: "price", content: false },
    { id: "shopprice", type: "price", content: false },

    // 设定类型为时间范围的属性
    {
      id: "date",
      type: "durat",
      content: [
        { type: "date", placeholder: "2009-01-01" },
        { type: "date", placeholder: "2010-01-01" }
      ]
    },
    {
      id: "time",
      type: "durat",
      content: [
        {
          type: "text",
          class: "Duration",
          maxlength: "12",
          placeholder: "20:00"
        },
        {
          type: "text",
          class: "Duration",
          maxlength: "12",
          placeholder: "40:00"
        }
      ]
    }
  ];

  export const SwitchConf = {
    // 设定转换按钮的内容
    modeval: ["and", "or", "n"],
    sortval: ["", "d", "a"],
    notval: ["", "n"],
    rangeval: ["to", "pm"]
  };

  export const ItemConf: { [key in ItemField]?: string } =
    // 设定查询结果显示属性名称
    {
      region: "社团地区",
      establish: "社团成立",
      work: "社团作品",
      state: "社团状态",
      event: "首发展会",
      date: "首发日期",
      year: "发布年份",
      number: "专辑编号",
      circle: "制作社团",
      price: "专辑价格",
      eventprice: "会场售价",
      shopprice: "通贩售价",
      disc: "专辑碟数",
      track: "专辑轨数",
      //'time' : '曲目时长',
      property: "专辑属性",
      rate: "专辑分级",
      only: "专辑选材",
      style: "专辑风格",
      type: "曲目类型",
      ogmusic: "使用原曲",
      ogwork: "原曲出处",
      noth: "非东方曲",
      original: "原创曲",
      arrange: "编曲",
      lyric: "作词",
      compose: "作曲",
      vocal: "演唱",
      script: "剧本",
      dub: "配音",
      coverchar: "封面角色"
    };
}

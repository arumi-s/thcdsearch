export enum OutputType {
  Album = 0,
  Track = 1,
  Circle = 2
}
export type InputType = "range" | "mltor" | "dropd" | "sgnot" | "price" | "durat";
export interface InputOption<T> {
  id: string;
  name: string;
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

export interface Item {
  event: Array<string>;
  circle: Array<string>;
  date: Array<string>;
  year: Array<string>;
  rate: Array<string>;
  number: Array<string>;
  disc: Array<string>;
  track: Array<string>;
  time: Array<string>;
  property: Array<string>;
  style: Array<string>;
  only: Array<string>;
  price: Array<string>;
  eventprice: Array<string>;
  shopprice: Array<string>;
  type: Array<string>;
  ogmusic: Array<string>;
  ogmusicno: Array<string>;
  noth: Array<string>;
  ogwork: Array<string>;
  ogworkno: Array<string>;
  original: Array<string>;
  arrange: Array<string>;
  vocal: Array<string>;
  lyric: Array<string>;
  compose: Array<string>;
  script: Array<string>;
  dub: Array<string>;
  perform: Array<string>;
  alname: Array<string>;
  name: Array<string>;
  discno: Array<string>;
  trackno: Array<string>;
  region: Array<string>;
  establish: Array<string>;
  work: Array<string>;
  state: Array<string>;
  cover: Array<string>;
  coverchar: Array<string>;
}
export type ItemField = keyof Item;

export type ItemCriteria = {
  [field in ItemField]?: Array<string>;
};

export const Options = {
  // 设定主要参数
  Api: "https://thwiki.cc/api.php", // 搜寻器Api根地址
  SApi: "https://thwiki.cc/ajax.php", // 输入建议Api根地址
  CommonLimit: 12, // 设定常用项目列表内最大项目数量
  Sort: ["a", "d"], // 设定允许的排序值
  Currency: ["日元", "人民币", "韩圆", "新台币", "港币", "美元", "港元", "英镑", "波兰兹罗提"], // 设定可选取的货币列表
  NoOption: "请定义至少一个筛选条件", // 设定没有提交任何合法搜索条件时的提示文字
  NoConnect: "连接出错", // 设定链接Api出错时的提示文字
  NoResult: "请检查是否输入了多余的字符或是使用了未实装的条件，仍然不行的话可以试试减少搜索条件", // 设定搜索结果为空时的提示文字
  SidebarSpeed: 300, // 设定侧选项栏显示隐藏速度
  Speed: 400, // 设定输入栏显示隐藏速度

  OutputFields: [
    // 设定各类查询结果允许的属性
    [
      "专辑",
      [
        "event",
        "circle",
        "date",
        "year",
        "rate",
        "number",
        "disc",
        "track",
        "time",
        "property",
        "style",
        "only",
        "price",
        "eventprice",
        "shopprice",
        "cover",
        "coverchar"
      ],
      ["alname", "event", "circle", "date", "time", "track", "number", "cover"]
    ],
    [
      "曲目",
      [
        "circle",
        "type",
        "time",
        "ogmusic",
        "ogmusicno",
        "noth",
        "ogwork",
        "ogworkno",
        "original",
        "arrange",
        "vocal",
        "lyric",
        "compose",
        "script",
        "dub"
      ],
      [
        "alname",
        "name",
        "circle",
        "time",
        "arrange",
        "vocal",
        "lyric",
        "ogmusic",
        "discno",
        "trackno",
        "ogwork",
        "cover"
      ]
    ],
    ["社团", ["region", "establish", "work", "state"], ["region", "establish", "work", "state"]]
  ] as Array<[string, Array<string>, Array<string>]>,

  Inputs: [
    // 设定属性对应的类
    // 设定类型为范围的属性
    {
      id: "establish",
      name: "",
      type: "range",
      content: { min: 1970, minDefault: "2012", max: 2020, maxDefault: "2015" }
    },
    {
      id: "year",
      name: "",
      type: "range",
      content: { min: 1970, minDefault: "2012", max: 2020, maxDefault: "2015" }
    },
    {
      id: "disc",
      name: "",
      type: "range",
      content: { min: 1, minDefault: "1", max: 99, maxDefault: "2" }
    },
    {
      id: "track",
      name: "",
      type: "range",
      content: { min: 1, minDefault: "6", max: 500, maxDefault: "12" }
    },
    {
      id: "ogmusicno",
      name: "",
      type: "range",
      content: { min: 1, minDefault: "1", max: 500, maxDefault: "6" }
    },
    {
      id: "ogworkno",
      name: "",
      type: "range",
      content: { min: 1, minDefault: "1", max: 500, maxDefault: "6" }
    },

    // 设定类型为允许多值的属性
    {
      id: "event",
      name: "",
      type: "mltor",
      content: { suggestList: "发售展会建议" }
    },
    {
      id: "circle",
      name: "",
      type: "mltor",
      content: { suggestList: "制作方建议" }
    },
    { id: "number", name: "", type: "mltor", content: { suggestList: "" } },
    {
      id: "ogmusic",
      name: "",
      type: "mltor",
      content: { suggestList: "曲目原曲建议" }
    },
    {
      id: "ogwork",
      name: "",
      type: "mltor",
      content: { suggestList: "曲目来源建议" }
    },
    {
      id: "style",
      name: "",
      type: "mltor",
      content: { suggestList: "风格类型建议" }
    },
    {
      id: "arrange",
      name: "",
      type: "mltor",
      content: { suggestList: "编曲建议" }
    },
    {
      id: "vocal",
      name: "",
      type: "mltor",
      content: { suggestList: "演唱建议" }
    },
    {
      id: "lyric",
      name: "",
      type: "mltor",
      content: { suggestList: "作词建议" }
    },
    {
      id: "compose",
      name: "",
      type: "mltor",
      content: { suggestList: "作曲建议" }
    },
    {
      id: "script",
      name: "",
      type: "mltor",
      content: { suggestList: "剧本建议" }
    },
    {
      id: "dub",
      name: "",
      type: "mltor",
      content: { suggestList: "配音建议" }
    },
    {
      id: "coverchar",
      name: "",
      type: "mltor",
      content: { suggestList: "封面角色建议" }
    },

    // 设定类型为允许非的属性
    {
      id: "region",
      name: "",
      type: "dropd",
      content: {
        options: ["日本", "中国", "韩国", "台湾", "美国", "英国", "德国", "澳大利亚"]
      }
    },
    {
      id: "work",
      name: "",
      type: "dropd",
      content: {
        options: ["同人音乐", "同人游戏", "同人志", "同人动画", "周边", "其他"]
      }
    },
    {
      id: "state",
      name: "",
      type: "dropd",
      content: { options: ["活动", "休止", "解散"] }
    },
    {
      id: "property",
      name: "",
      type: "dropd",
      content: {
        options: ["单曲", "Demo", "合作", "精选集", "B面", "盒装", "Live", "混音集", "原声集", "印象集"]
      }
    },
    {
      id: "rate",
      name: "",
      type: "dropd",
      content: { options: ["R18", "R15", "一般向"] }
    },
    {
      id: "only",
      name: "",
      type: "Sgnot",
      content: { type: "text", placeholder: "东方红魔乡" }
    },
    {
      id: "type",
      name: "",
      type: "dropd",
      content: {
        options: ["Arrange", "Vocal", "再编曲", "翻唱", "配音", "合唱", "纯东方", "混合"]
      }
    },
    { id: "noth", name: "", type: "dropd", content: { options: ["非东方"] } },
    { id: "original", name: "", type: "dropd", content: { options: ["原创"] } },

    // 设定类型为价格的属性
    { id: "price", name: "", type: "price", content: false },
    { id: "eventprice", name: "", type: "price", content: false },
    { id: "shopprice", name: "", type: "price", content: false },

    // 设定类型为时间范围的属性
    {
      id: "date",
      name: "",
      type: "durat",
      content: [
        { type: "date", placeholder: "2009-01-01" },
        { type: "date", placeholder: "2010-01-01" }
      ]
    },
    {
      id: "time",
      name: "",
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
  ] as Array<InputOption<any>>,

  PropList: [
    // 设定所有可作为输出的属性，必须与服务器端一致
    "event",
    "circle",
    "date",
    "year",
    "rate",
    "number",
    "disc",
    "track",
    "time",
    "property",
    "style",
    "only",
    "price",
    "eventprice",
    "shopprice",
    "type",
    "ogmusic",
    "ogmusicno",
    "noth",
    "ogwork",
    "ogworkno",
    "original",
    "arrange",
    "vocal",
    "lyric",
    "compose",
    "script",
    "dub",
    "perform",
    "alname",
    "name",
    "discno",
    "trackno",
    "region",
    "establish",
    "work",
    "state",
    "cover",
    "coverchar"
  ],

  CommonConf: {
    // 设定常用项目列表预设计数
    circle: 6,
    ogmusic: 6,
    arrange: 5,
    vocal: 5,
    event: 3,
    time: 3,
    coverchar: 4,
    type: 1,
    property: 1
  },

  SwitchConf: {
    // 设定转换按钮的内容
    modeval: ["and", "or", "n"],
    sortval: ["", "d", "a"],
    notval: ["", "n"],
    rangeval: ["to", "pm"]
  },

  ItemConf: [
    // 设定各类查询结果显示属性名称
    {
      region: "社团地区",
      establish: "社团成立",
      work: "社团作品",
      state: "社团状态",
      //'event' : '首发展会',
      //'date' : '首发日期',
      year: "发布年份",
      number: "专辑编号",
      circle: "制作社团",
      price: "发售价格",
      eventprice: "会场售价",
      shopprice: "通贩售价",
      disc: "碟数",
      track: "音轨数",
      //'time' : '总时长',
      property: "专辑属性",
      rate: "分级指定",
      only: "特定选材",
      style: "风格类型",
      type: "曲目类型",
      ogmusic: "曲目原曲",
      ogwork: "曲目出处",
      noth: "含非东方",
      original: "含原创曲",
      arrange: "曲目编曲",
      lyric: "曲目作词",
      compose: "曲目作曲",
      vocal: "曲目演唱",
      script: "曲目剧本",
      dub: "曲目配音",
      coverchar: "封面角色"
    },
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
    },
    {
      region: "所在地区",
      establish: "成立年份",
      work: "作品类别",
      state: "活动状态",
      event: "新谱展会",
      date: "新谱日期",
      year: "新谱年份",
      number: "专辑编号",
      circle: "合作社团",
      price: "专辑价格",
      eventprice: "会场售价",
      shopprice: "通贩售价",
      disc: "专辑碟数",
      track: "专辑轨数",
      time: "专辑时长",
      property: "专辑属性",
      rate: "专辑分级",
      only: "专辑选材",
      style: "专辑风格",
      type: "曲目类型",
      ogmusic: "曲目原曲",
      ogwork: "曲目出处",
      //'noth' : '非东方曲',
      //'original' : '原创曲',
      arrange: "曲目编曲",
      lyric: "曲目作词",
      compose: "曲目作曲",
      vocal: "曲目演唱",
      script: "曲目剧本",
      dub: "曲目配音",
      coverchar: "封面角色"
    }
  ] as Array<{ [key in ItemField]: string }>,

  JoinConf: {
    // 设定多值属性连接符
    disc: ",",
    track: ",",
    time: ","
  }
};

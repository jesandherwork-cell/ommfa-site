// ============================================
// OMMFA Journal 期目录
//
// 两种条目类型：
//
// A) 翻书型（默认，不写 render 字段）
//    1. 建文件夹 assets/images/journal/<id>/
//    2. 放封面 cover.webp（列表卡片 + 合着的书都用它）
//    3. 建子文件夹 pages/，放内页 01.jpg 02.jpg ...（全小写）
//
// B) 独立页面型（render: "page"）
//    1. 建文件 journal/<id>.html（照抄 journal/ZTemplate.html）
//    2. 建文件夹 assets/images/journal/<id>/，放封面 cover.webp
//    3. id 必须是 kebab-case（全小写、连字符），因为它同时是文件名和网址
//    4. 记得往 sitemap.xml 加一行
//
// 字段:
// - id:     标识。翻书型 = 图片文件夹名；独立页面型 = 文件名（不带 .html）
// - title:  标题
// - year:   年份（排序用）
// - type:   "Artist" / "Art" / "Exhibition"（筛选用，必须是这三个之一）
// - render: 省略 = 翻书；"page" = 跳转 journal/<id>.html
// - pages:  【仅翻书型】pages 文件夹里内页的数量（不含 cover）
// - ratio:  【仅翻书型】书页的"高 ÷ 宽"比例（可省略，默认 1.414 = A4 竖版）
//           正方形填 1，4:3 竖版填 1.333，横向宽幅填 0.5625
//           一本书内所有页用同一比例；不同书之间可以不同
// ============================================

const JOURNAL = [
  {
    id: "sisyphus-timesheets",
    title: "Can Art Still Act as an Escape When Sisyphus Starts Filing Timesheets?",
    year: 2026,
    type: "Exhibition",
    render: "page"
  },
  {
    id: "exit-programme-v0101",
    title: "Exit Programme V01.01",
    year: 2021,
    type: "Art",
    render: "page"
  }
];

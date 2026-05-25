// ============================================
// OMMFA Journal 期目录
// 每发一期 = 在数组里加一个对象,然后:
//   1. 建文件夹 assets/images/journal/<id>/
//   2. 放封面 cover.jpg(列表卡片 + 合着的书都用它)
//   3. 建子文件夹 pages/,放内页 01.jpg 02.jpg ...(全小写)
//
// 字段:
// - id:     期号标识,对应图片文件夹名
// - title:  期标题
// - year:   年份(排序用)
// - type:   "Artist" / "Art" / "Exhibition"(筛选用)
// - pages:  pages 文件夹里内页的数量(不含 cover)
// - ratio:  书页的"高 ÷ 宽"比例(可省略,默认 1.414 = A4 竖版)
//           正方形填 1,4:3 竖版填 1.333,横向宽幅填 0.5625
//           一本书内所有页用同一比例;不同书之间可以不同
// ============================================

const JOURNAL = [
  {
    id: "Exit Programme-V0101",
    title: "Exit Programme-V0101",
    year: 2021,
    type: "Art",
    pages: 13,          // 你 pages 文件夹里有 01–08 共 8 张
    ratio: 1.414       // A4 竖版
  }
];
// ============================================
// OMMFA 项目数据库
// 以后加新项目，在这个数组里加一个对象就行
// 
// 字段说明：
// - id: 项目英文标识，会用作项目页文件名（projects/xxx.html）
// - title: 项目标题（显示给观众看的）
// - year: 年份
// - category: 项目属于哪个主导航 — "thread" / "edition" / "artist"
// - thread: 子分类（只有category=thread时有意义）— "everyday" / "distributed" / "critical"
// - cover: 封面图路径（之后填，现在留 null）
// ============================================

const PROJECTS = [
  {
    id: "subway-100",
    title: "100 Things to Do on the Subway",
    year: 2020,
    category: "thread",
    thread: "exhibition",
  },
  {
    id: "abandon-art",
    title: "Abandon Art",
    year: 2021,
    category: "thread",
    thread: "exhibition",
  },

  {
    id: "infp-breakfast",
    title: "INFP Breakfast Club",
    year: 2023,
    category: "thread",
    thread: "event",
  },


  {
    id: "edinburgh-fringe",
    title: "Edinburgh Fringe",
    year: 2025,
    category: "thread",
    thread: "event",
  },

  {
    id: "the-wrong-biennale",
    title: "The Wrong Biennale",
    year: 2025,
    category: "thread",
    thread: "exhibition",
    
  },
  
   {
    id: "maskpark-16-august",
    title: "MaskPark 16 August",
    year: 2025,
    category: "thread",
    thread: "event",
  },

  {
    id: "london-design-festival-2026",
    title: "London Design Festival",
    year: 2026,
    category: "thread",
    thread: "opencall",
  },


];
// ============================================
// Threads 页：渲染、筛选、排序
// ============================================

let currentFilter = "all";              // 当前筛选状态
let currentSort = "time-desc";          // 当前排序：time-desc 倒序 / time-asc 升序 / random 随机

const grid = document.getElementById("project-grid");

// 重新渲染网格
function render() {
  // 1. 只取属于 thread 类别的项目
  let items = PROJECTS.filter(p => p.category === "thread");
  
  // 2. 按子分类筛选
  if (currentFilter !== "all") {
    items = items.filter(p => p.thread === currentFilter);
  }
  
  // 3. 排序
  if (currentSort === "time-desc") {
    items.sort((a, b) => b.year - a.year);          // 新→旧
  } else if (currentSort === "time-asc") {
    items.sort((a, b) => a.year - b.year);          // 旧→新
  } else if (currentSort === "random") {
    items.sort(() => Math.random() - 0.5);          // 洗牌
  }
  
  // 4. 生成卡片 HTML
grid.innerHTML = items.map(p => `
  <a class="card" href="projects/${p.id}.html">
    <div class="card-cover" style="background-image: url('assets/images/threads/${p.id}/cover.webp')"></div>
    <div class="card-meta">
      <span class="card-title">${p.title}</span>
      <span class="card-year">${p.year}</span>
    </div>
  </a>
`).join("");
}

// 筛选按钮：点击切换
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// 排序按钮：By time 切换升降序，Random 直接洗牌
document.querySelectorAll(".sort-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const sortType = btn.dataset.sort;
    if (sortType === "time") {
      currentSort = currentSort === "time-desc" ? "time-asc" : "time-desc";
      const arrow = btn.querySelector(".sort-arrow");
      arrow.textContent = currentSort === "time-desc" ? "↓" : "↑";
    } else if (sortType === "random") {
      currentSort = "random";
    }
    document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

// 页面加载完成时，先渲染一次
render();
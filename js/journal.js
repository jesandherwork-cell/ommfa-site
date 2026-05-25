// ============================================
// Journal 列表页:渲染、筛选、排序
// 数据源:js/journal-entries.js 里的 JOURNAL 数组
// 卡片点击不跳转,而是打开翻书器遮罩
// ============================================

let currentFilter = "all";
let currentSort = "time-desc";

const grid = document.getElementById("project-grid");

function render() {
  let items = JOURNAL.slice();

  if (currentFilter !== "all") {
    items = items.filter(j => j.type === currentFilter);
  }

  if (currentSort === "time-desc") {
    items.sort((a, b) => b.year - a.year);
  } else if (currentSort === "time-asc") {
    items.sort((a, b) => a.year - b.year);
  } else if (currentSort === "random") {
    items.sort(() => Math.random() - 0.5);
  }

  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-state">No journal entries yet. Coming soon.</p>`;
    return;
  }

  // href 写成 #id 只是为了卡片可点击/可右键;真正行为由下面 JS 拦截
  grid.innerHTML = items.map(j => `
    <a class="card" href="#${j.id}" data-journal-id="${j.id}">
      <div class="card-cover" style="background-image: url('assets/images/journal/${j.id}/cover.webp')"></div>
      <div class="card-meta">
        <span class="card-title">${j.title}</span>
        <span class="card-year">${j.year}</span>
      </div>
    </a>
  `).join("");
}

// 拦截卡片点击 → 打开翻书器
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  e.preventDefault();
  const id = card.dataset.journalId;
  if (window.openFlipbook) window.openFlipbook(id);
});

// 筛选按钮
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    render();
  });
});

// 排序按钮
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

render();
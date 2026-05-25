// ============================================
// Artist 列表页:渲染 + 搜索
// 卡片点击不跳转,而是打开档案袋遮罩
// ============================================

const grid = document.getElementById("artist-grid");
const searchInput = document.getElementById("search-input");

let currentSearch = "";

function render() {
  let items = ARTISTS;
  if (currentSearch.trim() !== "") {
    const keyword = currentSearch.toLowerCase();
    items = ARTISTS.filter(a =>
      a.name.toLowerCase().includes(keyword) ||
      (a.city && a.city.toLowerCase().includes(keyword)) ||
      (a.bio  && a.bio.toLowerCase().includes(keyword))
    );
  }

  if (items.length === 0) {
    grid.innerHTML = `<p class="empty-state">No artists found.</p>`;
    return;
  }

  // href 写成 ?id=xxx 是为了:用户可以右键"在新标签页打开"、可以复制链接
  // 真正的点击行为我们用 JS 拦截,见下面 grid.addEventListener
  grid.innerHTML = items.map(a => `
    <a class="card" href="?id=${a.id}" data-artist-id="${a.id}">
      <div class="card-cover" style="background-image: url('assets/images/artist/${a.id}/cover.webp')"></div>
      <div class="card-meta">
        <span class="card-title">${a.name}</span>
      </div>
    </a>
  `).join("");
}

// 拦截卡片点击 — 不跳转,改成打开档案袋
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  e.preventDefault();
  const id = card.dataset.artistId;
  if (window.openEnvelope) window.openEnvelope(id);
});

// 搜索
searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  render();
});

render();
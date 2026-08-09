// ============================================
// Artist 列表页：渲染 + 搜索 + 排序
// 卡片点击不跳转，而是打开档案袋遮罩
// ============================================

const grid = document.getElementById("artist-grid");
const searchInput = document.getElementById("search-input");
const sortBtns = document.querySelectorAll(".sort-btn");
const availableBtn = document.getElementById("available-btn");
let onlyAvailable = false;

let currentSearch = "";
let currentSort = "random";        // "az" | "random"

// Random 的顺序在切走再切回来时要保持不变，否则每敲一个搜索字符就重排一次
let randomOrder = null;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function render() {
  let items = ARTISTS;

  if (onlyAvailable) items = items.filter(a => a.available);

  // ---- 先过滤 ----
  const keyword = currentSearch.trim().toLowerCase();
  if (keyword !== "") {
    // 三个字符以下只搜名字。"sa" 这种两字母会命中几乎所有 bio
    const wide = keyword.length >= 3;
    items = items.filter(a =>
      a.name.toLowerCase().includes(keyword) ||
      (wide && a.city && a.city.toLowerCase().includes(keyword)) ||
      (wide && a.bio  && a.bio.toLowerCase().includes(keyword))
    );
  }

  // ---- 再排序 ----
  if (keyword !== "") {
    // 搜索时按匹配质量排，压过 A–Z / Random：
    // 名字开头 > 某个词开头 > 名字中间 > 只有 bio 命中
    const rank = (a) => {
      const n = a.name.toLowerCase();
      if (n.startsWith(keyword)) return 0;
      if (n.split(/[\s\-]+/).some(w => w.startsWith(keyword))) return 1;
      if (n.includes(keyword)) return 2;
      return 3;
    };
    items = items.slice().sort((x, y) => {
      const d = rank(x) - rank(y);
      // 同一档内按 A–Z，否则同分的人顺序会跳来跳去
      return d !== 0 ? d : x.name.localeCompare(y.name, "en");
    });
  } else if (currentSort === "az") {
    // localeCompare 才能正确处理带重音和非英文字符的名字
    items = items.slice().sort((a, b) => a.name.localeCompare(b.name, "en"));
  } else {
    if (!randomOrder) randomOrder = shuffle(ARTISTS.map(a => a.id));
    items = items.slice().sort(
      (a, b) => randomOrder.indexOf(a.id) - randomOrder.indexOf(b.id)
    );
  }

  if (items.length === 0) {
    const msg = onlyAvailable ? "No works currently available." : "No artists found.";
    grid.innerHTML = `<p class="empty-state">${msg}</p>`;
    return;
  }
  const base = window.ASSET_BASE || "";

  grid.innerHTML = items.map(a => `
    <a class="card" href="?id=${encodeURIComponent(a.id)}" data-artist-id="${a.id}">
      <div class="card-cover" style="background-image: url('${base}assets/images/artist/${encodeURI(a.id)}/cover.webp')"></div>
      <div class="card-meta">
        <span class="card-title">${a.name}</span>
      </div>
    </a>
  `).join("");
}

// 拦截卡片点击 — 不跳转，改成打开档案袋
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

// 排序
sortBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.sort;
    // 已经在 Random 状态下再点 Random = 重新洗一次牌
    if (mode === "random" && currentSort === "random") randomOrder = null;
    currentSort = mode;
    sortBtns.forEach(b => b.classList.toggle("active", b === btn));
    render();
  });
});


const availableNote = document.getElementById("available-note");

if (availableBtn) {
  availableBtn.addEventListener("click", () => {
    onlyAvailable = !onlyAvailable;
    availableBtn.classList.toggle("active", onlyAvailable);
    if (availableNote) availableNote.hidden = !onlyAvailable;   // ← 新增这行
    render();
  });
}


render();
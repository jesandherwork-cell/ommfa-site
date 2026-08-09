// ============================================
// 项目页：演出时间表 + 艺术家格子间
// ----
// 挂载点（写在项目页 HTML 里）：
//   <div id="project-performances" data-exhibition="london-design-festival-2026"></div>
//   <div class="grid" id="project-artist-grid" data-exhibition="london-design-festival-2026"></div>
//
// 名单来自 exhibitions.js：
//   默认按姓名 A–Z 自动排序，不用手写顺序
//   想手动指定顺序才写 order 数组，写了就以 order 为准
//
// 名字对不上（exhibitions.js 里写了但 artists.js 里没有）不会崩，
// 只会在浏览器控制台给一条警告，方便你抓拼写错误
// ============================================

(function() {
  if (typeof EXHIBITIONS === "undefined" || typeof ARTISTS === "undefined") return;

  // ============================================
  // 演出时间表
  // ============================================
  (function renderPerformances() {
    const mount = document.getElementById("project-performances");
    if (!mount) return;

    const exId = mount.dataset.exhibition;
    const ex = EXHIBITIONS[exId];
    const list = ex && ex.performances;
    if (!list || !list.length) {
      mount.innerHTML = "";      // 没有演出就整块不出现，不留一个空标题
      return;
    }

    // 名字能在 artists.js 里对上就变成可点的链接，对不上就是普通文字
    // 显示名和 id 不一致时，在 performances 里多写一个 id 字段
    const artistCell = (p) => {
      const id = p.id || p.artist;
      const found = ARTISTS.find(a => a.id === id);
      if (!found) return `<span class="perf-artist">${p.artist || ""}</span>`;
      return `<a class="perf-artist is-link"
                 href="../artist.html?id=${encodeURIComponent(id)}&tab=${encodeURIComponent(exId)}"
                 data-artist-id="${id}">${found.name}</a>`;
    };

    mount.innerHTML = `
      <div class="project-artists-head">
        <h2>Performance Programme</h2>
      </div>
      <ol class="perf-list">
        ${list.map(p => `
          <li class="perf-item">
            <div class="perf-when">
              <span class="perf-date">${p.date || ""}</span>
              ${p.time ? `<span class="perf-time">${p.time}</span>` : ""}
            </div>
            <div class="perf-what">
              ${artistCell(p)}
              ${p.work ? `<span class="perf-work">${p.work}</span>` : ""}
              ${p.note ? `<span class="perf-note">${p.note}</span>` : ""}
            </div>
            ${p.duration ? `<div class="perf-duration">${p.duration}</div>` : ""}
          </li>
        `).join("")}
      </ol>
    `;

    // 点击不跳转，就地打开档案袋，强制落在这个展的标签
    mount.addEventListener("click", (e) => {
      const link = e.target.closest(".perf-artist.is-link");
      if (!link) return;
      e.preventDefault();
      if (window.openEnvelope) window.openEnvelope(link.dataset.artistId, false, exId);
    });
  })();

  // ============================================
  // 艺术家格子间
  // ============================================
  (function renderArtistGrid() {
    const mount = document.getElementById("project-artist-grid");
    if (!mount) return;

    const exId = mount.dataset.exhibition;
    const ex = EXHIBITIONS[exId];
    if (!ex) {
      console.warn(`[project-artists] exhibitions.js 里找不到 "${exId}"`);
      return;
    }

    const ids = Object.keys(ex.artists || {});
    const base = window.ASSET_BASE || "";

    const missing = [];
    let rows = ids.map(id => {
      const a = ARTISTS.find(x => x.id === id);
      if (!a) missing.push(id);
      return a;
    }).filter(Boolean);

    if (missing.length) {
      console.warn(
        `[project-artists] 这些名字在 artists.js 里没有对应条目，已跳过：\n  ` +
        missing.join("\n  ")
      );
    }

    // 排序：默认 A–Z。写了 order 才按 order 走
    if (ex.order && ex.order.length) {
      rows.sort((a, b) => ex.order.indexOf(a.id) - ex.order.indexOf(b.id));
    } else {
      // localeCompare 才能正确处理带重音和非英文字符的名字
      rows.sort((a, b) => a.name.localeCompare(b.name, "en"));
    }

    if (!rows.length) {
      mount.innerHTML = `<p class="empty-state">Artist list coming soon.</p>`;
      return;
    }

    mount.innerHTML = rows.map(a => `
      <a class="card" href="../artist.html?id=${encodeURIComponent(a.id)}&tab=${encodeURIComponent(exId)}"
         data-artist-id="${a.id}">
        <div class="card-cover" style="background-image: url('${base}assets/images/artist/${encodeURI(a.id)}/cover.webp')"></div>
        <div class="card-meta">
          <span class="card-title">${a.name}</span>
        </div>
      </a>
    `).join("");

    // 点击不跳转，就地打开档案袋
    // 第三个参数 = 强制打开这个展览的标签
    mount.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      e.preventDefault();
      if (window.openEnvelope) window.openEnvelope(card.dataset.artistId, false, exId);
    });
  })();

})();

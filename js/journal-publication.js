// ============================================
// Journal 出版物页：页面内翻书器
//
// 和 journal-flipbook.js 的区别：
//   journal-flipbook.js  = 列表页的遮罩弹出式
//   本文件               = 独立页面里直接嵌一本书，不用遮罩
//
// 【自检】图片路径有好几种可能的写法，本文件会依次探测，
// 哪种通就用哪种，并把结果打在浏览器 Console 里。
// 全都不通时，页面上会直接显示试过的地址，不会无限转圈。
//
// 用法（在出版物 HTML 里）：
//   1. 放容器：
//      <div class="publication-stage">
//        <div id="flipbook" class="flipbook"></div>
//      </div>
//   2. 在本文件之前定义数据：
//      <script>
//        window.PUBLICATION = {
//          id: "exit-programme-v0101",   // 图片文件夹名
//          pages: 13,                    // 内页张数
//          ratio: 1.414                  // 高 ÷ 宽
//          // 可选：dir  强制子目录名，默认先试 "pages/" 再试根目录
//          // 可选：ext  强制扩展名，默认先试 webp 再试 jpg / jpeg / png
//        };
//      </script>
//   3. 先引 StPageFlip CDN，再引 site.js，最后引本文件
// ============================================

(function () {
  const cfg = window.PUBLICATION;
  const mount = document.getElementById("flipbook");
  if (!cfg || !mount) return;

  const pages = cfg.pages || 0;
  const ratio = cfg.ratio || 1.414;
  const base = `${window.ASSET_BASE || ""}assets/images/journal/${cfg.id}`;
  if (!pages) return;

  // ---- 候选路径写法。cfg 里写死了就只试那一种 ----
  const dirs = cfg.dir !== undefined ? [cfg.dir] : ["pages/", ""];
  const exts = cfg.ext ? [cfg.ext] : ["webp", "jpg", "jpeg", "png"];
  const pads = [2, 1];   // 01.webp 还是 1.webp

  const candidates = [];
  dirs.forEach(d => exts.forEach(e => pads.forEach(p => {
    candidates.push({ dir: d, ext: e, pad: p });
  })));

  const urlFor = (c, i) =>
    `${base}/${c.dir}${String(i).padStart(c.pad, "0")}.${c.ext}`;

  function tryLoad(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  function showError(tried) {
    const stage = mount.parentElement;
    stage.innerHTML = `
      <div class="publication-fallback">
        <p><strong>内页图片没找到。</strong></p>
        <p>下面这些地址都试过了，都是 404：</p>
        <ul style="text-align:left;display:inline-block;margin:12px 0;line-height:1.8;">
          ${tried.map(u => `<li><code>${u}</code></li>`).join("")}
        </ul>
        <p>请对照磁盘上的实际文件名和文件夹名，改到其中一种，或在
        <code>window.PUBLICATION</code> 里用 <code>dir</code> 和 <code>ext</code> 写死。</p>
      </div>`;
    const hint = document.querySelector(".publication-hint");
    if (hint) hint.hidden = true;
    console.error("[publication] 所有候选路径都失败：", tried);
  }

  // ---- 主流程 ----
  (async function () {
    // 1. 拿第一页当探针，找出正确的写法
    const tried = [];
    let hit = null;
    for (const c of candidates) {
      const url = urlFor(c, 1);
      tried.push(url);
      if (await tryLoad(url)) { hit = c; break; }
    }
    if (!hit) { showError(tried); return; }

    console.info(
      `[publication] 路径命中：${base}/${hit.dir}${"1".padStart(hit.pad, "0")}.${hit.ext}`
    );

    // 2. 按命中的写法组全部页面，并逐张确认
    const images = [];
    const missing = [];
    for (let i = 1; i <= pages; i++) {
      const url = urlFor(hit, i);
      if (await tryLoad(url)) images.push(url);
      else missing.push(url);
    }
    if (missing.length) {
      console.warn(`[publication] 有 ${missing.length} 张内页缺失，已跳过：`, missing);
    }
    if (!images.length) { showError(tried); return; }

    // 3. StPageFlip 没加载到就退回竖排图片，内容仍可读
    if (typeof St === "undefined" || !St.PageFlip) {
      console.warn("[publication] StPageFlip 未加载，退回竖排显示");
      mount.innerHTML = images
        .map(s => `<img src="${s}" alt="" loading="lazy" style="width:100%;display:block;margin-bottom:12px;border-radius:4px;">`)
        .join("");
      const hint = document.querySelector(".publication-hint");
      if (hint) hint.hidden = true;
      return;
    }

    // 4. 全屏书：按"可用高度"反推单页宽度，而不是跟着容器宽度走。
    //    书是竖版（ratio 1.414），摊开是两页并排。
    //    如果只按宽度算，高屏窄窗时书会超出视口下沿，要滚动才能看全，
    //    那就不叫全屏书了。
    const stage = mount.parentElement;

    function pageWidth() {
      const single = window.innerWidth <= 700;
      // 视口减去导航、标题行、提示行和上下留白
      const availH = Math.max(320, window.innerHeight - 210);
      let w = Math.floor(availH / ratio);                     // 高度允许的单页宽
      const cap = Math.min(window.innerWidth * 0.92, 1400);
      w = Math.min(w, Math.floor(single ? cap : cap / 2));     // 宽度允许的单页宽
      return Math.max(240, w);
    }

    // 容器宽度写死成"摊开后的总宽"，size:stretch 才会撑成两页并排
    function sizeStage() {
      const w = pageWidth();
      const single = window.innerWidth <= 700;
      stage.style.width = (single ? w : w * 2) + "px";
      return w;
    }

    const baseW = sizeStage();
    window.addEventListener("resize", sizeStage);

    const pageFlip = new St.PageFlip(mount, {
      width: baseW,
      height: Math.round(baseW * ratio),
      size: "stretch",
      minWidth: 240,
      maxWidth: 1000,
      minHeight: Math.round(240 * ratio),
      maxHeight: Math.round(1000 * ratio),
      showCover: true,
      usePortrait: true,          // 窄屏自动退成单页
      mobileScrollSupport: false,
      maxShadowOpacity: 0.5,
      drawShadow: true,
      flippingTime: 700
    });

    pageFlip.loadFromImages(images);

    // 键盘左右翻页。页面本身要能上下滚，所以只拦左右键。
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft")  pageFlip.flipPrev();
      if (e.key === "ArrowRight") pageFlip.flipNext();
    });
  })();
})();

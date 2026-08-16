// ============================================
// Journal 文章页：图片放大查看
//
// 点正文里任意一张 .journal-figure 的图 → 全屏放大
// 左右箭头 / 键盘左右键 / 手机左右滑 切换
// 左下角显示图注（艺术家、作品名、年份），右下角显示第几张
// ESC / 点空白 / ✕ 关闭
//
// 用法：<script src="../js/journal-lightbox.js"></script>
// 不需要任何额外 HTML，遮罩由脚本注入。
//
// 双语：只在当前显示的那个语言块里翻页。
// 切到中文时，翻的就是中文块那九张，图注也是中文。
// ============================================

(function () {
  const article = document.querySelector(".journal-article");
  if (!article) return;

  // ---- 注入遮罩 ----
  const ov = document.createElement("div");
  ov.className = "jl-overlay";
  ov.setAttribute("aria-hidden", "true");
  ov.innerHTML = `
    <button class="jl-close" aria-label="Close">✕</button>
    <button class="jl-nav jl-prev" aria-label="Previous image">‹</button>
    <button class="jl-nav jl-next" aria-label="Next image">›</button>
    <div class="jl-stage"><img class="jl-img" src="" alt=""></div>
    <div class="jl-bar">
      <span class="jl-caption"></span>
      <span class="jl-counter"></span>
    </div>
  `;
  document.body.appendChild(ov);

  const elImg     = ov.querySelector(".jl-img");
  const elCaption = ov.querySelector(".jl-caption");
  const elCounter = ov.querySelector(".jl-counter");
  const elPrev    = ov.querySelector(".jl-prev");
  const elNext    = ov.querySelector(".jl-next");

  let list = [];      // 当前语言块里的所有 figure
  let index = 0;

  // 只收当前可见的那个语言块。没有语言块时就收整篇。
  function collect(fromFigure) {
    const scope = fromFigure.closest("[data-lang]") || article;
    return [...scope.querySelectorAll(".journal-figure")];
  }

  // 图注取纯文本。里面有 <a> 和 <em>，textContent 会拼成
  // "Lukas Zerbst, Follow Me Blindly, 2025." 正好是想要的那一行。
  function captionOf(figure) {
    const cap = figure.querySelector("figcaption");
    return cap ? cap.textContent.replace(/\s+/g, " ").trim() : "";
  }

  function show(i) {
    if (!list.length) return;
    index = (i + list.length) % list.length;          // 首尾相接
    const fig = list[index];
    const img = fig.querySelector("img");
    if (!img) return;

    elImg.src = img.currentSrc || img.src;
    elImg.alt = img.alt || "";
    elCaption.textContent = captionOf(fig);
    elCounter.textContent = `${index + 1} / ${list.length}`;

    const many = list.length > 1;
    elPrev.hidden = !many;
    elNext.hidden = !many;
  }

  function open(fig) {
    list = collect(fig);
    const i = list.indexOf(fig);
    show(i < 0 ? 0 : i);
    ov.classList.add("is-open");
    ov.setAttribute("aria-hidden", "false");
    document.body.classList.add("jl-open");
  }

  function close() {
    ov.classList.remove("is-open");
    ov.setAttribute("aria-hidden", "true");
    document.body.classList.remove("jl-open");
    // 留一点时间给淡出，再清掉 src，避免下次打开闪上一张
    setTimeout(() => { if (!ov.classList.contains("is-open")) elImg.src = ""; }, 300);
  }

  // ---- 绑定：正文里的图 ----
  article.addEventListener("click", (e) => {
    const img = e.target.closest(".journal-figure img");
    if (!img) return;
    e.preventDefault();
    open(img.closest(".journal-figure"));
  });

  // ---- 遮罩内的操作 ----
  elPrev.addEventListener("click", (e) => { e.stopPropagation(); show(index - 1); });
  elNext.addEventListener("click", (e) => { e.stopPropagation(); show(index + 1); });
  ov.querySelector(".jl-close").addEventListener("click", close);

  // 点图片本身不关闭，点周围空白才关闭
  ov.addEventListener("click", (e) => {
    if (e.target === ov || e.target.classList.contains("jl-stage")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!ov.classList.contains("is-open")) return;
    if (e.key === "Escape")     close();
    if (e.key === "ArrowLeft")  show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });

  // ---- 手机：左右滑 ----
  let x0 = null;
  ov.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  ov.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  // 切语言时关掉：原来那张图已经被隐藏了
  document.addEventListener("journal:langchange", close);
})();

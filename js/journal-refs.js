// ============================================
// Journal 文章页：行内参考文献气泡
// 通用逻辑，所有 journal 文章页共用这一个文件
//
// 用法（在文章 HTML 里）：
//   1. 正文标记：<span class="ref" data-ref="1">被引用的词</span>
//   2. 在本文件之前定义数据：
//      <script>
//        window.JOURNAL_REFS = {
//          1: {
//            label: "标题",        meta: "补充信息",
//            label_zh: "中文标题",  meta_zh: "中文补充信息",   // 可省略
//            url: "https://...",   linkText: "显示的链接文字"
//          },
//        };
//      </script>
//   3. 引入本文件：<script src="../js/journal-refs.js"></script>
//
// 双语：条目有 label_zh / meta_zh 时，切到中文自动用中文那份；
//       没有就退回英文，不会空白。
//
// 触发方式：点击（桌面 + 移动一致）
//   想改成桌面 hover：把下面 TRIGGER 改成 "hover"
// ============================================

const TRIGGER = "click";          // "click" | "hover"
const MOBILE_BP = 640;            // 小于此宽度用底部抽屉

(function () {
  const REFS = window.JOURNAL_REFS || {};
  const anchors = document.querySelectorAll(".ref[data-ref]");
  if (!anchors.length) return;

  // ---- 建气泡容器（全页只有一个，复用）----
  const bubble = document.createElement("div");
  bubble.className = "ref-bubble";
  bubble.setAttribute("aria-hidden", "true");
  bubble.innerHTML = `
    <button class="ref-bubble-close" aria-label="Close">✕</button>
    <div class="ref-bubble-index"></div>
    <div class="ref-bubble-label"></div>
    <div class="ref-bubble-meta"></div>
    <a class="ref-bubble-link" target="_blank" rel="noopener"></a>
  `;
  document.body.appendChild(bubble);

  const elIndex = bubble.querySelector(".ref-bubble-index");
  const elLabel = bubble.querySelector(".ref-bubble-label");
  const elMeta  = bubble.querySelector(".ref-bubble-meta");
  const elLink  = bubble.querySelector(".ref-bubble-link");

  let openAnchor = null;

  function isMobile() {
    return window.innerWidth < MOBILE_BP;
  }

  function isZh() {
    return document.documentElement.lang.toLowerCase().startsWith("zh");
  }

  // ---- 填内容（按当前语言取字段，没有中文就退回英文）----
  function fill(id) {
    const data = REFS[id];
    if (!data) return false;

    const zh = isZh();
    const label = (zh && data.label_zh) || data.label || "";
    const meta  = (zh && data.meta_zh)  || data.meta  || "";

    elIndex.textContent = id;
    elLabel.textContent = label;
    elMeta.textContent = meta;
    elMeta.hidden = !meta;

    if (data.url) {
      elLink.href = data.url;
      elLink.textContent = (data.linkText || (zh ? "打开来源" : "Open source")) + " ↗";
      elLink.hidden = false;
    } else {
      elLink.hidden = true;
    }
    return true;
  }

  // ---- 定位（桌面：贴着锚点；移动：底部抽屉，由 CSS 处理）----
  function position(anchor) {
    if (isMobile()) {
      bubble.style.left = "";
      bubble.style.top = "";
      return;
    }

    const r = anchor.getBoundingClientRect();
    const bw = bubble.offsetWidth;
    const bh = bubble.offsetHeight;
    const gap = 10;
    const pad = 16;

    // 默认放在锚点右侧；右边放不下就翻到左侧
    let left = r.right + gap;
    if (left + bw > window.innerWidth - pad) {
      left = r.left - bw - gap;
    }
    // 左侧也放不下（窄窗口）：贴右边界
    if (left < pad) {
      left = Math.max(pad, window.innerWidth - bw - pad);
    }

    // 垂直：与锚点顶部对齐，超出视口就上移
    let top = r.top;
    if (top + bh > window.innerHeight - pad) {
      top = Math.max(pad, window.innerHeight - bh - pad);
    }

    bubble.style.left = left + window.scrollX + "px";
    bubble.style.top  = top + window.scrollY + "px";
  }

  function open(anchor) {
    const id = anchor.dataset.ref;
    if (!fill(id)) return;

    if (openAnchor) openAnchor.classList.remove("is-open");
    openAnchor = anchor;
    anchor.classList.add("is-open");

    bubble.classList.toggle("is-sheet", isMobile());
    bubble.setAttribute("aria-hidden", "false");
    bubble.classList.add("is-visible");

    // 先显示再量尺寸，否则 offsetWidth 为 0
    position(anchor);
  }

  function close() {
    bubble.classList.remove("is-visible");
    bubble.setAttribute("aria-hidden", "true");
    if (openAnchor) openAnchor.classList.remove("is-open");
    openAnchor = null;
  }

  // ---- 绑定 ----
  anchors.forEach(a => {
    a.setAttribute("role", "button");
    a.setAttribute("tabindex", "0");

    a.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (openAnchor === a) { close(); return; }
      open(a);
    });

    a.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAnchor === a ? close() : open(a);
      }
    });

    if (TRIGGER === "hover") {
      a.addEventListener("mouseenter", () => { if (!isMobile()) open(a); });
    }
  });

  bubble.querySelector(".ref-bubble-close").addEventListener("click", close);
  bubble.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  // 切语言时关掉气泡：原锚点已被隐藏，气泡不该继续挂在空处
  document.addEventListener("journal:langchange", close);

  // 滚动 / 改窗口时跟随；移动端抽屉不需要跟随
  let ticking = false;
  function reflow() {
    if (!openAnchor || ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      if (openAnchor) position(openAnchor);
      ticking = false;
    });
  }
  window.addEventListener("scroll", reflow, { passive: true });
  window.addEventListener("resize", () => {
    if (!openAnchor) return;
    bubble.classList.toggle("is-sheet", isMobile());
    position(openAnchor);
  });
})();

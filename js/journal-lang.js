// ============================================
// Journal 文章页：中英文切换
// 通用逻辑，所有双语文章页共用这一个文件
//
// 用法（在文章 HTML 里）：
//   1. 正文包两层：
//      <div data-lang="en"> ...英文段落... </div>
//      <div data-lang="zh"> ...中文段落... </div>
//   2. 放切换按钮：
//      <div class="lang-toggle" id="lang-toggle">
//        <button data-set-lang="en" class="is-active">EN</button>
//        <button data-set-lang="zh">中文</button>
//      </div>
//   3. 引入本文件：<script src="../js/journal-lang.js"></script>
//
// 默认语言 = HTML 里带 is-active 的那个按钮
// 切换后会记住选择（同一浏览器下次进来沿用）
// ============================================

(function () {
  const toggle = document.getElementById("lang-toggle");
  if (!toggle) return;

  const buttons = toggle.querySelectorAll("[data-set-lang]");
  const blocks  = document.querySelectorAll("[data-lang]");
  if (!buttons.length || !blocks.length) return;

  const STORAGE_KEY = "ommfa-journal-lang";

  // HTML lang 属性也要跟着变，屏幕阅读器和搜索引擎都靠它判断语种
  const HTML_LANG = { en: "en", zh: "zh-Hans" };

  function apply(lang) {
    blocks.forEach(b => {
      b.hidden = b.dataset.lang !== lang;
    });
    buttons.forEach(btn => {
      btn.classList.toggle("is-active", btn.dataset.setLang === lang);
      btn.setAttribute("aria-pressed", btn.dataset.setLang === lang);
    });
    document.documentElement.lang = HTML_LANG[lang] || lang;

    // 通知气泡脚本换语言（气泡如果正开着，内容要跟着换）
    document.dispatchEvent(new CustomEvent("journal:langchange", { detail: { lang } }));
  }

  // ---- 决定初始语言 ----
  let initial = toggle.querySelector(".is-active")?.dataset.setLang || "en";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && [...buttons].some(b => b.dataset.setLang === saved)) {
      initial = saved;
    }
  } catch (e) { /* 隐私模式下 localStorage 会抛错，忽略即可 */ }

  apply(initial);

  // ---- 绑定 ----
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.setLang;
      apply(lang);
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    });
  });
})();

// ============================================
// Journal 翻书器:浮现 + 翻页 + 关闭
// 流程:
//   1. 点卡片 → openFlipbook(id)
//   2. 背景淡化,合着的书从底部"浮出水面"
//   3. 书停在封面(01.jpg),由用户自己翻开 —— 不再自动翻页
//   4. 点击左右半边 / 键盘左右键 / 拖拽 翻页
//   5. 点书外空白 / ✕ / ESC 关闭
// ============================================

// ============================================
// Journal 翻书器: 浮现 + 翻页 + 关闭 (终极修复版)
// ============================================

(function() {
  const overlay  = document.getElementById("flipbook-overlay");
  if (!overlay) return;

  const closeBtn = overlay.querySelector(".flipbook-close");
  let pageFlip = null;

  // 核心修复：彻底销毁实例，并【重建】干净的 DOM 节点
  // 仅清空 innerHTML 无法清除第三方库残留的内联样式，必须整个 div 替换
  function destroyFlip() {
    if (pageFlip) {
      try { pageFlip.destroy(); } catch (e) {}
      pageFlip = null;
    }
    const stage = overlay.querySelector('.flipbook-stage');
    if (stage) {
      stage.innerHTML = '<div id="flipbook" class="flipbook"></div>';
    }
  }

  window.openFlipbook = function(id) {
    const entry = JOURNAL.find(j => j.id === id);
    if (!entry) return;

    const pages = entry.pages || 0;
    const ratio = entry.ratio || 1.414;
    const base = `assets/images/journal/${id}`;
    const images = [];
    for (let i = 1; i <= pages; i++) {
      const n = String(i).padStart(2, "0");
      images.push(`${base}/pages/${n}.webp`);
    }

    // 1. 创建新书前，先彻底清理并重建干净的挂载点
    destroyFlip();

    // 2. 现查刚刚重建出来的纯净节点
    const mount = document.getElementById("flipbook");
    if (!mount) return;

    // 显示遮罩 + 淡化背景
    document.body.classList.add("flipbook-open");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");

    const baseW = 420;
    const baseH = Math.round(baseW * ratio);

    pageFlip = new St.PageFlip(mount, {
      width: baseW,
      height: baseH,
      size: "stretch",
      minWidth: 260,
      maxWidth: 1000,
      minHeight: Math.round(260 * ratio),
      maxHeight: Math.round(1000 * ratio),
      showCover: true,
      usePortrait: true,
      mobileScrollSupport: false,
      maxShadowOpacity: 0.5,
      drawShadow: true,
      flippingTime: 700
    });

    pageFlip.loadFromImages(images);

    // 浮现动画
    setTimeout(() => overlay.classList.add("emerged"), 50);

    // 自动翻开封面的代码已删除，书会安静地停在第一页等你来翻
    document.title = `${entry.title} — OMMFA`;
  };

  function closeFlipbook() {
    if (!overlay.classList.contains("open")) return;
    
    // 移除焦点避免 aria-hidden 警告
    if (document.activeElement) document.activeElement.blur();
    
    overlay.classList.remove("open", "emerged");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("flipbook-open");
    document.title = "Journal — OMMFA";

    // 等关闭过渡动画结束后，彻底销毁并清理 DOM
    setTimeout(destroyFlip, 400);
  }

  closeBtn.addEventListener("click", closeFlipbook);

  overlay.addEventListener("click", (e) => {
    // 确保只有点击真正的背景遮罩才触发关闭
    if (e.target === overlay) closeFlipbook();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") closeFlipbook();
    if (e.key === "ArrowLeft"  && pageFlip) pageFlip.flipPrev();
    if (e.key === "ArrowRight" && pageFlip) pageFlip.flipNext();
  });
})();
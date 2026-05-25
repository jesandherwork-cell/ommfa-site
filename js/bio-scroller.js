// ============================================
// bio-scroller.js
// 档案袋 A4 卡 bio 的自定义滚动条：细线轨道 + 浮起圆形把手（推子 / fader 形态）
//
// 设计：
// - 把手是固定大小的正圆（18px），位置表示滚动进度，不表示内容比例（音量推子逻辑）
// - 支持：拖动把手、在 bio 区域滚轮、触屏拖动
// - bio 不需要滚动时（内容没超出），细线和把手自动隐藏
// - 每次档案袋重新渲染后需要重新初始化（见底部 window.initBioScroller）
//
// 依赖：被 artist-envelope.js 在 renderEnvelope() 末尾调用
//   if (window.initBioScroller) window.initBioScroller();
// ============================================

(function () {
  const HANDLE_SIZE = 18;   // 圆把手直径（px）
  const RAIL_TOP    = 80;   // 细线起点：距卡片顶部多少 px（顶部对齐，固定不动）
  const RAIL_LENGTH = 160;  // 细线总长度（px）。想更短就改小，比如 120 / 100 / 80
  const RAIL_RIGHT  = 14;   // 细线距卡片右边缘的距离（px），落在 padding 区里

  // 当前激活的实例（同一时间只有一个档案袋打开）
  let active = null;

  // 把指定 bio 元素接管为自定义滚动条
  function attach(bio) {
    const card = bio.closest(".envelope-card");
    if (!card) return null;

    // 1. 藏掉原生滚动条，但保留 bio 的可滚动能力（用 scrollTop 驱动）
    //    overflow 仍需 auto/scroll，否则 scrollHeight 不会超出、scrollTop 失效
    bio.style.overflowY = "scroll";
    bio.classList.add("bio-native-hidden"); // CSS 里把原生滚动条宽度压成 0

    // 2. 注入细线轨道 + 圆把手（作为 .envelope-card 的子元素，绝对定位）
    let rail = card.querySelector(".bio-rail");
    let handle = card.querySelector(".bio-handle");
    if (!rail) {
      rail = document.createElement("div");
      rail.className = "bio-rail";
      card.appendChild(rail);
    }
    if (!handle) {
      handle = document.createElement("div");
      handle.className = "bio-handle";
      card.appendChild(handle);
    }

    const inst = { bio, card, rail, handle, dragging: false };

    // ---- 计算轨道的像素活动范围 ----
    function railGeometry() {
      const cardH = card.clientHeight;
      const railTop = RAIL_TOP;                          // 顶部对齐，起点固定
      // 长度取设定值，但不超过卡片可用高度（留底部 14px 安全边）
      const railLen = Math.min(RAIL_LENGTH, cardH - RAIL_TOP - 14);
      // 把手中心可移动的范围（要把把手半径留出来）
      const travelTop = railTop + HANDLE_SIZE / 2;
      const travelLen = railLen - HANDLE_SIZE;
      return { railTop, railLen, travelTop, travelLen };
    }

    // ---- 根据 bio.scrollTop 把把手放到对应位置 ----
    function syncHandleFromScroll() {
      const maxScroll = bio.scrollHeight - bio.clientHeight;
      const g = railGeometry();

      // 内容没超出 → 不需要滚动条，隐藏
      if (maxScroll <= 1) {
        rail.style.display = "none";
        handle.style.display = "none";
        return;
      }
      rail.style.display = "block";
      handle.style.display = "block";

      // 细线位置与长度
      rail.style.top = g.railTop + "px";
      rail.style.height = g.railLen + "px";
      rail.style.right = RAIL_RIGHT + "px";

      const ratio = bio.scrollTop / maxScroll;        // 0~1
      const centerY = g.travelTop + ratio * g.travelLen;
      handle.style.top = (centerY - HANDLE_SIZE / 2) + "px";
      handle.style.right = (RAIL_RIGHT - HANDLE_SIZE / 2) + "px";
    }

    // ---- 根据把手位置反推 scrollTop（拖动时用）----
    function scrollFromHandleCenter(centerY) {
      const g = railGeometry();
      let ratio = (centerY - g.travelTop) / g.travelLen;
      ratio = Math.max(0, Math.min(1, ratio));
      const maxScroll = bio.scrollHeight - bio.clientHeight;
      bio.scrollTop = ratio * maxScroll;
    }

    // ---- 事件：bio 自身滚动（滚轮/键盘/触屏惯性都会触发）→ 同步把手 ----
    function onScroll() {
      if (!inst.dragging) syncHandleFromScroll();
    }
    bio.addEventListener("scroll", onScroll, { passive: true });

    // ---- 事件：拖动把手 ----
    function pointerY(e) {
      return e.touches ? e.touches[0].clientY : e.clientY;
    }
    function startDrag(e) {
      e.preventDefault();
      e.stopPropagation();
      inst.dragging = true;
      handle.classList.add("dragging");
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchmove", onDrag, { passive: false });
      document.addEventListener("touchend", endDrag);
    }
    function onDrag(e) {
      if (!inst.dragging) return;
      e.preventDefault();
      const cardRect = card.getBoundingClientRect();
      const centerY = pointerY(e) - cardRect.top;  // 转成相对卡片的坐标
      scrollFromHandleCenter(centerY);
      syncHandleFromScroll();
    }
    function endDrag() {
      inst.dragging = false;
      handle.classList.remove("dragging");
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", endDrag);
      document.removeEventListener("touchmove", onDrag);
      document.removeEventListener("touchend", endDrag);
    }
    handle.addEventListener("mousedown", startDrag);
    handle.addEventListener("touchstart", startDrag, { passive: false });

    // ---- 点击细线：跳到对应位置 ----
    rail.addEventListener("click", (e) => {
      const cardRect = card.getBoundingClientRect();
      const centerY = e.clientY - cardRect.top;
      scrollFromHandleCenter(centerY);
      syncHandleFromScroll();
    });

    // 暴露给实例，方便销毁
    inst.destroy = function () {
      bio.removeEventListener("scroll", onScroll);
      handle.removeEventListener("mousedown", startDrag);
      handle.removeEventListener("touchstart", startDrag);
      endDrag();
    };
    inst.sync = syncHandleFromScroll;

    // 初次同步（图片可能还没加载完，稍后再同步一次）
    syncHandleFromScroll();
    return inst;
  }

  // ============================================
  // 对外接口：每次档案袋渲染后调用
  // ============================================
  window.initBioScroller = function () {
    // 销毁上一个
    if (active && active.destroy) active.destroy();
    active = null;

    const bio = document.querySelector(".envelope-card .envelope-card-bio");
    if (!bio) return;

    active = attach(bio);

    // bio 里如果有图片/字体晚加载导致高度变化，延迟再同步两次兜底
    if (active) {
      setTimeout(active.sync, 150);
      setTimeout(active.sync, 500);
    }
  };

  // 窗口尺寸变化（横竖屏切换、缩放）时重新测量
  window.addEventListener("resize", () => {
    if (active && active.sync) active.sync();
  });
})();

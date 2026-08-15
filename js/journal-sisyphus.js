// ============================================
// Journal 文章页：西西弗斯阅读进度
//
// 小人沿斜坡推石头，位置对应整页滚动进度：
//   页面顶部 = 坡底(0)，页面底部 = 坡顶(1)。
// 拖到底 → 石头加速滚回坡底 → 停在那里，不循环。
// 滚回页面顶部附近，才重新开始推。
// 全程缓动，任何时候都不会瞬移。
//
// 用法（在文章 HTML 里）：
//   1. 左栏放 SVG 容器（结构见 sisyphus-timesheets.html）
//   2. 引入本文件：<script src="../js/journal-sisyphus.js"></script>
//
// 进度以 .project-review 这个元素为准，不是整页滚动，
// 所以文末 References 和页脚不计入"读完"。
// ============================================

(function () {
  const svg = document.getElementById("sisyphus");
  const article = document.querySelector(".project-review");
  if (!svg || !article) return;

  const boulder = svg.querySelector("#sis-boulder");
  const figure  = svg.querySelector("#sis-figure");
  const trail   = svg.querySelector("#sis-trail");
  if (!boulder || !figure || !trail) return;

  // ---- 斜坡几何：和 SVG 里那条 #sis-slope 的两端保持一致 ----
  const A = { x: 20,  y: 110 };   // 坡底
  const B = { x: 232, y: 28  };   // 坡顶
  const R = 9;                    // 石头半径

  const dx = B.x - A.x, dy = B.y - A.y;
  const LEN = Math.hypot(dx, dy);
  const ux = dx / LEN, uy = dy / LEN;                // 沿坡单位向量
  // 法线取指向坡面上方的那一侧。SVG 里 y 轴向下，所以要 y 分量为负的那个。
  const nx = uy, ny = -ux;
  const ANGLE = Math.atan2(dy, dx) * 180 / Math.PI;  // 坡度，负值

  const FIG_TRAIL = 19 / LEN;                        // 小人落后石头的距离（比例）
  const SPIN = (LEN / (2 * Math.PI * R)) * 360;      // 坡底到坡顶转多少度

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- 可调参数 ----
  const SMOOTH  = 0.075;   // 上坡追赶系数，越小越慢越黏；0.075 ≈ 从坡底推到顶约 1 秒
  const SETTLE  = 0.0004;  // 小于这个差值就算追上了，停止出帧
  const FALL_MS   = 1100;  // 滚落时长
  const RESUME_AT = 0.10;  // 掉下去之后，滚回到这个进度以内才重新接管
                           // 取小值是有意的：石头停在坡底，读者往回滚时进度也在往 0 走，
                           // 两者方向一致，看起来是"它已经滚回来了在等你"，不像卡住。

  // ---- 状态 ----
  const CLIMB = 0, FALL = 1, PARKED = 2;
  let mode = CLIMB;
  let t = 0;          // 当前显示位置
  let target = 0;     // 阅读进度想让它去的位置
  let stamp = 0;      // FALL 的起始时刻
  let raf = null;

  // 进度 = 整页滚动位置。页面顶部 0，页面底部 1。
  //
  // 不按正文元素算：窗口很高、正文没高出多少时，
  // "正文高度 - 视口高度"这个分母会变得极小，
  // 滚一两百像素进度就冲到 1，人还在文章中间程序却以为读完了。
  function readProgress() {
    const span = document.documentElement.scrollHeight - window.innerHeight;
    if (span <= 0) return 0;
    return clamp(window.scrollY / span);
  }

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function place(v) {
    const px = A.x + dx * v;
    const py = A.y + dy * v;

    // 石头：贴在坡面上，圆心沿法线抬高一个半径
    boulder.setAttribute(
      "transform",
      `translate(${(px + nx * R).toFixed(2)}, ${(py + ny * R).toFixed(2)}) rotate(${(v * SPIN).toFixed(1)})`
    );

    // 小人：落后石头一小段，脚踩坡面，整体按坡度倾斜
    const fv = Math.max(0, v - FIG_TRAIL);
    figure.setAttribute(
      "transform",
      `translate(${(A.x + dx * fv).toFixed(2)}, ${(A.y + dy * fv).toFixed(2)}) rotate(${ANGLE.toFixed(1)})`
    );

    // 走过的那段坡加亮
    trail.setAttribute("x2", px.toFixed(2));
    trail.setAttribute("y2", py.toFixed(2));
  }

  // 下坡用二次曲线：自由落体的位移就是时间的平方，越滚越快
  function fallEase(x) { return x * x; }

  function tick(now) {
    raf = null;
    let more = false;

    if (mode === FALL) {
      const k = Math.min(1, (now - stamp) / FALL_MS);
      t = 1 - fallEase(k);
      more = true;
      if (k >= 1) { t = 0; mode = PARKED; }

    } else if (mode === PARKED) {
      // 掉下来之后停在坡底。滚回页面上部才重新接管，
      // 否则停在页尾会立刻又被触发，变成无限循环。
      t = 0;
      if (readProgress() < RESUME_AT) mode = CLIMB;

    } else {                       // CLIMB
      target = readProgress();

      if (reduced) {
        t = target;                     // 关掉动效：直接跟随，不缓动也不循环
      } else {
        t += (target - t) * SMOOTH;     // 缓慢追赶，永远不瞬移
        if (Math.abs(target - t) < SETTLE) t = target;
        else more = true;
      }

      // 真的推到坡顶了才让它滚下去，追赶途中不触发
      if (!reduced && target >= 0.995 && t >= 0.99) {
        mode = FALL;
        stamp = now;
        more = true;
      }
    }

    place(t);
    if (more) raf = requestAnimationFrame(tick);
  }

  function request() {
    if (raf === null) raf = requestAnimationFrame(tick);
  }

  place(0);
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);

  // 切到别的标签页就停掉，回来再续上，不在后台空转
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    } else {
      if (mode === FALL) stamp = performance.now();   // 别把切走的那段时间算进去
      request();
    }
  });

  request();
})();

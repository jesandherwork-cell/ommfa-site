// ============================================
// poster-particles.js
// 档案袋展览海报：鼠标划过时上面那张散开，露出下面那张
// ----
// 结构（由 artist-envelope.js 的 postersHTML 生成）：
//   .envelope-posters
//     ├── img.ep-slide.ep-under   posters[1]，始终显示在底层
//     └── img.ep-slide.ep-top     posters[0]，取样后交给 canvas 渲染
//     └── canvas.ep-canvas        画上面那张，被推开处透出底层
//
// 只在桌面启用。手机走两张并排的简版，由 artist-envelope.js 判断。
//
// 对外接口：
//   window.initPosterParticles(panelEl)
//   window.destroyPosterParticles()
//
// ⚠ 本地测试：canvas 读像素受同源策略限制，file:// 打开会失败并自动
//   降级成静态海报（上面那张正常显示，只是没有粒子）。
//   用 npx serve 起 http 服务器即可。上线 Netlify 后无此问题。
// ============================================

(function () {

  const CONFIG = {
    CELL: 5,        // 颗粒边长（px）。调大 = 更粗颗粒、更省性能
    RADIUS: 80,     // 鼠标影响半径（px）
    PUSH: 2.6,      // 推开力度。调大 = 散得更开、露出更多
    SPRING: 0.04,   // 回弹力度。调小 = 合拢更慢
    DAMPING: 0.9,   // 阻尼。越接近 1 越飘
    SLEEP: 0.35,    // 位移和速度都小于这个值就判定归位，停止计算
    FADE: 0.9,      // 颗粒被推得越远越淡，0 = 不淡出，1 = 淡得很快
  };

  let active = null;

  function destroyActive() {
    if (active && active.destroy) active.destroy();
    active = null;
  }

  window.initPosterParticles = function (panel) {
    destroyActive();
    if (!panel) return;
    active = mount(panel);
  };

  window.destroyPosterParticles = destroyActive;
  window.resamplePosterParticles = function () {
    if (active && active.resample) active.resample();
  };

  // ============================================
  function mount(panel) {
    const top   = panel.querySelector(".ep-top");
    const under = panel.querySelector(".ep-under");
    if (!top) return null;

    let canvas = panel.querySelector(".ep-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.className = "ep-canvas";
      panel.appendChild(canvas);
    }
    const ctx = canvas.getContext("2d");

    let cols = 0, rows = 0, cell = CONFIG.CELL;
    let box = null;
    let pixels = null;
    let rafId = null;
    let disposed = false;
    let ready = false;

    const moving = new Map();    // index -> { dx, dy, vx, vy }
    const pointer = { x: -9999, y: -9999, inside: false };

    // object-fit: contain 之后图片真正占据的矩形
    function containedRect(el, w, h) {
      const nw = el.naturalWidth, nh = el.naturalHeight;
      if (!nw || !nh) return null;
      const scale = Math.min(w / nw, h / nh);
      return { left: (w - nw * scale) / 2, top: (h - nh * scale) / 2,
               w: nw * scale, h: nh * scale };
    }

    function fallback(reason, err) {
      ready = false;
      pixels = null;
      panel.classList.remove("has-particles");   // 上面那张恢复显示，不会变空白
      canvas.style.display = "none";
      if (reason) console.warn("[poster-particles] " + reason, err || "");
    }

    function sample() {
      if (!top.complete || !top.naturalWidth) return fallback();

      const pw = panel.clientWidth, ph = panel.clientHeight;
      if (!pw || !ph) return fallback();

      box = containedRect(top, pw, ph);
      if (!box) return fallback();

      cell = CONFIG.CELL;
      cols = Math.ceil(box.w / cell);
      rows = Math.ceil(box.h / cell);

      // 离屏画布：只按格子数取样，不去读原图那两千多万像素
      try {
        const off = document.createElement("canvas");
        off.width = cols;
        off.height = rows;
        const octx = off.getContext("2d", { willReadFrequently: true });
        octx.drawImage(top, 0, 0, cols, rows);
        pixels = octx.getImageData(0, 0, cols, rows).data;
      } catch (err) {
        return fallback(
          "无法读取图片像素，已降级为静态海报。本地测试请用 http 服务器打开（npx serve）。", err);
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.display = "block";
      canvas.style.left   = box.left + "px";
      canvas.style.top    = box.top + "px";
      canvas.style.width  = box.w + "px";
      canvas.style.height = box.h + "px";
      canvas.width  = Math.round(box.w * dpr);
      canvas.height = Math.round(box.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 底层那张对齐到同一个矩形，两张海报才会严丝合缝
      // （前提是两张尺寸比例一致，不一致时以上面那张为准）
      if (under) {
        under.style.left   = box.left + "px";
        under.style.top    = box.top + "px";
        under.style.width  = box.w + "px";
        under.style.height = box.h + "px";
      }

      ready = true;
      panel.classList.add("has-particles");
      moving.clear();
      draw();
    }

    function draw() {
      if (!ready) return;
      ctx.clearRect(0, 0, box.w, box.h);
      ctx.drawImage(top, 0, 0, box.w, box.h);

      // 被推开的颗粒：原位挖空（露出底层那张），再画到新位置
      moving.forEach((p, idx) => {
        const cx = (idx % cols) * cell;
        const cy = Math.floor(idx / cols) * cell;
        ctx.clearRect(cx, cy, cell, cell);

        const o = idx * 4;
        let a = pixels[o + 3] / 255;
        if (a <= 0.02) return;
        // 飞得越远越淡，看起来像被吹散而不是整块平移
        const d = Math.hypot(p.dx, p.dy);
        a *= Math.max(0, 1 - (d / CONFIG.RADIUS) * CONFIG.FADE);
        if (a <= 0.02) return;

        ctx.fillStyle = `rgba(${pixels[o]},${pixels[o + 1]},${pixels[o + 2]},${a})`;
        ctx.fillRect(cx + p.dx, cy + p.dy, cell, cell);
      });
    }

    function step() {
      if (disposed) return;

      if (pointer.inside) {
        const r = CONFIG.RADIUS;
        const c0 = Math.max(0, Math.floor((pointer.x - r) / cell));
        const c1 = Math.min(cols - 1, Math.ceil((pointer.x + r) / cell));
        const r0 = Math.max(0, Math.floor((pointer.y - r) / cell));
        const r1 = Math.min(rows - 1, Math.ceil((pointer.y + r) / cell));

        for (let ry = r0; ry <= r1; ry++) {
          for (let cx = c0; cx <= c1; cx++) {
            const hx = cx * cell + cell / 2;
            const hy = ry * cell + cell / 2;
            const ddx = hx - pointer.x;
            const ddy = hy - pointer.y;
            const dist = Math.hypot(ddx, ddy);
            if (dist > r || dist === 0) continue;

            const force = (1 - dist / r) * CONFIG.PUSH;
            const idx = ry * cols + cx;
            let p = moving.get(idx);
            if (!p) { p = { dx: 0, dy: 0, vx: 0, vy: 0 }; moving.set(idx, p); }
            p.vx += (ddx / dist) * force;
            p.vy += (ddy / dist) * force;
          }
        }
      }

      moving.forEach((p, idx) => {
        p.vx = (p.vx - p.dx * CONFIG.SPRING) * CONFIG.DAMPING;
        p.vy = (p.vy - p.dy * CONFIG.SPRING) * CONFIG.DAMPING;
        p.dx += p.vx;
        p.dy += p.vy;
        if (Math.abs(p.dx) < CONFIG.SLEEP && Math.abs(p.dy) < CONFIG.SLEEP &&
            Math.abs(p.vx) < CONFIG.SLEEP && Math.abs(p.vy) < CONFIG.SLEEP) {
          moving.delete(idx);
        }
      });

      draw();

      // 没有活动颗粒且鼠标不在上面，循环睡着，省电
      if (moving.size === 0 && !pointer.inside) { rafId = null; return; }
      rafId = requestAnimationFrame(step);
    }

    function wake() {
      if (rafId === null && !disposed) rafId = requestAnimationFrame(step);
    }

    function onMove(e) {
      if (!ready) return;
      const rect = canvas.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      pointer.x = px;
      pointer.y = py;
      pointer.inside = px >= 0 && py >= 0 && px <= box.w && py <= box.h;
      wake();
    }
    function onLeave() {
      pointer.inside = false;
      wake();                    // 醒一下，让颗粒合拢回去
    }

    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    if (!top.complete) top.addEventListener("load", sample, { once: true });
    if (under && !under.complete) under.addEventListener("load", sample, { once: true });

    const ro = new ResizeObserver(() => sample());
    ro.observe(panel);

    sample();

    return {
      resample: sample,
      destroy() {
        disposed = true;
        if (rafId) cancelAnimationFrame(rafId);
        ro.disconnect();
        canvas.removeEventListener("mousemove", onMove);
        canvas.removeEventListener("mouseleave", onLeave);
        moving.clear();
        panel.classList.remove("has-particles");
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

})();

// ============================================
// Artist 档案袋核心交互
// ----
// 【功能摘要】
//   1. 右侧标签（info / LDF / …）。标签不用手写，自动从 EXHIBITIONS 算出来
//   2. 两层内容一次性渲染进 DOM，切换只是 display 显隐，不重跑飞入动画
//   3. 隐藏层的视频 iframe 用 data-lazysrc 兜住，不会在后台偷偷播放
//   4. URL 带 tab：?id=Aida%20Pouryeganeh&tab=london-design-festival-2026
//   5. inspector 支持 gallery 翻页（一张散落图背后挂一串图）
//   6. 图片路径统一走 window.ASSET_BASE，子目录页面（projects/）不再 404
//   7. 展览海报：两张叠放，桌面鼠标划过上面那张散开露出下面那张
//      （见 poster-particles.js），手机退化成两张并排、点击放大
//
// 散落物 type：
//   • image (默认)    — 静态图，点击进 inspector 放大
//   • video (Vimeo)   — 就地静音 loop（sound:true 时桌面 hover 出声）
//   • video (YouTube) — 就地静音 loop，点击放大后用 YouTube 自带控制条
//   • model (GLB)     — 静态 poster；点击放大，hover 跟随鼠标转
//
// 数据写法（artists.js / exhibitions.js 通用）：
//   { src: "photo-01.webp", w: 32, rotate: 4, desc: "..." }
//   { src: "a.webp", w: 32, desc: "...", gallery: ["a.webp","b.webp"] }
//   { src: "a.webp", w: 32, desc: "...", link: "https://..." }
//   { type: "video", vimeo: "123456789", sound: true, w: 36, desc: "..." }
//   { type: "video", youtube: "-CF39_UFRyM", w: 30, desc: "..." }
//   { type: "model", src: "work.glb", poster: "m-cover.webp", w: 40, desc:"..." }
//
// exhibitions.js 里每位艺术家可加：
//   posters: [ { src: "ldf2026-theway/a.webp", desc: "…" },
//              { src: "ldf2026-theway/b.webp", desc: "…" } ]
//   第一张是上面那张，第二张被露出来
// ============================================

(function() {
  const overlay  = document.getElementById("envelope-overlay");
  if (!overlay) return;

  const inner     = overlay.querySelector(".envelope-inner");
  const closeBtn  = overlay.querySelector(".envelope-close");
  const inspector = overlay.querySelector(".envelope-inspector");

  const BASE_TITLE = document.title;              // 关闭档案袋时恢复成这个
  const ASSET = () => (window.ASSET_BASE || "");

  // 拾取层结构：图片 + 3D 容器 + 放大视频容器 + 翻页箭头 + 描述
  if (inspector && !inspector.querySelector(".inspector-wrapper")) {
    inspector.innerHTML = `
      <div class="inspector-wrapper">
        <img class="inspected-image" src="" alt="">
        <div class="inspected-model" aria-hidden="true"></div>
        <div class="inspected-video" aria-hidden="true"></div>
        <p class="inspector-hint"></p>
        <button class="insp-nav insp-prev" aria-label="Previous">‹</button>
        <button class="insp-nav insp-next" aria-label="Next">›</button>
        <span class="insp-counter" aria-hidden="true"></span>
      </div>
    `;
  }
  const inspectImg   = inspector.querySelector(".inspected-image");
  const inspectModel = inspector.querySelector(".inspected-model");
  const inspectVideo = inspector.querySelector(".inspected-video");
  const inspectHint  = inspector.querySelector(".inspector-hint");
  const inspPrev     = inspector.querySelector(".insp-prev");
  const inspNext     = inspector.querySelector(".insp-next");
  const inspCounter  = inspector.querySelector(".insp-counter");

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // 全局音量记忆：一次访问内所有视频（信封 + 放大）共享
  let globalVol = 1;

  // 当前打开的艺术家 / 当前标签
  let currentArtist = null;
  let currentTab = "info";

  // gallery 翻页状态
  let gallery = null;   // { list: [完整路径...], i: 0, desc: "" }

  // ============================================
  // 音量提示
  // ============================================
  let volHintDismissed = false;
  let volHintEl = null;
  function removeVolHint() {
    if (volHintEl) { volHintEl.remove(); volHintEl = null; }
  }
  function dismissVolHint() {
    volHintDismissed = true;
    removeVolHint();
  }
  function maybeShowVolHint() {
    if (volHintDismissed || volHintEl || isMobile) return;

    const hint = document.createElement("div");
    volHintEl = hint;
    hint.className = "vol-hint";
    hint.setAttribute("aria-hidden", "true");
    hint.innerHTML = `
      <svg class="vol-hint-icon" viewBox="0 0 28 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="1.25" y="1.25" width="25.5" height="41.5" rx="12.75"
              stroke="currentColor" stroke-width="2.5"/>
        <rect x="11.5" y="8" width="5" height="11" rx="2.5" fill="currentColor"/>
        <path class="vol-hint-arrow" d="M14 4.5 L10.5 9 H17.5 Z" fill="currentColor"/>
        <path class="vol-hint-arrow" d="M14 22.5 L10.5 18 H17.5 Z" fill="currentColor"/>
      </svg>
      <span class="vol-hint-text">Scroll to adjust volume</span>
      <button class="vol-hint-close" aria-label="Close">✕</button>
    `;
    document.body.appendChild(hint);
    hint.querySelector(".vol-hint-close").addEventListener("click", dismissVolHint);

    void hint.offsetWidth;
    hint.classList.add("show");
  }

  let activeModel = null;
  let activeInspVideo = null;
  let pausedInPlace = null;

  // ============================================
  // 标签：扫一遍 EXHIBITIONS，谁的名单里有这个艺术家就长一个标签
  // 所以你只要在 exhibitions.js 里填一条，artist 页和项目页两边同时出现
  // ============================================
  function buildTabs(artist) {
    const tabs = [{ key: "info", label: "info", type: "info" }];

    if (typeof EXHIBITIONS === "undefined") return tabs;

    Object.keys(EXHIBITIONS).forEach(exId => {
      const ex = EXHIBITIONS[exId];
      const entry = ex && ex.artists && ex.artists[artist.id];
      if (!entry) return;
      tabs.push({
        key: exId,
        label: ex.label || exId,
        title: ex.title || "",
        type: "exhibition",
        entry: entry,
        posters: entry.posters || null
      });
    });

    return tabs;
  }

  // ============================================
  // 打开档案袋
  // forceTab 优先；否则读 body 的 data-default-tab（项目页用）；否则 info
  // ============================================
  window.openEnvelope = function(id, skipHistory, forceTab) {
    const artist = ARTISTS.find(a => a.id === id);
    if (!artist) return;

    const tabs = buildTabs(artist);
    const wanted = forceTab || document.body.dataset.defaultTab || "info";
    const initial = tabs.some(t => t.key === wanted) ? wanted : "info";

    currentArtist = artist;
    currentTab = initial;

    renderEnvelope(artist, tabs, initial);
    document.body.classList.add("envelope-open");

    void overlay.offsetWidth;

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");

    if (!skipHistory) pushUrl(id, initial);
    document.title = `${artist.name} | OMMFA`;
  };

  function pushUrl(id, tab, replace) {
    let url = `?id=${encodeURIComponent(id)}`;
    if (tab && tab !== "info") url += `&tab=${encodeURIComponent(tab)}`;
    const state = { artistId: id, tab: tab };
    if (replace) history.replaceState(state, "", url);
    else history.pushState(state, "", url);
  }

  function closeEnvelope(skipHistory) {
    if (!overlay.classList.contains("open")) return;

    if (inspector.classList.contains("active")) {
      closeInspector();
      return;
    }

    // 关闭前把所有还在播的视频停掉
    inner.querySelectorAll(".envelope-item.is-video").forEach(w => {
      if (w._vimeoPlayer) w._vimeoPlayer.pause().catch(() => {});
    });
    ytCommand(inner, "pauseVideo");

    // 海报粒子的 canvas 和动画循环一起收掉
    if (window.destroyPosterParticles) window.destroyPosterParticles();

    document.body.classList.remove("envelope-open");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    removeVolHint();
    currentArtist = null;

    if (!skipHistory) {
      history.pushState(null, "", window.location.pathname);
    }
    document.title = BASE_TITLE;

    if (document.activeElement) document.activeElement.blur();
  }

  // ============================================
  // 渲染：一次性把所有标签的内容都渲染进 DOM，成为并列的 .envelope-layer
  // 切换时只改 class，不重新生成，所以飞入动画不会重跑
  // ============================================
  function renderEnvelope(artist, tabs, initialTab) {
    const envelopeElement = overlay.querySelector(".envelope");

    // ---- 顶部姓名标签 ----
    let nameTab = envelopeElement.querySelector(".envelope-tab");
    if (!nameTab) {
      nameTab = document.createElement("div");
      nameTab.className = "envelope-tab";
      envelopeElement.insertBefore(nameTab, inner);
    }
    nameTab.textContent = artist.name;

    // ---- 右侧标签条 ----
    let tabRail = envelopeElement.querySelector(".envelope-tabs");
    if (!tabRail) {
      tabRail = document.createElement("div");
      tabRail.className = "envelope-tabs";
      envelopeElement.appendChild(tabRail);
    }
    tabRail.innerHTML = tabs.map(t => `
      <button class="envelope-tab-btn ${t.key === initialTab ? "active" : ""}"
              data-tab="${t.key}"
              title="${(t.title || t.label).replace(/"/g, "&quot;")}">${t.label}</button>
    `).join("");
    // 只有一个标签（这个艺术家没参加过任何展）就整条藏起来
    tabRail.classList.toggle("is-single", tabs.length < 2);

    // ---- 各层内容 ----
    const basePath = `${ASSET()}assets/images/artist/${encodeURI(artist.id)}`;

    inner.innerHTML = tabs.map(t => {
      const isActive = t.key === initialTab;
      const card  = t.type === "info" ? infoCardHTML(artist) : labelCardHTML(t);
      const items = t.type === "info"
        ? itemsHTML(artist.items, basePath, isActive)
        : (t.posters && t.posters.length
            ? postersHTML(t, basePath, isActive)
            : itemsHTML(t.entry.items, basePath, isActive));
      return `<div class="envelope-layer ${isActive ? "active" : ""}" data-tab="${t.key}">${card}${items}</div>`;
    }).join("");

    bindLayer(inner.querySelector(".envelope-layer.active"));

    tabRail.querySelectorAll(".envelope-tab-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        switchTab(btn.dataset.tab);
      });
    });

    if (window.initBioScroller) window.initBioScroller();
  }

  // ---- info 层的 A4 卡：城市 + bio + 网站 ----
  function infoCardHTML(artist) {
    const websiteHTML = artist.website
      ? `<a class="envelope-card-link" href="${artist.website}" target="_blank" rel="noopener">${artist.website.replace(/^https?:\/\//, "")} ↗</a>`
      : "";
    return `
      <div class="envelope-card">
        <p class="envelope-card-city">${artist.city || ""}</p>
        <p class="envelope-card-bio">${artist.bio || ""}</p>
        ${websiteHTML}
      </div>
    `;
  }

  // ---- 展览层的 A4 卡：展签 ----
  function labelCardHTML(tab) {
    const e = tab.entry;
    const metaLines = [e.medium, e.dimensions, e.year].filter(Boolean).join("<br>");
    return `
      <div class="envelope-card is-label">
        <p class="envelope-card-city">${tab.title || tab.label}</p>
        ${e.work ? `<h3 class="envelope-work-title">${e.work}</h3>` : ""}
        ${metaLines ? `<p class="envelope-work-meta">${metaLines}</p>` : ""}
        <p class="envelope-card-bio">${e.note || ""}</p>
      </div>
    `;
  }

  // ---- 散落物 ----
  // isActive=false 的层：图片 lazy，视频 iframe 用 data-lazysrc 兜住不预加载
  function itemsHTML(items, basePath, isActive) {
    return (items || []).map((item, i) => {
      const itemWidth = (item.w || 30) * 0.7;
      const rotate = item.rotate !== undefined ? item.rotate : (Math.random() * 30 - 15);

      const anchors = [
        { x: 54, y: 12 },
        { x: 74, y: 48 },
        { x: 76, y: 14 },
        { x: 55, y: 55 },
        { x: 65, y: 32 }
      ];
      const anchor = anchors[i % anchors.length];
      const autoX = anchor.x + (Math.random() * 8 - 4);
      const autoY = anchor.y + (Math.random() * 8 - 4);
      const finalX = item.x !== undefined ? item.x : autoX;
      const finalY = item.y !== undefined ? item.y : autoY;
      const safeX = Math.max(50, Math.min(finalX, 95 - itemWidth));
      const safeY = Math.max(5, Math.min(finalY, 95 - (itemWidth * 1.2)));

      const desc = item.desc ? item.desc.replace(/"/g, '&quot;') : '';
      const style = `
        left: ${safeX}%;
        top: ${safeY}%;
        width: ${itemWidth}%;
        transform: rotate(${rotate}deg);
      `;

      const type = item.type || "image";

      // —— Vimeo ——
      if (type === "video" && item.vimeo) {
        const soundFlag = item.sound ? "1" : "0";
        const vsrc = `https://player.vimeo.com/video/${item.vimeo}?background=1&loop=1&autopause=0&muted=1`;
        const srcAttr = isActive ? `src="${vsrc}"` : `data-lazysrc="${vsrc}"`;
        return `
          <div class="envelope-item is-video" style="${style}"
               data-vimeo="${item.vimeo}" data-sound="${soundFlag}" data-desc="${desc}">
            <div class="ev-video">
              <iframe ${srcAttr} frameborder="0" allow="autoplay" title="${desc}"></iframe>
              <span class="ev-video-hit" aria-label="open"></span>
            </div>
          </div>
        `;
      }

      // —— YouTube ——
      // loop 必须配 playlist=同一个 ID，这是 YouTube 的老怪癖
      // enablejsapi=1 才能用 postMessage 遥控暂停
      if (type === "video" && item.youtube) {
        const yt = item.youtube;
        const ysrc = `https://www.youtube-nocookie.com/embed/${yt}`
          + `?autoplay=1&mute=1&loop=1&playlist=${yt}`
          + `&controls=0&rel=0&playsinline=1&iv_load_policy=3&disablekb=1&enablejsapi=1`;
        const srcAttr = isActive ? `src="${ysrc}"` : `data-lazysrc="${ysrc}"`;
        return `
          <div class="envelope-item is-video is-youtube" style="${style}"
               data-youtube="${yt}" data-desc="${desc}">
            <div class="ev-video">
              <iframe ${srcAttr} frameborder="0"
                      allow="autoplay; encrypted-media" title="${desc}"></iframe>
              <span class="ev-video-hit" aria-label="open"></span>
            </div>
          </div>
        `;
      }

      // —— 3D 模型 ——
      if (type === "model" && item.src) {
        const posterImg = item.poster
          ? `<img src="${basePath}/${item.poster}" alt="" ${isActive ? "" : 'loading="lazy"'}>`
          : '';
        return `
          <div class="envelope-item is-model" style="${style}"
               data-model="${basePath}/${item.src}" data-desc="${desc}">
            <div class="ev-model-poster">${posterImg}</div>
          </div>
        `;
      }

      // —— 图片（可带 gallery / link）——
      const galAttr = (item.gallery && item.gallery.length > 1)
        ? `data-gallery="${encodeURIComponent(JSON.stringify(item.gallery.map(g => `${basePath}/${g}`)))}"`
        : "";
      const linkAttr = item.link ? `data-link="${item.link}"` : "";
      return `
        <div class="envelope-item" style="${style}" data-src="${basePath}/${item.src}" data-desc="${desc}" ${galAttr} ${linkAttr}>
          <img src="${basePath}/${item.src}" alt="" ${isActive ? "" : 'loading="lazy"'}>
        </div>
      `;
    }).join("");
  }

  // ---- 展览海报 ----
  // posters[0] = 上面那张（鼠标划过会散开）
  // posters[1] = 下面那张（被露出来）
  // 手机上退化成两张并排，点击放大
  function postersHTML(tab, basePath, isActive) {
    const list = tab.posters;
    const esc = (s) => (s || "").replace(/"/g, "&quot;");
    const gal = encodeURIComponent(JSON.stringify(list.map(p => `${basePath}/${p.src}`)));
    const topP   = list[0];
    const underP = list[1] || list[0];
    const lazy = isActive ? "" : 'loading="lazy"';
    return `
      <div class="envelope-posters" data-gallery="${gal}">
        <img class="ep-slide ep-under" src="${basePath}/${underP.src}"
             alt="${esc(underP.desc)}" data-desc="${esc(underP.desc)}" ${lazy}>
        <img class="ep-slide ep-top" src="${basePath}/${topP.src}"
             alt="${esc(topP.desc)}" data-desc="${esc(topP.desc)}" ${lazy}>
      </div>
    `;
  }

  // ---- 给某一层绑事件（每层只绑一次）----
  function bindLayer(layer) {
    if (!layer || layer.dataset.bound === "1") return;
    layer.dataset.bound = "1";

    layer.querySelectorAll(".envelope-item:not(.is-video):not(.is-model)").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const gal = el.dataset.gallery ? JSON.parse(decodeURIComponent(el.dataset.gallery)) : null;
        openInspector(el.dataset.src, el.dataset.desc, gal, el.dataset.link);
      });
    });

    layer.querySelectorAll(".envelope-item.is-model").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        openModelInspector(el.dataset.model, el.dataset.desc);
      });
    });

    // 视频 iframe 补 src（非活动层是空的）
    layer.querySelectorAll("iframe[data-lazysrc]").forEach(f => {
      f.src = f.dataset.lazysrc;
      f.removeAttribute("data-lazysrc");
    });

    // ---- 海报：桌面粒子扒开，手机两张并排点击放大 ----
    const posterBox = layer.querySelector(".envelope-posters");
    if (posterBox) {
      const narrow = window.matchMedia("(max-width: 900px)").matches;

      if (narrow) {
        posterBox.classList.add("is-grid");
        posterBox.querySelectorAll(".ep-slide").forEach(im => {
          im.addEventListener("click", (e) => {
            e.stopPropagation();
            const g = JSON.parse(decodeURIComponent(posterBox.dataset.gallery));
            openInspector(im.src, im.dataset.desc, g);
          });
        });
      } else if (window.initPosterParticles) {
        window.initPosterParticles(posterBox);
      }
    }

    if (window.initEnvelopeVideos) window.initEnvelopeVideos(layer);
  }

  // ---- YouTube 没有 player 对象，用 postMessage 遥控播放/暂停 ----
  function ytCommand(scope, func) {
    if (!scope) return;
    scope.querySelectorAll(".envelope-item.is-youtube iframe").forEach(f => {
      if (!f.contentWindow) return;
      try {
        f.contentWindow.postMessage(
          JSON.stringify({ event: "command", func: func, args: [] }), "*");
      } catch (err) { /* 忽略 */ }
    });
  }

  // ============================================
  // 切标签：纯显隐，不重渲染，不重跑动画
  // ============================================
  function switchTab(key) {
    if (key === currentTab) return;

    inner.querySelectorAll(".envelope-layer").forEach(layer => {
      const on = layer.dataset.tab === key;
      layer.classList.toggle("active", on);

      layer.querySelectorAll(".envelope-item.is-video").forEach(w => {
        if (!w._vimeoPlayer) return;
        if (on) w._vimeoPlayer.play().catch(() => {});
        else {
          w._vimeoPlayer.setVolume(0).catch(() => {});
          w._vimeoPlayer.pause().catch(() => {});
        }
      });
      ytCommand(layer, on ? "playVideo" : "pauseVideo");

      // 离场的那层如果有海报粒子，先收掉，避免两层抢同一个实例
      if (!on && layer.querySelector(".envelope-posters") && window.destroyPosterParticles) {
        window.destroyPosterParticles();
      }

      if (on) {
        bindLayer(layer);
        // 已经绑过的层再切回来时粒子实例已被销毁，需要重建
        const pb = layer.querySelector(".envelope-posters");
        if (pb && !pb.querySelector(".ep-canvas") &&
            !window.matchMedia("(max-width: 900px)").matches &&
            window.initPosterParticles) {
          window.initPosterParticles(pb);
        }
      }
    });

    overlay.querySelectorAll(".envelope-tab-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.tab === key);
    });

    currentTab = key;
    if (currentArtist) pushUrl(currentArtist.id, key, true);   // replace，不塞满后退历史
    if (window.initBioScroller) window.initBioScroller();
  }

  // ============================================
  // inspector
  // ============================================
  function openInspector(imgSrc, imgDesc, galleryList, link) {
    resetInspectorSlots();
    inspectImg.style.display = "";
    inspectImg.src = imgSrc;

    // 有 link 时，底部说明文字变成可点的链接
    if (link) {
      inspectHint.innerHTML =
        `<a href="${link}" target="_blank" rel="noopener" class="inspector-link">${imgDesc || "View project"} ↗</a>`;
    } else {
      inspectHint.textContent = imgDesc || "";
    }

    if (galleryList && galleryList.length > 1) {
      const i = galleryList.indexOf(imgSrc);
      gallery = { list: galleryList, i: i < 0 ? 0 : i, desc: imgDesc || "" };
      inspector.classList.add("has-gallery");
      updateCounter();
    } else {
      gallery = null;
      inspector.classList.remove("has-gallery");
    }

    activateInspector();
  }

  function updateCounter() {
    if (!gallery) return;
    inspCounter.textContent = `${gallery.i + 1} / ${gallery.list.length}`;
  }

  function stepGallery(delta) {
    if (!gallery) return;
    gallery.i = (gallery.i + delta + gallery.list.length) % gallery.list.length;
    inspectImg.src = gallery.list[gallery.i];
    updateCounter();
  }

  inspPrev.addEventListener("click", (e) => { e.stopPropagation(); stepGallery(-1); });
  inspNext.addEventListener("click", (e) => { e.stopPropagation(); stepGallery(1); });

  function openModelInspector(modelSrc, desc) {
    resetInspectorSlots();
    gallery = null;
    inspector.classList.remove("has-gallery");
    inspectModel.classList.add("active");
    inspectHint.textContent = desc || "";
    activateInspector();

    if (activeModel && activeModel.dispose) activeModel.dispose();
    activeModel = mountModel(inspectModel, modelSrc);
  }

  function openVideoInspector(vimeoId, soundFlag, desc, inPlacePlayer) {
    resetInspectorSlots();
    gallery = null;
    inspector.classList.remove("has-gallery");
    inspectVideo.classList.add("active");
    inspectHint.textContent = desc || "";
    activateInspector();

    if (activeInspVideo && activeInspVideo.dispose) activeInspVideo.dispose();

    const startFrom = inPlacePlayer
      ? inPlacePlayer.getCurrentTime().catch(() => 0)
      : Promise.resolve(0);

    startFrom.then((t) => {
      if (inPlacePlayer) {
        inPlacePlayer.pause().catch(() => {});
        pausedInPlace = inPlacePlayer;
      }
      activeInspVideo = mountInspectorVideo(inspectVideo, vimeoId, soundFlag === "1", t || 0);
    });
  }

  // ---- YouTube inspector：放大后交给 YouTube 自带控制条 ----
  function openYouTubeInspector(ytId, desc) {
    resetInspectorSlots();
    gallery = null;
    inspector.classList.remove("has-gallery");
    inspectVideo.classList.add("active");
    inspectHint.textContent = desc || "";
    activateInspector();

    if (activeInspVideo && activeInspVideo.dispose) activeInspVideo.dispose();
    activeInspVideo = mountInspectorYouTube(inspectVideo, ytId);
  }

  function mountInspectorYouTube(host, ytId) {
    host.style.aspectRatio = "16 / 9";
    host.innerHTML = `
      <iframe src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&rel=0&playsinline=1"
              frameborder="0" allow="autoplay; encrypted-media; fullscreen"
              allowfullscreen title="video"></iframe>
    `;
    return {
      player: null,     // 没有 API player，closeInspector 会走 else 分支，正确
      dispose() { host.innerHTML = ""; host.style.aspectRatio = ""; }
    };
  }

  function resetInspectorSlots() {
    inspectImg.style.display = "none";
    inspectImg.src = "";
    inspectModel.classList.remove("active");
    inspectVideo.classList.remove("active");
  }

  function activateInspector() {
    inner.classList.add("blur-contents");
    inspector.classList.add("active");
    inspector.setAttribute("aria-hidden", "false");
  }

  function closeInspector() {
    inner.classList.remove("blur-contents");
    inspector.classList.remove("active");
    inspector.classList.remove("has-gallery");
    inspector.setAttribute("aria-hidden", "true");
    gallery = null;

    inspectImg.style.display = "";
    inspectModel.classList.remove("active");
    inspectVideo.classList.remove("active");

    if (activeModel && activeModel.dispose) {
      activeModel.dispose();
      activeModel = null;
    }

    const inspVid = activeInspVideo;
    const inPlace = pausedInPlace;
    if (inspVid && inspVid.player && inPlace) {
      inspVid.player.getCurrentTime().then((t) => {
        return inPlace.setCurrentTime(t || 0);
      }).catch(() => {}).then(() => {
        inPlace.play().catch(() => {});
        if (inspVid.dispose) inspVid.dispose();
      });
      pausedInPlace = null;
      activeInspVideo = null;
    } else {
      if (inspVid && inspVid.dispose) { inspVid.dispose(); activeInspVideo = null; }
      if (inPlace) { inPlace.play().catch(() => {}); pausedInPlace = null; }
    }
  }

  // 链接点击不触发关闭（捕获阶段，抢在下面的关闭逻辑之前）
  inspector.addEventListener("click", (e) => {
    if (e.target.closest(".inspector-link")) e.stopPropagation();
  }, true);

  closeBtn.addEventListener("click", () => closeEnvelope());
  inspector.addEventListener("click", () => closeInspector());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeEnvelope();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (inspector.classList.contains("active")) closeInspector();
      else if (overlay.classList.contains("open")) closeEnvelope();
      return;
    }
    // gallery 左右翻页
    if (gallery && inspector.classList.contains("active")) {
      if (e.key === "ArrowLeft")  { e.preventDefault(); stepGallery(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); stepGallery(1); }
    }
  });

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const tab = params.get("tab");
    if (id) window.openEnvelope(id, true, tab || undefined);
    else closeEnvelope(true);
  });

  setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const tab = params.get("tab");
    if (id) window.openEnvelope(id, true, tab || undefined);
  }, 50);

  // ============================================
  // 就地视频
  // ============================================
  window.initEnvelopeVideos = function(scope) {

    // ---- YouTube：不依赖 Vimeo API，所以放在 Vimeo 的守卫之前 ----
    scope.querySelectorAll(".envelope-item.is-youtube:not([data-ready])").forEach(wrap => {
      wrap.setAttribute("data-ready", "1");
      const hit = wrap.querySelector(".ev-video-hit");
      if (!hit) return;
      hit.addEventListener("click", (e) => {
        e.stopPropagation();
        openYouTubeInspector(wrap.dataset.youtube, wrap.dataset.desc || "");
      });
    });

    // ---- 以下是 Vimeo，没加载到 player.js 就直接退出 ----
    if (typeof Vimeo === "undefined") return;

    scope.querySelectorAll(".envelope-item.is-video:not(.is-youtube):not([data-ready])").forEach(wrap => {
      wrap.setAttribute("data-ready", "1");
      const iframe = wrap.querySelector("iframe");
      if (!iframe || !iframe.src) return;
      const hit = wrap.querySelector(".ev-video-hit");
      const canSound = wrap.getAttribute("data-sound") === "1";
      const vimeoId = wrap.getAttribute("data-vimeo");
      const desc = wrap.getAttribute("data-desc") || "";
      const player = new Vimeo.Player(iframe);
      wrap._vimeoPlayer = player;

      if (canSound && !isMobile) {
        wrap.addEventListener("mouseenter", () => {
          maybeShowVolHint();
          player.setVolume(globalVol).catch(() => {});
        });
        wrap.addEventListener("mouseleave", () => player.setVolume(0).catch(() => {}));
        const wheelTarget = hit || wrap;
        wheelTarget.addEventListener("wheel", (e) => {
          e.preventDefault();
          globalVol = Math.max(0, Math.min(1, globalVol - e.deltaY * 0.001));
          player.setVolume(globalVol).catch(() => {});
        }, { passive: false });
      }

      const openLarge = (e) => {
        e.stopPropagation();
        openVideoInspector(vimeoId, canSound ? "1" : "0", desc, player);
      };
      if (hit) hit.addEventListener("click", openLarge);
    });
  };

  // ============================================
  // inspector 放大视频
  // ============================================
  function mountInspectorVideo(host, vimeoId, canSound, startTime) {
    const t0 = startTime ? `#t=${Math.floor(startTime)}s` : "";
    host.innerHTML = `
      <iframe src="https://player.vimeo.com/video/${vimeoId}?background=1&loop=1&autopause=0&muted=1${t0}"
              frameborder="0" allow="autoplay" title="video" style="pointer-events:none;"></iframe>
      <span class="insp-video-hit" style="position:absolute;inset:0;z-index:2;"></span>
    `;
    const iframe = host.querySelector("iframe");
    const player = new Vimeo.Player(iframe);
    if (startTime) {
      player.ready().then(() => player.setCurrentTime(startTime)).catch(() => {});
    }

    Promise.all([player.getVideoWidth(), player.getVideoHeight()]).then(([w, h]) => {
      if (w && h) host.style.aspectRatio = `${w} / ${h}`;
    }).catch(() => {});

    let clickHandler = null, enterHandler = null, leaveHandler = null, wheelHandler = null;

    if (canSound) {
      const hitLayer = host.querySelector(".insp-video-hit") || host;
      if (isMobile) {
        hitLayer.style.cursor = "pointer";
        if (globalVol <= 0) globalVol = 1;
        player.ready().then(() => player.setVolume(globalVol)).catch(() => {});
        let on = true;
        clickHandler = (e) => {
          e.stopPropagation();
          on = !on;
          globalVol = on ? 1 : 0;
          player.setVolume(globalVol).catch(() => {});
        };
        hitLayer.addEventListener("click", clickHandler);
      } else {
        enterHandler = () => {
          maybeShowVolHint();
          player.setVolume(globalVol).catch(() => {});
        };
        leaveHandler = () => player.setVolume(0).catch(() => {});
        wheelHandler = (e) => {
          e.preventDefault();
          globalVol = Math.max(0, Math.min(1, globalVol - e.deltaY * 0.001));
          player.setVolume(globalVol).catch(() => {});
        };
        hitLayer.addEventListener("mouseenter", enterHandler);
        hitLayer.addEventListener("mouseleave", leaveHandler);
        hitLayer.addEventListener("wheel", wheelHandler, { passive: false });
      }
    }

    return {
      player,
      dispose() {
        const hitLayer = host.querySelector(".insp-video-hit") || host;
        if (clickHandler) hitLayer.removeEventListener("click", clickHandler);
        if (enterHandler) hitLayer.removeEventListener("mouseenter", enterHandler);
        if (leaveHandler) hitLayer.removeEventListener("mouseleave", leaveHandler);
        if (wheelHandler) hitLayer.removeEventListener("wheel", wheelHandler);
        player.setVolume(0).catch(() => {});
        host.innerHTML = "";
        host.style.aspectRatio = "";
      }
    };
  }

  // ============================================
  // 3D 模型
  // ============================================
  function mountModel(host, url) {
    if (typeof THREE === "undefined") {
      console.warn("Three.js 未加载，无法渲染 3D");
      return null;
    }

    host.innerHTML = `<div class="ev-model-loading">Loading…</div>`;
    const loadingUI = host.querySelector(".ev-model-loading");

    const w = host.clientWidth || 480;
    const h = host.clientHeight || 480;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    const BASE_Z = 6;
    const MIN_Z = 2;
    const MAX_Z = 10;
    let targetZ = BASE_Z;
    camera.position.set(0, 0, BASE_Z);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.72;
    host.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;

    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const fill = new THREE.DirectionalLight(0xffffff, 0.8);
    fill.position.set(2, 2, 5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffaa77, 1.6);
    rim.position.set(-5, 5, -5);
    scene.add(rim);

    let group = null;
    let hovering = true;
    let localMX = 0, localMY = 0;
    let rafId = null;
    let disposed = false;

    const onWinMove = (e) => {
      localMX = (e.clientX / window.innerWidth) - 0.5;
      localMY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", onWinMove);
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        localMX = (e.touches[0].clientX / window.innerWidth) - 0.5;
        localMY = (e.touches[0].clientY / window.innerHeight) - 0.5;
      }
    };
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const onWheel = (e) => {
      e.preventDefault();
      targetZ += e.deltaY * 0.005;
      targetZ = Math.max(MIN_Z, Math.min(MAX_Z, targetZ));
    };
    host.addEventListener("wheel", onWheel, { passive: false });

    let pinchStartDist = 0;
    let pinchStartZ = BASE_Z;
    const dist2 = (t) => Math.hypot(
      t[0].clientX - t[1].clientX,
      t[0].clientY - t[1].clientY
    );
    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        pinchStartDist = dist2(e.touches);
        pinchStartZ = targetZ;
      }
    };
    const onPinchMove = (e) => {
      if (e.touches.length === 2 && pinchStartDist > 0) {
        const ratio = dist2(e.touches) / pinchStartDist;
        targetZ = pinchStartZ / ratio;
        targetZ = Math.max(MIN_Z, Math.min(MAX_Z, targetZ));
      }
    };
    host.addEventListener("touchstart", onTouchStart, { passive: true });
    host.addEventListener("touchmove", onPinchMove, { passive: true });

    const onDblReset = () => { targetZ = BASE_Z; };
    const onModelClick = (e) => e.stopPropagation();
    host.addEventListener("click", onModelClick);
    host.addEventListener("dblclick", onDblReset);
    let lastTap = 0;
    const onTapReset = (e) => {
      e.stopPropagation();
      if (e.touches.length > 0) return;
      const now = Date.now();
      if (now - lastTap < 300) targetZ = BASE_Z;
      lastTap = now;
    };
    host.addEventListener("touchend", onTapReset);

    const loader = new THREE.GLTFLoader();
    if (THREE.DRACOLoader) {
      const draco = new THREE.DRACOLoader();
      draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
      loader.setDRACOLoader(draco);
    }
    loader.load(url, (gltf) => {
      if (disposed) return;
      if (loadingUI) loadingUI.remove();
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) model.scale.setScalar(3 / maxDim);
      group = new THREE.Group();
      group.add(model);
      scene.add(group);
    }, undefined, (err) => {
      console.error("GLB 加载失败:", err);
      if (loadingUI) loadingUI.textContent = "Load failed.";
    });

    function animate() {
      if (disposed) return;
      rafId = requestAnimationFrame(animate);
      if (group) {
        const t = performance.now() * 0.001;
        const autoRotY = Math.sin(t * 0.5) * 0.2;
        const autoRotX = Math.cos(t * 0.7) * 0.1;
        const targetY = hovering ? localMX * Math.PI * 1.5 : autoRotY;
        const targetX = hovering ? localMY * Math.PI * 0.5 : autoRotX;
        group.rotation.y += (targetY - group.rotation.y) * 0.05;
        group.rotation.x += (targetX - group.rotation.x) * 0.05;
        group.position.y = Math.sin(t * 1.5) * 0.03;
      }
      camera.position.z += (targetZ - camera.position.z) * 0.1;
      renderer.render(scene, camera);
    }
    animate();

    const ro = new ResizeObserver(() => {
      const nw = host.clientWidth, nh = host.clientHeight;
      if (!nw || !nh) return;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    });
    ro.observe(host);

    return {
      dispose() {
        disposed = true;
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("mousemove", onWinMove);
        window.removeEventListener("touchmove", onTouchMove);
        host.removeEventListener("wheel", onWheel);
        host.removeEventListener("touchstart", onTouchStart);
        host.removeEventListener("touchmove", onPinchMove);
        host.removeEventListener("click", onModelClick);
        host.removeEventListener("dblclick", onDblReset);
        host.removeEventListener("touchend", onTapReset);

        ro.disconnect();
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        host.innerHTML = "";
      }
    };
  }

})();

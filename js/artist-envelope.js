// ============================================
// Artist 档案袋核心交互：大倾角飞入 + 无边框拾取 + 左对齐描述
// ----
// 三种散落物 type：
//   • image (默认)  — 静态图，点击进 inspector 放大
//   • video (Vimeo) — 信封里就地静音 loop 播放（sound:true 时桌面 hover 出声）；
//                     点击进 inspector 放大就地播放（桌面 hover 出声 / 手机点击切声）；
//                     放大时信封里那个暂停，关闭后恢复
//   • model (GLB)   — 信封里静态 poster（不转）；点击进 inspector 放大，hover 跟随鼠标转
//
// 数据写法（artists.js）：
//   { src: "photo-01.webp", w: 32, rotate: 4, desc: "..." }                       // 图片
//   { type: "video", vimeo: "123456789", sound: true, w: 36, desc: "..." }        // 视频(带声)
//   { type: "video", vimeo: "987654321", w: 30, desc: "..." }                     // 视频(静音)
//   { type: "model", src: "work.glb", poster: "m-cover.webp", w: 40, desc:"..." } // 3D
// ============================================

(function() {
  const overlay  = document.getElementById("envelope-overlay");
  if (!overlay) return;

  const inner     = overlay.querySelector(".envelope-inner");
  const closeBtn  = overlay.querySelector(".envelope-close");
  const inspector = overlay.querySelector(".envelope-inspector");

  // 拾取层结构：图片 + 3D 容器 + 放大视频容器 + 描述，全部包在 wrapper 里左对齐
  if (inspector && !inspector.querySelector(".inspector-wrapper")) {
    inspector.innerHTML = `
      <div class="inspector-wrapper">
        <img class="inspected-image" src="" alt="">
        <div class="inspected-model" aria-hidden="true"></div>
        <div class="inspected-video" aria-hidden="true"></div>
        <p class="inspector-hint"></p>
      </div>
    `;
  }
  const inspectImg   = inspector.querySelector(".inspected-image");
  const inspectModel = inspector.querySelector(".inspected-model");
  const inspectVideo = inspector.querySelector(".inspected-video");
  const inspectHint  = inspector.querySelector(".inspector-hint");

  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // 全局音量记忆：一次访问内所有视频（信封 + 放大）共享
  let globalVol = 1;

  // ============================================
  // 音量提示：桌面端全局第一次出声时，右侧浮现"滚动中键调音量"，约 3 秒淡出，整次访问只出现一次
  // ============================================
  let volHintDismissed = false;   // 点过 ✕ = 整次访问永久不再弹
  let volHintEl = null;           // 当前是否正显示着，防止重复创建
  function removeVolHint() {
    if (volHintEl) { volHintEl.remove(); volHintEl = null; }
  }
  function dismissVolHint() {     // 点 ✕：移除 + 永久上锁
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

    void hint.offsetWidth;          // 强制 reflow，让 transition 生效
    hint.classList.add("show");
  }

  // inspector 内运行的实例，关闭时清理
  let activeModel = null;
  let activeInspVideo = null;   // { player, dispose }
  let pausedInPlace = null;     // 被暂停的信封内视频 player，关闭后恢复

  window.openEnvelope = function(id, skipHistory) {
    const artist = ARTISTS.find(a => a.id === id);
    if (!artist) return;

    renderEnvelope(artist);
    document.body.classList.add("envelope-open");

    void overlay.offsetWidth;

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");

    if (!skipHistory) {
      history.pushState({ artistId: id }, "", `?id=${id}`);
    }
    document.title = `${artist.name} | OMMFA`;
  };

  function closeEnvelope(skipHistory) {
    if (!overlay.classList.contains("open")) return;

    if (inspector.classList.contains("active")) {
      closeInspector();
      return;
    }

    document.body.classList.remove("envelope-open");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    removeVolHint();

    if (!skipHistory) {
      history.pushState(null, "", window.location.pathname);
    }
    document.title = "Artist | OMMFA";

    if (document.activeElement) {
      document.activeElement.blur();
    }
  }

  function renderEnvelope(artist) {
    const envelopeElement = overlay.querySelector(".envelope");
    let tab = envelopeElement.querySelector(".envelope-tab");
    if (!tab) {
      tab = document.createElement("div");
      tab.className = "envelope-tab";
      envelopeElement.insertBefore(tab, inner);
    }
    tab.textContent = artist.name;

    const websiteHTML = artist.website
      ? `<a class="envelope-card-link" href="${artist.website}" target="_blank" rel="noopener">${artist.website.replace(/^https?:\/\//, "")} ↗</a>`
      : "";

    const cardHTML = `
      <div class="envelope-card">
        <p class="envelope-card-city">${artist.city || ""}</p>
        <p class="envelope-card-bio">${artist.bio || ""}</p>
        ${websiteHTML}
      </div>
    `;

    // 散落物：智能锚点打散排版（image / video / model）
    const itemsHTML = (artist.items || []).map((item, i) => {
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
      const basePath = `assets/images/artist/${artist.id}`;
      const style = `
        left: ${safeX}%;
        top: ${safeY}%;
        width: ${itemWidth}%;
        transform: rotate(${rotate}deg);
      `;

      const type = item.type || "image";

      // —— 视频：就地静音 loop，可点击进 inspector 放大 ——
      if (type === "video" && item.vimeo) {
        const uid = `vid-${Math.random().toString(36).slice(2, 9)}`;
        const soundFlag = item.sound ? "1" : "0";
        return `
          <div class="envelope-item is-video" style="${style}"
               data-vimeo="${item.vimeo}" data-sound="${soundFlag}" data-desc="${desc}">
            <div class="ev-video" id="${uid}">
              <iframe src="https://player.vimeo.com/video/${item.vimeo}?background=1&loop=1&autopause=0&muted=1"
                      frameborder="0" allow="autoplay" title="${desc}"></iframe>
              <span class="ev-video-hit" aria-label="open"></span>
            </div>
          </div>
        `;
      }

      // —— 3D 模型：信封里静态 poster，不转 ——
      if (type === "model" && item.src) {
        const posterImg = item.poster
          ? `<img src="${basePath}/${item.poster}" alt="">`
          : '';
        return `
          <div class="envelope-item is-model" style="${style}"
               data-model="${basePath}/${item.src}" data-desc="${desc}">
            <div class="ev-model-poster">${posterImg}</div>
          </div>
        `;
      }

      // —— 默认：图片 ——
      return `
        <div class="envelope-item" style="${style}" data-src="${basePath}/${item.src}" data-desc="${desc}">
          <img src="${basePath}/${item.src}" alt="">
        </div>
      `;
    }).join("");

    inner.innerHTML = cardHTML + itemsHTML;

    // 图片：点击进 inspector
    inner.querySelectorAll(".envelope-item:not(.is-video):not(.is-model)").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        openInspector(el.dataset.src, el.dataset.desc);
      });
    });

    // 3D：点击进 inspector
    inner.querySelectorAll(".envelope-item.is-model").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        openModelInspector(el.dataset.model, el.dataset.desc);
      });
    });

    // 视频：就地激活 + 点击进 inspector
    if (window.initEnvelopeVideos) window.initEnvelopeVideos(inner);

    // 接入自定义 bio 滚动条
    if (window.initBioScroller) window.initBioScroller();
  }

  // ---- 图片 inspector ----
  function openInspector(imgSrc, imgDesc) {
    resetInspectorSlots();
    inspectImg.style.display = "";
    inspectImg.src = imgSrc;
    inspectHint.textContent = imgDesc || "";
    activateInspector();
  }

  // ---- 3D inspector ----
  function openModelInspector(modelSrc, desc) {
    resetInspectorSlots();
    inspectModel.classList.add("active");
    inspectHint.textContent = desc || "";
    activateInspector();

    if (activeModel && activeModel.dispose) activeModel.dispose();
    activeModel = mountModel(inspectModel, modelSrc);
  }

  // ---- 视频 inspector：放大播放，信封内那个暂停 ----
  function openVideoInspector(vimeoId, soundFlag, desc, inPlacePlayer) {
    resetInspectorSlots();
    inspectVideo.classList.add("active");
    inspectHint.textContent = desc || "";
    activateInspector();

    if (activeInspVideo && activeInspVideo.dispose) activeInspVideo.dispose();

    // 先读信封里那个的当前进度，放大播放器从这里接续
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
    inspector.setAttribute("aria-hidden", "true");

    inspectImg.style.display = "";
    inspectModel.classList.remove("active");
    inspectVideo.classList.remove("active");

    if (activeModel && activeModel.dispose) {
      activeModel.dispose();
      activeModel = null;
    }

    // 读放大播放器的进度，回写给信封里那个，再恢复播放
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

  closeBtn.addEventListener("click", () => closeEnvelope());
  inspector.addEventListener("click", () => closeInspector());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeEnvelope();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (inspector.classList.contains("active")) {
        closeInspector();
      } else if (overlay.classList.contains("open")) {
        closeEnvelope();
      }
    }
  });

  window.addEventListener("popstate", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      window.openEnvelope(id, true);
    } else {
      closeEnvelope(true);
    }
  });

  setTimeout(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) window.openEnvelope(id, true);
  }, 50);

  // ============================================
  // 就地视频：static loop + 桌面 hover 出声 + 点击进 inspector
  // ============================================
  window.initEnvelopeVideos = function(scope) {
    if (typeof Vimeo === "undefined") return;

    scope.querySelectorAll(".envelope-item.is-video:not([data-ready])").forEach(wrap => {
      wrap.setAttribute("data-ready", "1");
      const iframe = wrap.querySelector("iframe");
      const hit = wrap.querySelector(".ev-video-hit");
      const canSound = wrap.getAttribute("data-sound") === "1";
      const vimeoId = wrap.getAttribute("data-vimeo");
      const desc = wrap.getAttribute("data-desc") || "";
      const player = new Vimeo.Player(iframe);
      wrap._vimeoPlayer = player;

      // 桌面：就地 hover 出声（仅 sound:true）。手机就地保持静音，放大后再切声。
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

      // 点击进 inspector 放大
      const openLarge = (e) => {
        e.stopPropagation();
        openVideoInspector(vimeoId, canSound ? "1" : "0", desc, player);
      };
      if (hit) hit.addEventListener("click", openLarge);
    });
  };

  // ============================================
  // inspector 放大视频：独立 player，桌面 hover 出声 / 手机点击切声
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
    // 精确跳转（URL 的 #t 只能到秒，这里补一次精确 setCurrentTime）
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
        // 手机：进 inspector 即出声；点击在 出声/静音 间切换
        hitLayer.style.cursor = "pointer";
        if (globalVol <= 0) globalVol = 1;        // 之前被静音过则恢复
        player.ready().then(() => player.setVolume(globalVol)).catch(() => {});
        let on = true;                            // 进入即出声，初始为 on
        clickHandler = (e) => {
          e.stopPropagation();
          on = !on;
          globalVol = on ? 1 : 0;
          player.setVolume(globalVol).catch(() => {});
        };
        hitLayer.addEventListener("click", clickHandler);
      } else {
        // 桌面：hover 出声 + 滚轮调音量
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
  // 3D 模型：inspector 里加载 GLB，hover 跟随鼠标转
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
    const BASE_Z = 6;      // 标准距离
    const MIN_Z = 2;       // 最近（最大放大）
    const MAX_Z = 10;      // 最远（最小缩小）
    let targetZ = BASE_Z;  // 目标距离，滚轮/捏合改它，动画里平滑逼近
    camera.position.set(0, 0, BASE_Z);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.72;   // 调暗，避免浅色模型过曝发白
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
    let hovering = true;   // inspector 打开期间始终跟随，不自动转回
    let localMX = 0, localMY = 0;
    let rafId = null;
    let disposed = false;

    // hover 范围 = 整个页面：鼠标在屏幕任何位置移动，模型都跟着转
    const onWinMove = (e) => {
      localMX = (e.clientX / window.innerWidth) - 0.5;
      localMY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", onWinMove);
    // 手机：手指拖动转动模型
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        localMX = (e.touches[0].clientX / window.innerWidth) - 0.5;
        localMY = (e.touches[0].clientY / window.innerHeight) - 0.5;
      }
    };
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // —— 缩放：电脑滚轮 ——
    const onWheel = (e) => {
      e.preventDefault();
      targetZ += e.deltaY * 0.005;
      targetZ = Math.max(MIN_Z, Math.min(MAX_Z, targetZ));
    };
    host.addEventListener("wheel", onWheel, { passive: false });

    // —— 缩放：手机双指捏合 ——
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
        targetZ = pinchStartZ / ratio;   // 指距变大=放大=z变小
        targetZ = Math.max(MIN_Z, Math.min(MAX_Z, targetZ));
      }
    };
    host.addEventListener("touchstart", onTouchStart, { passive: true });
    host.addEventListener("touchmove", onPinchMove, { passive: true });

    // —— 双击复位到标准 ——
    const onDblReset = () => { targetZ = BASE_Z; };
    // 模型区域内的点击不冒泡到 inspector（否则会触发退出）
    const onModelClick = (e) => e.stopPropagation();
    host.addEventListener("click", onModelClick);
    host.addEventListener("dblclick", onDblReset);
    // 手机双击复位（并阻止冒泡，避免误触退出）
    let lastTap = 0;
    const onTapReset = (e) => {
      e.stopPropagation();          // 模型区触摸不冒泡到 inspector
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

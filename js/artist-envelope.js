// ============================================
// Artist 档案袋核心交互：大倾角飞入 + 无边框拾取 + 左对齐描述
// ============================================

(function() {
  const overlay  = document.getElementById("envelope-overlay");
  if (!overlay) return;

  const inner     = overlay.querySelector(".envelope-inner");
  const closeBtn  = overlay.querySelector(".envelope-close");
  const inspector = overlay.querySelector(".envelope-inspector");

  // 【核心修改】：自动重构拾取层的 HTML 结构，套一个 wrapper 以保证文字和图片完美左侧对齐
  if (inspector && !inspector.querySelector(".inspector-wrapper")) {
    inspector.innerHTML = `
      <div class="inspector-wrapper">
        <img class="inspected-image" src="" alt="">
        <p class="inspector-hint"></p>
      </div>
    `;
  }
  const inspectImg = inspector.querySelector(".inspected-image");
  const inspectHint = inspector.querySelector(".inspector-hint");

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
    document.title = `${artist.name} — OMMFA`;
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

    if (!skipHistory) {
      history.pushState(null, "", window.location.pathname);
    }
    document.title = "Artist — OMMFA";
    
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

   // 3. 散落物：智能锚点打散排版
    const itemsHTML = (artist.items || []).map((item, i) => {
      const itemWidth = (item.w || 30) * 0.7; 
      const rotate = item.rotate !== undefined ? item.rotate : (Math.random() * 30 - 15);
      
      // 【核心修复】：智能锚点系统
      // 预先在右半区规划好 5 个绝对不会重叠的“基本阵位”
      const anchors = [
        { x: 54, y: 12 }, // 阵位 1：左上
        { x: 74, y: 48 }, // 阵位 2：右下
        { x: 76, y: 14 }, // 阵位 3：右上
        { x: 55, y: 55 }, // 阵位 4：左下
        { x: 65, y: 32 }  // 阵位 5：正中
      ];
      
      // 按照图片的顺序，依次分配到这 5 个阵位里
      const anchor = anchors[i % anchors.length];
      
      // 在基础阵位上，加上 ±4% 的随机微小偏移，让它看起来是人手随意撒的
      const autoX = anchor.x + (Math.random() * 8 - 4);
      const autoY = anchor.y + (Math.random() * 8 - 4);
      
      // 依然保留你的手动控制权：只要你在 js 里写了 x/y，就绝对服从你的指令
      const finalX = item.x !== undefined ? item.x : autoX;
      const finalY = item.y !== undefined ? item.y : autoY;
      
      // 最后一道防线：绝对不溢出档案袋边缘
      const safeX = Math.max(50, Math.min(finalX, 95 - itemWidth));
      const safeY = Math.max(5, Math.min(finalY, 95 - (itemWidth * 1.2)));
      
      const desc = item.desc ? item.desc.replace(/"/g, '&quot;') : '';

      const style = `
        left: ${safeX}%;
        top: ${safeY}%;
        width: ${itemWidth}%;
        transform: rotate(${rotate}deg);
      `;
      return `
        <div class="envelope-item" style="${style}" data-src="assets/images/artist/${artist.id}/${item.src}" data-desc="${desc}">
          <img src="assets/images/artist/${artist.id}/${item.src}" alt="">
        </div>
      `;
    }).join("");

    inner.innerHTML = cardHTML + itemsHTML;

    inner.querySelectorAll(".envelope-item").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        openInspector(el.dataset.src, el.dataset.desc);
      });
    });

    // 接入自定义 bio 滚动条
    if (window.initBioScroller) window.initBioScroller();
  }

  function openInspector(imgSrc, imgDesc) {
    inspectImg.src = imgSrc;
    inspectHint.textContent = imgDesc || ""; // 注入描述文本，如果没有则留空
    inner.classList.add("blur-contents");
    inspector.classList.add("active");
    inspector.setAttribute("aria-hidden", "false");
  }

  function closeInspector() {
    inner.classList.remove("blur-contents");
    inspector.classList.remove("active");
    inspector.setAttribute("aria-hidden", "true");
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
})();

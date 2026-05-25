// ============================================
// 站点配置 + 导航 + 页脚（全站共用）
// 改这里 = 改全站
// ============================================

// ----- 配置 -----
// 想改名字/链接/邮箱，只动 SITE 这个对象，下面的代码不用动
const SITE = {
  // 页脚链接：label 是显示的文字，href 是链接地址
  // 想加新链接就在数组里加一个对象；想删就删那一行
  // mailto: 开头 = 邮件链接；https:// 开头 = 普通网址
  footerLinks: [
    { label: "OMMFA",  href: "https://www.ommfa.org" },
    { label: "CONTACT",  href: "mailto:info@ommfa.org"  }
  ],
  
  copyright: '© <span class="brand">OMMFA</span> 2020 — 2026',

  // 主导航菜单
 nav: [
    { label: '<span class="brand">OMMFA</span>',    file: "index.html",    active: "home" },
    { label: "Threads",  file: "threads.html",  active: "threads"  },
    { label: "Journal", file: "journal.html", active: "journal" },
    { label: "Artist",   file: "artist.html",   active: "artist"   },
    { label: "About",    file: "about.html",    active: "about"    }
  ]
};

// ----- 渲染导航 -----
function renderNav() {
  const mount = document.getElementById("nav-mount");
  if (!mount) return;

  const currentPage = document.body.dataset.page;
  // 检测当前页是否在子文件夹（项目页放在 projects/ 里）
  // body 标签上有 data-subfolder="true" 就在子文件夹
  const isInSubfolder = document.body.dataset.subfolder === "true";
  const prefix = isInSubfolder ? "../" : "";       // 子文件夹的链接前面加 ../

  const links = SITE.nav.map((item, i) => {
    const isLogo = i === 0;
    const isActive = item.active === currentPage;
    const cls = [
      isLogo ? "logo" : "",
      isActive ? "active" : ""
    ].filter(Boolean).join(" ");
    
    return `<a href="${prefix}${item.file}" class="${cls}">${item.label}</a>`;
  }).join('<span class="dot">·</span>');

  const isHome = currentPage === "home";
  const navClass = isHome ? "site-nav" : "site-nav site-nav-inner";
  
  if (isHome) {
    mount.innerHTML = `<nav class="${navClass}">${links}</nav>`;
  } else {
    mount.innerHTML = `
      <header class="page-header">
        <nav class="${navClass}">${links}</nav>
      </header>
    `;
  }
}

// ----- 渲染页脚 -----
function renderFooter() {
  const mount = document.getElementById("footer-mount");
  if (!mount) return;

  // 自动遍历 footerLinks 数组生成链接，中间用 · 分隔
  // mailto: 开头的不在新标签页打开；其他链接 target=_blank
  const links = SITE.footerLinks.map(link => {
    const isMail = link.href.startsWith("mailto:");
    const target = isMail ? "" : ' target="_blank" rel="noopener"';
    return `<a href="${link.href}"${target}>${link.label}</a>`;
  }).join(' · ');

  mount.innerHTML = `
    <footer class="site-footer">
      <span>${SITE.copyright}</span>
      <span>${links}</span>
    </footer>
  `;
}

renderNav();
renderFooter();
/* ============================================================
   OMMFA — Newsletter popup (bottom-right, translucent)
   Self-contained: injects markup + styles, handles Netlify
   Forms submission, delayed fade-in, dismiss-for-session.
   Backend: Netlify Forms (form name: "newsletter")
   ============================================================ */

(function () {
  // Permanently dismissed this session (user clicked the x or subscribed) -> never show again
  if (sessionStorage.getItem('ommfa-newsletter-dismissed')) return;

  // Has it already appeared earlier this session (on a previous page)?
  // If yes, show instantly on this page with no delay -> feels continuous across pages.
  var alreadyShown = sessionStorage.getItem('ommfa-newsletter-shown');

  /* ---------- styles ---------- */
  var css = `
  .nl-popup {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 320px;
    height: 170px;
    border-radius: 5px;
    max-width: calc(100vw - 3rem);
    background: rgba(253, 251, 245, 0.28);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    padding: 1.6rem 1.5rem 1.4rem;
    z-index: 9999;
    font-family: var(--font-sans, 'Rubik', sans-serif);
    opacity: 0;
    transform: translateY(8px);
    transition: opacity .4s ease, transform .4s ease;
    box-shadow: 0 8px 40px rgba(0,0,0,0.10);
  }
  .nl-popup.nl-visible { opacity: 1; transform: translateY(0); }
  .nl-popup__text {
    font-size: 0.8rem;
    line-height: 1.55;
    color: var(--ink, #1a1a1a);
    margin: 0 1.4rem 1.3rem 0;
    position: relative;
  }
  .nl-popup__close {
    position: absolute;
    top: 0;
    right: -0.8rem;
    background: none;
    border: none;
    font-size: 0.7rem;
    line-height: 1;
    cursor: pointer;
    color: var(--ink-soft, #5a5a5a);
    padding: 2px;
  }
  .nl-popup__close:hover { color: var(--ink, #1a1a1a); }
  .nl-popup__input {
    width: 100%;
    box-sizing: border-box;
    border: none;
    background: transparent;
    padding: 0.5rem 0;
    font-size: 0.85rem;
    font-family: inherit;
    color: var(--ink, #1a1a1a);
    margin-bottom: 1.4rem;
    outline: none;
  }
  .nl-popup__input::placeholder { color: var(--ink-soft, #5a5a5a); }
  .nl-popup__btn {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--ink, #1a1a1a);
    cursor: pointer;
    font-family: inherit;
    transition: opacity .2s;
  }
  .nl-popup__btn:hover { opacity: 0.6; }
  .nl-popup__msg {
    font-size: 0.85rem;
    line-height: 1.55;
    color: var(--ink, #1a1a1a);
    margin: 0;
  }
  `;

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------- markup ---------- */
  var popup = document.createElement('div');
  popup.className = 'nl-popup';
  popup.setAttribute('role', 'complementary');
  popup.setAttribute('aria-label', 'Newsletter sign-up');
  popup.innerHTML =
    '<p class="nl-popup__text">Stay in touch. Receive updates on OMMFA projects and open calls.' +
      '<button class="nl-popup__close" aria-label="Close">\u2715</button>' +
    '</p>' +
    '<form name="newsletter" method="POST" data-netlify="true" netlify-honeypot="bot-field" class="nl-popup__form">' +
      '<input type="hidden" name="form-name" value="newsletter">' +
      '<p style="display:none;"><label>Don\u2019t fill this out: <input name="bot-field"></label></p>' +
      '<input class="nl-popup__input" type="email" name="email" placeholder="Email address" required autocomplete="email">' +
      '<button class="nl-popup__btn" type="submit">Submit</button>' +
    '</form>';

  document.body.appendChild(popup);

  /* ---------- behaviour ---------- */
  var form = popup.querySelector('form');
  var closeBtn = popup.querySelector('.nl-popup__close');

  function dismiss() {
    sessionStorage.setItem('ommfa-newsletter-dismissed', '1');
    popup.classList.remove('nl-visible');
    setTimeout(function () { popup.remove(); }, 400);
  }

  closeBtn.addEventListener('click', dismiss);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
      .then(function () {
        form.innerHTML = '<p class="nl-popup__msg">Thank you. We\u2019ll be in touch.</p>';
        sessionStorage.setItem('ommfa-newsletter-dismissed', '1');
        setTimeout(dismiss, 2500);
      })
      .catch(function () {
        form.innerHTML = '<p class="nl-popup__msg">Something went wrong. Please try again later.</p>';
      });
  });

  /* First appearance: delayed fade-in (~4s). Subsequent pages: instant, no gap. */
  function reveal() {
    popup.classList.add('nl-visible');
    sessionStorage.setItem('ommfa-newsletter-shown', '1');
  }

  if (alreadyShown) {
    requestAnimationFrame(reveal);
  } else {
    setTimeout(reveal, 4000);
  }
})();

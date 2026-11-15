// Result flash: dims and blurs the page, shows the result centred on the wheel,
// then fades out. Purely visual (aria-hidden); pages keep their own aria-live text.
(function () {
  const HOLD_MS = 3000;
  let overlay = null;
  let label = null;
  let timer = null;

  function ensure() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'flash';
    overlay.setAttribute('aria-hidden', 'true');
    label = document.createElement('p');
    label.className = 'flash-text';
    overlay.append(label);
    document.body.append(overlay);
  }

  // Centre of the wheel in viewport coordinates (falls back to screen centre).
  function wheelCentre() {
    const canvas = document.querySelector('.stage canvas');
    if (!canvas) return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const r = canvas.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  window.flashResult = function (text) {
    ensure();
    clearTimeout(timer);
    label.textContent = text;
    const c = wheelCentre();
    label.style.left = c.x + 'px';
    label.style.top = c.y + 'px';
    overlay.classList.add('show');
    timer = setTimeout(() => overlay.classList.remove('show'), HOLD_MS);
  };
})();

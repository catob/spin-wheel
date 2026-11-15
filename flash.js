// Full-screen result flash: fades in, holds, fades out. Purely visual (aria-hidden);
// pages keep their own aria-live text for screen readers.
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

  window.flashResult = function (text) {
    ensure();
    clearTimeout(timer);
    label.textContent = text;
    overlay.classList.add('show');
    timer = setTimeout(() => overlay.classList.remove('show'), HOLD_MS);
  };
})();

// Normal wheel page: option list UI + random spin.
(function () {
  let options = ['Pizza', 'Sushi', 'Tacos', 'Burgers'];
  const els = {
    canvas: document.getElementById('wheel'),
    spin: document.getElementById('spin'),
    result: document.getElementById('result'),
    list: document.getElementById('options'),
    form: document.getElementById('add-form'),
    input: document.getElementById('new-option'),
    removeWinner: document.getElementById('remove-winner'),
    error: document.getElementById('error'),
    title: document.getElementById('title'),
    heading: document.getElementById('wheel-title'),
  };
  const wheel = window.createWheel(els.canvas, options);

  function render() {
    wheel.setLabels(options);
    els.list.innerHTML = '';
    options.forEach((text, i) => {
      const li = document.createElement('li');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = text;
      input.setAttribute('aria-label', 'Option ' + (i + 1));
      input.addEventListener('change', () => {
        const v = input.value.trim();
        if (v) options[i] = v; else options.splice(i, 1);
        render();
      });
      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'secondary';
      del.textContent = 'Remove';
      del.setAttribute('aria-label', 'Remove ' + text);
      del.addEventListener('click', () => { options.splice(i, 1); render(); });
      li.append(input, del);
      els.list.append(li);
    });
    els.spin.disabled = options.length < 2;
    els.error.textContent = options.length < 2 ? 'Add at least 2 options to spin.' : '';
  }

  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = els.input.value.trim();
    if (!v) return;
    options.push(v);
    els.input.value = '';
    render();
  });

  els.spin.addEventListener('click', async () => {
    if (wheel.isSpinning()) return;
    els.spin.disabled = true;
    els.result.textContent = '';
    const index = await wheel.spinRandom();
    els.result.textContent = options[index];
    window.flashResult(options[index]);
    if (els.removeWinner.checked) {
      options.splice(index, 1);
      setTimeout(render, 1200);
    } else {
      els.spin.disabled = false;
    }
  });

  // Heading and form field edit the same title; keep them in sync.
  function bindTitle(source, other) {
    source.addEventListener('input', () => {
      other.value = source.value;
      document.title = source.value.trim() || 'Spin Wheel';
    });
  }
  bindTitle(els.title, els.heading);
  bindTitle(els.heading, els.title);

  render();
})();

// Reusable wheel: drawing + spin animation. No DOM outside the given canvas.
(function () {
  // Slice fill + a label colour that keeps contrast on that fill.
  const SLICES = [
    { bg: '#5b3df5', fg: '#ffffff' },
    { bg: '#ffc247', fg: '#2a1f00' },
    { bg: '#ff5d73', fg: '#ffffff' },
    { bg: '#2ec4b6', fg: '#06312d' },
    { bg: '#3a86ff', fg: '#ffffff' },
    { bg: '#ff9ecb', fg: '#3d0a24' },
  ];
  const FONT = '"Bricolage Grotesque", system-ui, sans-serif';
  const TAU = Math.PI * 2;

  function createWheel(canvas, labels) {
    const ctx = canvas.getContext('2d');
    let items = labels.slice();
    let rotation = 0;
    let spinning = false;

    function draw() {
      const size = canvas.width;
      const c = size / 2;
      const radius = c - 8;
      ctx.clearRect(0, 0, size, size);
      if (items.length === 0) return;
      const arc = TAU / items.length;
      items.forEach((label, i) => {
        const start = rotation + i * arc;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.arc(c, c, radius, start, start + arc);
        ctx.closePath();
        // Avoid two touching slices sharing a colour when the count wraps.
        const slice = SLICES[(i + (i === items.length - 1 && items.length % SLICES.length === 1 ? 2 : 0)) % SLICES.length];
        ctx.fillStyle = slice.bg;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(start + arc / 2);
        ctx.fillStyle = slice.fg;
        ctx.font = '700 ' + Math.round(size / 18) + 'px ' + FONT;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const text = label.length > 16 ? label.slice(0, 15) + '…' : label;
        ctx.fillText(text, radius - size / 14, 0);
        ctx.restore();
      });
      // Hub
      ctx.beginPath();
      ctx.arc(c, c, size / 22, 0, TAU);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#5b3df5';
      ctx.stroke();
    }

    // Angle (radians) where slice `index` is centred under the top pointer.
    function targetRotation(index, jitter) {
      const arc = TAU / items.length;
      return -Math.PI / 2 - (index + 0.5 + jitter) * arc;
    }

    // Spin so slice `index` ends under the pointer. Resolves with that index.
    function spinTo(index, opts) {
      const o = Object.assign({ duration: 5000, turns: 6 }, opts);
      if (spinning || items.length === 0) return Promise.resolve(null);
      spinning = true;
      const jitter = (Math.random() - 0.5) * 0.7; // stay inside the slice
      const from = rotation;
      let to = targetRotation(index, jitter);
      to += Math.ceil((from - to) / TAU + o.turns) * TAU;
      const t0 = performance.now();
      return new Promise((resolve) => {
        function frame(now) {
          const t = Math.min((now - t0) / o.duration, 1);
          const eased = 1 - Math.pow(1 - t, 4);
          rotation = from + (to - from) * eased;
          draw();
          if (t < 1) return requestAnimationFrame(frame);
          rotation = to;
          spinning = false;
          resolve(index);
        }
        requestAnimationFrame(frame);
      });
    }

    function spinRandom(opts) {
      return spinTo(Math.floor(Math.random() * items.length), opts);
    }

    function setLabels(next) { items = next.slice(); draw(); }
    function isSpinning() { return spinning; }

    draw();
    // Redraw once the web font is ready so labels use it.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
    return { spinTo, spinRandom, setLabels, isSpinning };
  }

  window.createWheel = createWheel;
})();

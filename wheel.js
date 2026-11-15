// Reusable wheel: drawing + spin animation. No DOM outside the given canvas.
(function () {
  const COLORS = ['#e76f51', '#f4a261', '#e9c46a', '#2a9d8f', '#264653', '#8ab17d', '#b56576', '#6d597a'];
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
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(start + arc / 2);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + Math.round(size / 20) + 'px system-ui, sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const text = label.length > 16 ? label.slice(0, 15) + '…' : label;
        ctx.fillText(text, radius - 16, 0);
        ctx.restore();
      });
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
    return { spinTo, spinRandom, setLabels, isSpinning };
  }

  window.createWheel = createWheel;
})();

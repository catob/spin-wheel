// Joke page: two fair-looking slices, always lands on "Stay".
(function () {
  const LABELS = ['Go Home', 'Stay'];
  const STAY = LABELS.indexOf('Stay');
  const quips = [
    'Fate has spoken. Another round.',
    'The wheel insists. Stay.',
    'Science says: one more drink.',
    'Home will still be there later.',
    'Unanimous. Of one wheel.',
  ];
  let spins = 0;
  const wheel = window.createWheel(document.getElementById('wheel'), LABELS);
  const spin = document.getElementById('spin');
  const result = document.getElementById('result');
  const aside = document.getElementById('aside');

  spin.addEventListener('click', async () => {
    if (wheel.isSpinning()) return;
    spin.disabled = true;
    result.textContent = '';
    aside.textContent = '';
    await wheel.spinTo(STAY, { duration: 6000, turns: 7 });
    result.textContent = 'Stay';
    aside.textContent = quips[spins++ % quips.length];
    spin.disabled = false;
    spin.textContent = 'Spin again (it won’t change)';
  });
})();

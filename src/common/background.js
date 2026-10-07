// The landscape is presentation only; bookmark and configuration state are untouched.
(() => {
  const video = document.querySelector('#landscape-video');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pausedByUser = false;
  let failed = false;

  const announce = () => document.dispatchEvent(new CustomEvent('landscape-state', {
    detail: { paused: video.paused, reducedMotion: reducedMotion.matches, failed }
  }));

  const update = () => {
    const shouldPlay = !pausedByUser && !reducedMotion.matches && !document.hidden && !failed;

    if (shouldPlay) {
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.play().catch(announce);
    } else {
      video.pause();
    }

    video.style.display = reducedMotion.matches || failed ? 'none' : '';

    announce();
  };

  document.addEventListener('landscape-toggle', () => {
    pausedByUser = !video.paused;
    update();
  });
  document.addEventListener('landscape-ready', update);
  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
  video.addEventListener('play', announce);
  video.addEventListener('pause', announce);
  video.addEventListener('error', () => { failed = true; update(); });
  update();
})();

function smoothScrollToTop(duration = 800) {
  const start = window.scrollY;
  const startTime = performance.now();

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    window.scrollTo(0, start * (1 - eased));

    if (progress < 1) requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
}

export { smoothScrollToTop };

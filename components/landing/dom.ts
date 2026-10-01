/** Runs `fn` now and at most once per frame while the page scrolls or resizes. Returns the cleanup. */
export function onScrollFrame(fn: () => void) {
  let raf = 0;
  const schedule = () => {
    if (!raf)
      raf = requestAnimationFrame(() => {
        raf = 0;
        fn();
      });
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  fn();
  return () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(raf);
  };
}

/** Reports whether `el` is on screen whenever that changes. Returns the cleanup. */
export function onInView(el: Element, cb: (inView: boolean) => void) {
  const io = new IntersectionObserver((entries) => cb(entries[entries.length - 1].isIntersecting));
  io.observe(el);
  return () => io.disconnect();
}

/** Clamps `v` to 0..1. */
export const unit = (v: number) => Math.max(0, Math.min(1, v));

export const wait = async (v: number) =>
  new Promise(resolve => {
    setTimeout(resolve, v);
  });

export const animate = (
  duration: number,
  easing: (v: number) => number,
  cb: (easingValue: number) => boolean | void,
) => {
  let sec: number;
  let timer: number;
  const frame = (time: number) => {
    if (!sec) {
      sec = time;
    }
    const elapsed = (time - sec) / 16;
    const normalizedTime = Math.min(elapsed, duration);

    const pos = easing(normalizedTime / duration);
    const shouldContinue = cb(pos);
    if (pos === 1 || shouldContinue === false) {
      cancelAnimationFrame(timer);
      return;
    }
    timer = requestAnimationFrame(frame);
  };

  timer = requestAnimationFrame(frame);
  return timer;
};

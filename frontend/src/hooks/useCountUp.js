import { useEffect, useRef, useState } from 'react';

/**
 * useCountUp — menghitung angka dari nilai sebelumnya ke target dengan easing halus.
 * Menghormati prefers-reduced-motion (langsung menampilkan target).
 *
 * Contoh:
 *   const total = useCountUp(ringkasan.total_kejadian);
 *   <span>{total.toLocaleString('id-ID')}</span>
 */
export default function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const safeTarget = Number(target) || 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      from.current = safeTarget;
      setValue(safeTarget);
      return undefined;
    }

    const begin = from.current;
    const startedAt = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(begin + (safeTarget - begin) * eased);
      from.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
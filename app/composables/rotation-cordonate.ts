import { motion, useTime, useTransform } from "motion-v";

interface HeroRotationParams {
  origin: number;
  distance: number;
  timeOffset: number;
  duration: number;
}

export function useHeroRotation({
  origin = 0,
  distance = 1,
  duration = 1,
  timeOffset = 0,
}: HeroRotationParams) {
  const time = useTime();

  const transform = useTransform(() => {
    const angle = (time.get() + timeOffset * 12500) / 2000 / duration;
    const x = Math.cos(angle) * distance + origin;
    const y = Math.sin(angle) * distance + origin;
    return `translate(${x}px, ${y}px)`;
  });

  return {
    transform,
  };
}

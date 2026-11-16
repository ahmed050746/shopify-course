import { useEffect, useRef } from "react";
import { motion, useAnimation, useReducedMotion } from "framer-motion";

/** Visible arc reaches this far across the viewport (from the left edge). */
const REACH_VW = 75;
/** Semicircle clip needs 2× diameter so the curve ends at REACH_VW. */
const BOX_VW = REACH_VW * 2;

const HALF_CIRCLE_CLIP = "circle(50% at 0% 50%)";

export default function HeroOrb({ onSettled, onHidden }) {
  const reduceMotion = useReducedMotion();
  const controls = useAnimation();
  const onSettledRef = useRef(onSettled);
  const onHiddenRef = useRef(onHidden);
  onSettledRef.current = onSettled;
  onHiddenRef.current = onHidden;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (reduceMotion) {
        await controls.set({ x: 0, y: "-50%", scale: 1, opacity: 0 });
        if (!cancelled) {
          onSettledRef.current?.();
          onHiddenRef.current?.();
        }
        return;
      }

      await controls.start({
        x: 0,
        y: "-50%",
        scale: 1,
        opacity: 1,
        transition: {
          duration: 1.85,
          ease: [0.22, 1, 0.36, 1],
        },
      });

      if (cancelled) return;
      onSettledRef.current?.();

      await controls.start({
        opacity: 0,
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
      });

      if (!cancelled) onHiddenRef.current?.();
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [controls, reduceMotion]);

  return (
    <motion.div
      className="pointer-events-none absolute left-0 z-[8] origin-left"
      style={{
        top: "50%",
        width: `${BOX_VW}vw`,
        height: `min(${BOX_VW}vw, 85dvh)`,
        clipPath: HALF_CIRCLE_CLIP,
        WebkitClipPath: HALF_CIRCLE_CLIP,
        transformOrigin: "0% 50%",
        willChange: "transform",
      }}
      initial={{ x: "-42vw", y: "-50%", scale: 0.18, opacity: 0.9 }}
      animate={controls}
      aria-hidden
    >
      <div className="relative h-full w-full overflow-hidden rounded-full">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(ellipse 75% 70% at 40% 36%, rgba(255, 130, 70, 0.12) 0%, transparent 58%),
              radial-gradient(ellipse 70% 65% at 50% 58%, rgba(99, 102, 241, 0.09) 0%, transparent 62%),
              radial-gradient(ellipse 85% 80% at 32% 50%, rgba(56, 189, 248, 0.06) 0%, transparent 68%),
              rgba(5, 5, 7, 0.94)
            `,
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(ellipse 55% 80% at 78% 50%, rgba(255, 196, 140, 0.55) 0%, rgba(167, 139, 250, 0.22) 28%, transparent 62%)",
          }}
          initial={reduceMotion ? { opacity: 0.28 } : { opacity: 0.05 }}
          animate={
            reduceMotion
              ? { opacity: 0.28 }
              : { opacity: [0.05, 0.85, 0.32] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 1.85,
                  times: [0, 0.62, 1],
                  ease: [0.22, 1, 0.36, 1],
                }
          }
        />

        {!reduceMotion && (
          <motion.div
            className="absolute top-[-12%] h-[124%] w-[38%]"
            style={{
              background:
                "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.08) 28%, rgba(255,236,210,0.72) 48%, rgba(196,181,253,0.45) 62%, transparent 82%)",
              filter: "blur(10px)",
            }}
            initial={{ x: "-40%", opacity: 0 }}
            animate={{ x: "210%", opacity: [0, 1, 0.85, 0] }}
            transition={{
              duration: 1.85,
              times: [0, 0.28, 0.62, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        )}
      </div>
    </motion.div>
  );
}
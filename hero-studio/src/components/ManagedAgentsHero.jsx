import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import HeroNavbar from "./HeroNavbar.jsx";
import HeroOrb from "./HeroOrb.jsx";
import FloatingElements from "./FloatingElements.jsx";

export default function ManagedAgentsHero() {
  const [orbSettled, setOrbSettled] = useState(false);
  const [showPortrait, setShowPortrait] = useState(false);
  const reduceMotion = useReducedMotion();
  const showFloats = reduceMotion || orbSettled;

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-[#050507] text-white">
      <AmbientBackground />
      <HeroPortraitBackground show={showPortrait || reduceMotion} />
      <HeroOrb
        onSettled={() => setOrbSettled(true)}
        onHidden={() => setShowPortrait(true)}
      />
      <HeroNavbar />
      <div className="h-[74px] shrink-0" aria-hidden />
      <FloatingElements show={showFloats} />

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[min(28vh,240px)]"
        aria-hidden
        initial={false}
        animate={{ opacity: showPortrait ? 1 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "linear-gradient(to top, rgba(5,5,7,0.45) 0%, rgba(5,5,7,0.12) 55%, transparent 100%)",
        }}
      />

      <div
        className={`relative mx-auto flex min-h-[calc(100dvh-80px)] max-w-6xl flex-col items-center px-5 pt-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-10 ${
          showPortrait
            ? "justify-end pb-10 md:pb-14"
            : "justify-center pb-14"
        }`}
      >
        <motion.div
          className={`relative z-30 flex w-full max-w-[640px] flex-col items-center text-center transition-[padding,background,border,box-shadow] duration-700 ${
            showPortrait
              ? "rounded-2xl border border-white/[0.06] bg-black/20 px-6 py-6 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.75)] backdrop-blur-md md:px-9 md:py-7"
              : "px-0 py-0"
          }`}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className={`m-0 text-[13px] font-medium md:text-sm ${
              showPortrait
                ? "tracking-[0.02em] text-white/75"
                : "tracking-[0.04em] text-white/80"
            }`}
            style={{
              textShadow: showPortrait
                ? "0 1px 12px rgba(0,0,0,0.85)"
                : "0 2px 20px rgba(0,0,0,0.9)",
            }}
          >
            Don&apos;t just build a store,
          </p>

          <h1
            id="d-hero-title"
            className={`mt-2 max-w-[18ch] text-balance font-semibold leading-[1.08] tracking-[-0.03em] text-white ${
              showPortrait
                ? "text-[clamp(1.75rem,3.8vw,2.65rem)]"
                : "mt-3 text-[clamp(2.35rem,5vw,4rem)] leading-[1.05] tracking-[-0.04em]"
            }`}
            style={{
              textShadow: showPortrait
                ? "0 2px 16px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.55)"
                : "0 4px 24px rgba(0,0,0,0.85)",
            }}
          >
            Learn to{" "}
            <span className={showPortrait ? "text-[#c4bdff]" : "bg-gradient-to-r from-[#efeaff] to-[#9b93f0] bg-clip-text text-transparent"}>
              Drive Sales
            </span>
          </h1>

          <a
            href="pay.html"
            className={`inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#FF7343] px-9 text-[14px] font-semibold text-white transition hover:brightness-110 ${
              showPortrait
                ? "mt-5 shadow-[0_8px_24px_-8px_rgba(255,115,67,0.65)]"
                : "mt-9 min-h-[52px] px-10 text-[15px] shadow-[0_14px_36px_-12px_rgba(255,115,67,0.85)] ring-1 ring-white/15"
            }`}
          >
            Enroll Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function HeroPortraitBackground({ show }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[5] flex items-end justify-center md:items-center"
      aria-hidden
      initial={false}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <img
        src="/img/hero-portrait.png"
        alt=""
        className="relative h-[100vh] w-auto max-w-none object-contain object-center mix-blend-screen"
        decoding="async"
      />
    </motion.div>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 40%, #000 20%, transparent 75%)",
        }}
      />
    </div>
  );
}
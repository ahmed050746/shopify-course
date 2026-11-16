import { useEffect, useState } from "react";

export default function HeroNavbar() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const section = document.querySelector("#desktop-hero-root > section");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-70px 0px 0px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[200] w-full border-b px-5 py-4 backdrop-blur-md transition-colors duration-500 md:px-10 ${
        pastHero
          ? "border-black/[0.06] bg-white/95 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.45)]"
          : "border-white/10 bg-[#050507]/90 shadow-none"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <a href="#" className="flex items-center gap-2.5" aria-label="AI Web Crafts home">
          <img
            src="/img/logo.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-md object-contain"
          />
          <span
            className={`text-sm font-semibold tracking-tight transition-colors duration-500 md:text-base ${
              pastHero ? "text-[#111118]" : "text-white"
            }`}
          >
            AI Web Crafts
          </span>
        </a>
        <a
          href="pay.html"
          className={`inline-flex min-h-[42px] items-center rounded-lg bg-[#FF7343] px-4 py-2 text-sm font-bold text-white transition duration-300 hover:brightness-[1.02] ${
            pastHero ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
          }`}
          tabIndex={pastHero ? 0 : -1}
          aria-hidden={!pastHero}
        >
          Enroll Now
        </a>
      </div>
    </header>
  );
}

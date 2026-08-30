"use client";

import { useEffect, useState } from "react";
import CodeMatrixScene from "@/components/3d/CodeMatrixScene";

const SLOGAN_TEXT = "Digitalización · Software · Data · Automatización · IA";
const TYPING_SPEED_MS = 40;

export default function Home() {
  const [typedSlogan, setTypedSlogan] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // 1. Typewriter effect
  useEffect(() => {
    let charIndex = 0;
    const typingTimer = setInterval(() => {
      if (charIndex <= SLOGAN_TEXT.length) {
        setTypedSlogan(SLOGAN_TEXT.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingTimer);
      }
    }, TYPING_SPEED_MS);

    return () => clearInterval(typingTimer);
  }, []);

  // 2. Cursor Spotlight Tracker
  useEffect(() => {
    const updateSpotlight = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", updateSpotlight);
    return () => window.removeEventListener("mousemove", updateSpotlight);
  }, []);

  // 3. Developer Console Easter Egg (F12)
  useEffect(() => {
    const asciiBanner = `
 ██████╗ ██╗   ██╗██╗██████╗ ██╗   ██╗    ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗███████╗
██╔═══██╗██║   ██║██║██╔══██╗██║   ██║    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║██╔════╝
██║   ██║██║   ██║██║██████╔╝██║   ██║    ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║███████╗
██║▄▄ ██║██║   ██║██║██╔═══╝ ██║   ██║    ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║╚════██║
╚██████╔╝╚██████╔╝██║██║     ╚██████╔╝    ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║███████║
 ╚══▀▀═╝  ╚═════╝ ╚═╝╚═╝      ╚═════╝     ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝╚══════╝
    `;

    console.log(
      "%c" + asciiBanner,
      "color: #00f2fe; font-family: monospace; font-size: 10px; font-weight: bold; text-shadow: 0 0 10px rgba(0,242,254,0.8);"
    );
    console.log(
      "%c[ SYSTEM STATUS: STEALTH MODE // INITIALIZING v1.0 ]\n" +
      "%cQuipu Systems S.A.C.S. — Software Engineering, Data & Intelligent Systems.\n" +
      "%cTip: Click anywhere on screen to trigger Hyperspace Warp Speed.\n" +
      "%cInquiries & Business: contact@quipusystems.dev",
      "color: #38bdf8; font-weight: bold; font-family: monospace; font-size: 12px;",
      "color: #10b981; font-family: monospace; font-size: 11px;",
      "color: #c084fc; font-family: monospace; font-size: 11px; font-style: italic;",
      "color: #94a3b8; font-family: monospace; font-size: 11px;"
    );
  }, []);

  return (
    <main className="relative w-screen h-screen min-h-screen flex flex-col items-center justify-center bg-[#030305] overflow-x-hidden overflow-y-auto select-none py-8 px-4 cursor-pointer">
      {/* 3D Infinite Cyber Grid Canvas */}
      <CodeMatrixScene />

      {/* Cyber Spotlight Glow Layer (Follows cursor) */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-500 opacity-60"
        style={{
          background: `radial-gradient(700px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 242, 254, 0.07), rgba(139, 92, 246, 0.03), transparent 75%)`,
        }}
        aria-hidden="true"
      />

      {/* Retro CRT Scanline Overlay */}
      <div className="crt-overlay crt-flicker" aria-hidden="true" />

      {/* Main Central Content */}
      <section className="relative z-20 flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto my-auto">
        {/* Brand Header & Initializing State */}
        <header className="flex flex-col items-center gap-1 mb-2 sm:mb-3">
          <span className="font-['VT323',monospace] text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-sky-400 tracking-[0.35em] uppercase arcade-text-glow leading-tight">
            QUIPU SYSTEMS
          </span>
          <span
            className="animate-init-blink font-mono text-[11px] sm:text-xs md:text-sm text-sky-300/90 tracking-[0.3em] uppercase"
            aria-live="polite"
          >
            [ INITIALIZING... ]
          </span>
        </header>

        {/* Hero Title */}
        <h1 className="font-['VT323',monospace] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-widest text-white uppercase arcade-title-glow glitch-hover cursor-pointer leading-none my-2 sm:my-4">
          COMING SOON
        </h1>

        {/* Lengthwise Terminal Banner */}
        <div className="mt-4 sm:mt-7 w-full max-w-2xl sm:max-w-3xl px-4 sm:px-8 py-3 sm:py-3.5 rounded-lg sm:rounded-xl bg-black/65 border border-sky-500/30 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,200,0.15)]">
          <p className="font-mono text-xs sm:text-sm md:text-base text-slate-300 tracking-wide text-center leading-relaxed break-words">
            <span className="text-sky-400 font-bold mr-1.5" aria-hidden="true">&gt;</span>
            <span className="text-emerald-400 font-mono tracking-wider font-medium inline">
              {typedSlogan}
            </span>
            <span className="animate-pulse text-sky-400 font-bold ml-1" aria-hidden="true">_</span>
          </p>
        </div>
      </section>
    </main>
  );
}

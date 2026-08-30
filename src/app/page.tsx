"use client";

import { useEffect, useState } from "react";
import CodeMatrixScene from "@/components/3d/CodeMatrixScene";

const SLOGAN_TEXT = "Digitalización · Software · Data · Automatización · IA";
const TYPING_SPEED_MS = 40;

export default function Home() {
  const [typedSlogan, setTypedSlogan] = useState("");

  // Typewriter effect with clean interval management
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

  return (
    <main className="relative w-screen h-screen min-h-screen flex flex-col items-center justify-center bg-[#030305] overflow-x-hidden overflow-y-auto select-none py-8 px-4">
      {/* 3D Infinite Cyber Grid Canvas */}
      <CodeMatrixScene />

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
        <h1 className="font-['VT323',monospace] text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-widest text-white uppercase arcade-title-glow glitch-hover cursor-default leading-none my-2 sm:my-4">
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

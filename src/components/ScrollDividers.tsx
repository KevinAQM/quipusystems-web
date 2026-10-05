"use client";

import { useEffect } from "react";

export default function ScrollDividers() {
  useEffect(() => {
    const root = document.getElementById("inicio");
    if (!root) return;

    const elements = Array.from(root.querySelectorAll<HTMLElement>(".section-divider"));
    if (!elements.length) return;

    let frame = 0;
    let needsMeasurement = true;
    let maxScroll = 0;
    let stages: { element: HTMLElement; end: number; minimum: number; value: string }[] = [];

    function measure() {
      maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const positions = elements.map((element) => {
        const bounds = element.getBoundingClientRect();
        const offset = parseFloat(getComputedStyle(element).getPropertyValue("--divider-top")) || 0;
        return { element, top: bounds.top + window.scrollY + offset, width: bounds.width };
      });
      const lastPosition = positions[positions.length - 1].top;

      // Map the ordered boundaries to the available scroll distance. The footer
      // completes at the page bottom even though it cannot reach the viewport top.
      stages = positions.map(({ element, top, width }) => ({
        element,
        end: lastPosition > 0 ? (top / lastPosition) * maxScroll : 0,
        minimum: Math.min(1, 72 / Math.max(1, width)),
        value: "",
      }));
      needsMeasurement = false;
    }

    function draw() {
      frame = 0;
      if (needsMeasurement) measure();
      const scroll = Math.max(0, Math.min(window.scrollY, maxScroll));
      let start = 0;

      for (const stage of stages) {
        const progress = stage.end > start
          ? Math.max(0, Math.min(1, (scroll - start) / (stage.end - start)))
          : Number(scroll >= stage.end);
        const value = (stage.minimum + (1 - stage.minimum) * progress).toFixed(5);
        if (value !== stage.value) {
          stage.element.style.setProperty("--divider-progress", value);
          stage.value = value;
        }
        start = stage.end;
      }

      if (root!.dataset.scrollProgress === undefined) root!.dataset.scrollProgress = "";
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function remeasure() {
      needsMeasurement = true;
      schedule();
    }

    const observer = new ResizeObserver(remeasure);
    observer.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("pageshow", remeasure);
    schedule();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("pageshow", remeasure);
      delete root.dataset.scrollProgress;
      elements.forEach((element) => element.style.removeProperty("--divider-progress"));
    };
  }, []);

  return null;
}

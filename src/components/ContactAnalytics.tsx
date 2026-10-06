"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

export default function ContactAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CONTACT_ANALYTICS !== "true") return;

    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[data-contact-channel]");
      if (!link) return;
      track("contact_click", {
        channel: link.dataset.contactChannel ?? "unknown",
        location: link.dataset.contactLocation ?? "unknown",
      });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

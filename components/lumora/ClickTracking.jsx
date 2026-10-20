"use client";

import { useEffect } from "react";

/* fires Meta Pixel / GA events for every [data-call] and [data-cta] click */
export default function ClickTracking() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest("[data-call],[data-cta]");
      if (!a) return;
      const isCall = a.hasAttribute("data-call");
      try { window.fbq && window.fbq("track", isCall ? "Contact" : "InitiateCheckout"); } catch (_) {}
      try { window.gtag && window.gtag("event", isCall ? "call_click" : "cta_click"); } catch (_) {}
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}

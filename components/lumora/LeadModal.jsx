"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import C from "./config";
import LeadForm from "./LeadForm";
import { X } from "./icons";

/* lead pop-ups: after N seconds + on exit intent (desktop mouse-out / mobile back button) */
export default function LeadModal() {
  const POP = C.popup || {};
  const [open, setOpen] = useState(false);
  const [head, setHead] = useState({ title: POP.timerTitle, kicker: POP.timerKicker });
  const openRef = useRef(false);

  const close = useCallback(() => {
    openRef.current = false;
    setOpen(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (POP.enabled === false) return;
    const mem = {};
    const ss = {
      get: (k) => { try { return sessionStorage.getItem(k) || mem[k] || null; } catch (_) { return mem[k] || null; } },
      set: (k) => { mem[k] = "1"; try { sessionStorage.setItem(k, "1"); } catch (_) {} },
    };
    const show = (title, kicker, key) => {
      if (window.__leadDone || ss.get("lead_done") || ss.get(key) || openRef.current) return;
      ss.set(key);
      setHead({ title, kicker });
      openRef.current = true;
      setOpen(true);
      document.body.style.overflow = "hidden";
    };

    const timer = setTimeout(() => show(POP.timerTitle, POP.timerKicker, "pop_timer"), (POP.delaySeconds ?? 20) * 1000);
    const t0 = Date.now();
    const exit = () => { if (Date.now() - t0 >= 5000) show(POP.exitTitle, POP.exitKicker, "pop_exit"); };

    const onMouseLeave = (e) => { if (e.clientY <= 0) exit(); }; // desktop: cursor leaves toward tab bar
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const onPop = () => { if (!ss.get("pop_exit") && !ss.get("lead_done")) { exit(); history.pushState(history.state, ""); } }; // mobile: back button
    let closeTimer;
    const onLead = () => { closeTimer = setTimeout(close, 2200); };

    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    addEventListener("keydown", onKey);
    addEventListener("lead:done", onLead);
    try { history.pushState(history.state, ""); addEventListener("popstate", onPop); } catch (_) {}

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      removeEventListener("keydown", onKey);
      removeEventListener("lead:done", onLead);
      removeEventListener("popstate", onPop);
    };
  }, [close]); // eslint-disable-line react-hooks/exhaustive-deps

  if (POP.enabled === false) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      className={`fixed inset-0 z-[100] bg-[rgba(15,23,42,.65)] items-center justify-center p-4 ${open ? "flex animate-fade" : "hidden"}`}
    >
      <div className="relative w-full max-w-[430px] max-h-[92vh] overflow-auto animate-pop">
        <button
          aria-label="Close"
          onClick={close}
          className="absolute top-2 right-2.5 z-[2] w-[34px] h-[34px] rounded-full border-0 bg-[#f1f5f9] text-ink cursor-pointer"
        >
          <X className="w-[18px] h-[18px] mx-auto" aria-hidden="true" />
        </button>
        <LeadForm id="form3" modal title={head.title} kicker={head.kicker} />
      </div>
    </div>
  );
}

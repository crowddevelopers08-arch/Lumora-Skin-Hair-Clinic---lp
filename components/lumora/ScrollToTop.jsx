"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      aria-label="Scroll to top"
      onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 bottom-[84px] lg:bottom-6 z-[55] w-[46px] h-[46px] rounded-full border-0 bg-brand text-white text-[20px] cursor-pointer shadow-[0_6px_18px_rgba(0,0,0,.25)] [transition:all_.25s] hover:bg-brand-dark ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
      &#8593;
    </button>
  );
}

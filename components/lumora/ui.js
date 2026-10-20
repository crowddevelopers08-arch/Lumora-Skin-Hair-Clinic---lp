/* Shared Tailwind class strings + tiny building blocks used by every section */
import { ArrowRight, Check } from "./icons";

export const WRAP = "max-w-[1140px] mx-auto px-[18px]";
export const SECTION = "py-10 sm:py-14";

/* buttons: base has no padding / size so each usage can set its own */
export const BTN_BASE = "inline-flex items-center justify-center gap-2 rounded-full font-bold cursor-pointer font-[inherit] [transition:all_.2s]";
export const BTN_SIZE = "py-[14px] px-[26px] text-[16px]";
export const BTN_PRIMARY = "border-0 bg-accent text-[#1a1200] shadow-[0_4px_14px_rgba(255,210,31,.45)] hover:bg-accent-dark hover:text-black hover:-translate-y-px";
export const BTN_BRAND = "border-0 bg-brand text-white hover:bg-brand-dark";
export const BTN_GHOST = "bg-white text-brand border-2 border-brand";

export const CARD = "bg-white border border-line rounded-2xl p-[22px] shadow-card";
export const CARD_P = "text-muted text-[15px] mt-1.5";
export const THUMB = "rounded-xl mb-[14px] aspect-[4/3] object-cover w-full bg-soft";
export const ICON = "w-[46px] h-[46px] rounded-xl bg-soft grid place-items-center text-[22px] mb-3";

export const G3 = "grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
export const G4 = "grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

export function SectionHead({ eyebrow, title, sub }) {
  return (
    <div className="text-center max-w-[700px] mx-auto mb-[34px]">
      {eyebrow && <span className="inline-block text-gold font-bold text-[13px] tracking-[.08em] uppercase mb-2">{eyebrow}</span>}
      <h2>{title}</h2>
      {sub && <p className="text-muted">{sub}</p>}
    </div>
  );
}

export function Cta({ text }) {
  return (
    <div className="text-center mt-[30px]">
      <a href="#book" data-cta className={`${BTN_BASE} ${BTN_SIZE} ${BTN_PRIMARY}`}>{text}<ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" /></a>
    </div>
  );
}

export function Ticks({ items, className = "" }) {
  return (
    <ul className={`list-none grid gap-2 mb-[22px] ${className}`}>
      {items.map((t, i) => (
        <li key={i} className="flex items-center">
          <span className="inline-grid place-items-center shrink-0 w-5 h-5 rounded-full bg-brand text-accent mr-2.5">
            <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

"use client";

import { useState } from "react";
import C from "./config";
import { BTN_BASE, BTN_SIZE, BTN_PRIMARY } from "./ui";
import { ArrowRight, CheckCircle2, Lock } from "./icons";

const FIELD = "w-full py-[13px] px-[14px] border border-[#cbd5e1] rounded-[10px] font-[inherit] bg-white focus:outline-2 focus:outline-solid focus:outline-brand focus:border-transparent";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

export default function LeadForm({ id, title, kicker, modal = false, onSuccess }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ text: "", color: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const f = e.currentTarget;
    const d = Object.fromEntries(new FormData(f));
    if (d.company) return; // honeypot
    if (!d.name?.trim() || !/^[6-9]\d{9}$/.test(d.phone || "") || !d.concern) {
      setMsg({ color: "#b91c1c", text: "Please enter your name, a valid 10-digit mobile number and concern." });
      return;
    }
    const p = new URLSearchParams(location.search);
    const utm = {};
    UTM_KEYS.forEach((k) => { if (p.get(k)) utm[k] = p.get(k); });

    /* shape expected by app/api/leads → TeleCRM + Google Sheet */
    const lead = {
      name: d.name.trim(),
      phone: d.phone,
      area: d.concern,
      city: d.city || "",
      message: d.message || "",
      branch: C.clinic.name,
      source: utm.utm_source || "direct",
      medium: utm.utm_medium || "",
      campaign: utm.utm_campaign || "",
      term: utm.utm_term || "",
      content: utm.utm_content || "",
      gclid: utm.gclid || "",
      fbclid: utm.fbclid || "",
      formId: id || "",
      pageUrl: location.href,
      formName: C.tracking.formName,
    };

    setBusy(true);
    try {
      const res = await fetch(C.tracking.leadsEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      try { window.fbq && window.fbq("track", C.tracking.metaPixelEvent); } catch (_) {}
      try { window.gtag && window.gtag("event", "generate_lead"); } catch (_) {}
      setMsg({ color: "#15803d", text: "Thank you! Our team will call you shortly.", ok: true });
      window.__leadDone = 1;
      try { sessionStorage.setItem("lead_done", "1"); } catch (_) {}
      window.dispatchEvent(new Event("lead:done"));
      onSuccess && onSuccess();
      f.reset();
      /* brief pause so the pixel / gtag hits above leave before the page unloads */
      if (C.tracking.thankYouUrl) { setTimeout(() => { location.href = C.tracking.thankYouUrl; }, 400); return; }
    } catch (err) {
      setMsg({ color: "#b91c1c", text: `Something went wrong. Please call us on ${C.clinic.phoneDisplay}.` });
    }
    setBusy(false);
  }

  return (
    <form
      id={id}
      noValidate
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl p-[26px] border-t-[5px] border-accent ${modal ? "shadow-[0_24px_70px_rgba(0,0,0,.4)]" : "shadow-[0_18px_50px_rgba(15,23,42,.15)]"}`}
    >
      {kicker && <span className="inline-block bg-accent text-[#1a1200] font-bold text-[12px] py-[3px] px-3 rounded-full mb-2">{kicker}</span>}
      <h3 className="text-[21px] mb-1">{title || C.form.title}</h3>
      <p className="text-[13px] text-muted mb-[14px]">{C.form.note}</p>
      <input className="absolute -left-[9999px]" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="mb-3"><input className={FIELD} name="name" placeholder="Full Name *" required autoComplete="name" /></div>
      <div className="mb-3"><input className={FIELD} name="phone" type="tel" inputMode="numeric" placeholder="Mobile Number *" required pattern="[6-9][0-9]{9}" maxLength={10} autoComplete="tel-national" /></div>
      <div className="mb-3">
        <select className={FIELD} name="concern" required defaultValue="">
          <option value="">{C.form.concernLabel} *</option>
          {C.form.concerns.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {C.form.askCity && <div className="mb-3"><input className={FIELD} name="city" placeholder="City / Pincode" /></div>}
      {C.form.askMessage && <div className="mb-3"><textarea className={FIELD} name="message" rows={3} placeholder="Describe your problem (optional)" /></div>}
      <button className={`${BTN_BASE} ${BTN_SIZE} ${BTN_PRIMARY} w-full disabled:cursor-default`} type="submit" disabled={busy}>
        {busy ? "Submitting…" : <>{C.form.button}<ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" /></>}
      </button>
      <p className="text-[12px] text-muted mt-2.5 flex items-center justify-center gap-1.5 text-center"><Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />{C.form.privacyText}</p>
      <p className="mt-2.5 text-[14px] font-semibold flex items-center justify-center gap-1.5 text-center" role="status" style={{ color: msg.color }}>{msg.ok && <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />}{msg.text}</p>
    </form>
  );
}

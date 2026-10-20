import C from "./config";
import LeadForm from "./LeadForm";
import { WRAP, SECTION, BTN_BASE, BTN_PRIMARY } from "./ui";
import { MapPin, Phone, CalendarCheck } from "./icons";

function MapEmbed() {
  const src = C.clinic.mapEmbed || `https://maps.google.com/maps?q=${encodeURIComponent(C.clinic.name + " " + C.clinic.address)}&z=15&output=embed`;
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-card border border-line min-h-[320px] lg:min-h-[420px] bg-[#e5e7eb] order-2 lg:order-none">
      <iframe className="absolute inset-0 w-full h-full border-0 pointer-events-none" src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" tabIndex={-1} aria-hidden="true" title="Clinic location map" />
      {/* the whole map routes to the booking form instead of out to Google Maps */}
      <a href="#book" data-cta aria-label="Book your consultation" className="absolute inset-0 z-[1]" />
    </div>
  );
}

const LS_ITEM = "flex items-center gap-2.5 text-[14px] leading-[1.4]";
const LS_ICON = "w-[38px] h-[38px] shrink-0 rounded-full bg-white/15 grid place-items-center";
const LS_LABEL = "block text-[12px] opacity-80 font-semibold uppercase tracking-[.05em]";
const LS_BTN = "py-[11px] px-5 text-[14px] flex-1 sm:flex-initial";

export default function FinalCta() {
  const L = C.location;
  return (
    <section className={`${SECTION} bg-soft`} id="location">
      <div className={WRAP}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-7 items-stretch">
          <MapEmbed />
          <div><LeadForm id="form2" /></div>
        </div>

        <div className="mt-6 bg-brand text-white rounded-2xl py-[22px] px-[22px] flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            <div className={LS_ITEM}>
              <span className={LS_ICON}><MapPin className="w-5 h-5" aria-hidden="true" /></span>
              <div><b className={LS_LABEL}>{L.visitLabel}</b><a className="text-white" href="#book" data-cta>{C.clinic.address}</a></div>
            </div>
            <div className={LS_ITEM}>
              <span className={LS_ICON}><Phone className="w-5 h-5" aria-hidden="true" /></span>
              <div><b className={LS_LABEL}>{L.callLabel}</b><a className="text-white" href={`tel:${C.clinic.phone}`} data-call>{C.clinic.phoneDisplay}</a></div>
            </div>
          </div>
          <div className="flex gap-2.5 flex-wrap justify-center w-full sm:w-auto">
            <a href={`tel:${C.clinic.phone}`} data-call className={`${BTN_BASE} ${BTN_PRIMARY} ${LS_BTN}`}>
              <Phone className="w-4 h-4" aria-hidden="true" />{L.callButton}
            </a>
            <a href="#book" data-cta className={`${BTN_BASE} bg-transparent text-white border-2 border-white ${LS_BTN}`}>
              <CalendarCheck className="w-4 h-4" aria-hidden="true" />{L.bookButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

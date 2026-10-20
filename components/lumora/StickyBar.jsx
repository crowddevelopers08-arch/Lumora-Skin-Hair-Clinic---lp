import C from "./config";
import { Phone, CalendarCheck, WhatsAppIcon } from "./icons";

const LINK = "py-[14px] px-1.5 flex items-center justify-center gap-1.5 font-bold text-[14px]";
const ICON = "w-[18px] h-[18px]";

export default function StickyBar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[60] grid grid-cols-3 bg-white border-t border-line shadow-[0_-6px_20px_rgba(0,0,0,.08)]">
      <a className={`${LINK} text-brand`} href={`tel:${C.clinic.phone}`} data-call>
        <Phone className={ICON} aria-hidden="true" />{C.stickyBar.call}
      </a>
      <a className={`${LINK} text-[#16a34a]`} href={`https://wa.me/${C.clinic.whatsapp}?text=${encodeURIComponent(C.clinic.whatsappMsg)}`} target="_blank" rel="noopener">
        <WhatsAppIcon className={ICON} />{C.stickyBar.whatsapp}
      </a>
      <a className={`${LINK} bg-accent text-[#1a1200]`} href="/#book" data-cta>
        <CalendarCheck className={ICON} aria-hidden="true" />{C.stickyBar.book}
      </a>
    </div>
  );
}

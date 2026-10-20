import C from "./config";
import { WRAP } from "./ui";
import { MapPin, Phone, Mail } from "./icons";

const ROW = "flex items-start gap-2";
const ICON = "w-4 h-4 shrink-0 mt-[3px] text-accent";

export default function Footer() {
  return (
    <footer className="bg-[#0b1220] text-[#cbd5e1] pt-10 pb-6 text-[14px] [&_a:hover]:text-white">
      <div className={WRAP}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-7 mb-6">
          <div>
            <h4 className="text-white font-bold mb-2.5">{C.clinic.name}</h4>
            <p>{C.footer.about}</p>
            <p className={`${ROW} mt-2.5`}><MapPin className={ICON} aria-hidden="true" />{C.clinic.address}</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2.5">Contact</h4>
            <p className={ROW}><Phone className={ICON} aria-hidden="true" /><a href={`tel:${C.clinic.phone}`}>{C.clinic.phoneDisplay}</a></p>
            {C.clinic.email && <p className={`${ROW} mt-1.5`}><Mail className={ICON} aria-hidden="true" /><a href={`mailto:${C.clinic.email}`}>{C.clinic.email}</a></p>}
          </div>
          <div>
            <h4 className="text-white font-bold mb-2.5">Legal</h4>
            {C.footer.links.map(([label, href]) => <p key={label}><a href={href}>{label}</a></p>)}
          </div>
        </div>
        <div className="border-t border-[#1e293b] pt-4 text-[12px] text-[#94a3b8]">
          <p>{C.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}

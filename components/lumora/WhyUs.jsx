import C from "./config";
import { WRAP, SECTION, CARD, CARD_P, ICON, G3, SectionHead, Cta } from "./ui";
import { Sparkles, Target, Stethoscope, Microscope, ShieldCheck, CalendarCheck, Plus } from "./icons";

/* config.why.items[].icon names → line icons */
const ICONS = {
  sparkles: Sparkles,
  target: Target,
  stethoscope: Stethoscope,
  microscope: Microscope,
  shield: ShieldCheck,
  calendar: CalendarCheck,
};

export default function WhyUs() {
  return (
    <section className={SECTION} id="why">
      <div className={WRAP}>
        <SectionHead {...C.why} />
        <div className={G3}>
          {C.why.items.map((i) => {
            const Icon = ICONS[i.icon] || Plus;
            return (
              <div key={i.title} className={CARD}>
                <div className={`${ICON} text-brand`}><Icon className="w-6 h-6" aria-hidden="true" /></div>
                <h3>{i.title}</h3>
                <p className={CARD_P}>{i.text}</p>
              </div>
            );
          })}
        </div>
        <Cta text={C.why.cta} />
      </div>
    </section>
  );
}

import C from "./config";
import LeadForm from "./LeadForm";
import { WRAP, BTN_BASE, BTN_SIZE, BTN_PRIMARY, BTN_GHOST, Ticks } from "./ui";
import { ArrowRight, Phone } from "./icons";

export default function Hero() {
  const H = C.hero;
  return (
    <section className="bg-[linear-gradient(135deg,var(--color-soft),#fff_60%)] pt-10 pb-14">
      <div className={`${WRAP} grid grid-cols-1 lg:grid-cols-[1.1fr_.9fr] gap-9 items-center`}>
        <div>
          <span className="inline-block bg-white border border-line py-1.5 px-[14px] rounded-full text-[13px] font-semibold text-brand mb-[14px]">
            {H.badge}
          </span>
          <h1 dangerouslySetInnerHTML={{ __html: H.headline }} />
          <p className="text-muted text-[18px] mt-[14px] mb-[18px]">{H.sub}</p>
          <Ticks items={H.bullets} />
          <div className="flex gap-3 flex-wrap">
            <a href="#book" data-cta className={`${BTN_BASE} ${BTN_SIZE} ${BTN_PRIMARY}`}>
              {H.primaryCta}<ArrowRight className="w-[18px] h-[18px]" aria-hidden="true" />
            </a>
            <a href={`tel:${C.clinic.phone}`} data-call className={`${BTN_BASE} ${BTN_SIZE} ${BTN_GHOST}`}>
              <Phone className="w-[18px] h-[18px]" aria-hidden="true" />Call Now
            </a>
          </div>
        </div>
        <div id="book">
          <LeadForm id="form1" />
        </div>
      </div>
    </section>
  );
}

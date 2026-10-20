import C from "./config";
import { SECTION, SectionHead, Cta } from "./ui";

export default function Faq() {
  return (
    <section className={SECTION} id="faq">
      <div className="max-w-[800px] mx-auto px-[18px]">
        <SectionHead {...C.faq} />
        {C.faq.items.map((f) => (
          <details key={f.q} className="group bg-white border border-line rounded-xl py-4 px-[18px] mb-2.5">
            <summary className="cursor-pointer font-bold list-none flex justify-between gap-3 after:content-['+'] after:text-[22px] after:text-brand after:leading-none group-open:after:content-['–']">
              {f.q}
            </summary>
            <p className="mt-2.5 text-muted">{f.a}</p>
          </details>
        ))}
        <Cta text={C.faq.cta} />
      </div>
    </section>
  );
}

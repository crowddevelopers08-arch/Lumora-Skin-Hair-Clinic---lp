import C from "./config";
import { WRAP, SECTION, SectionHead, Cta } from "./ui";

/* phone: each step is one row — number on the left, text beside it, joined by a
   vertical line. md and up: the original four-column grid. */
export default function Process() {
  const steps = C.process.steps;
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <SectionHead {...C.process} />
        <ol className="grid gap-0 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative flex md:block gap-4 pb-7 md:pb-0 md:pt-2">
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="md:hidden absolute left-[20px] top-[44px] bottom-1 w-[2px] bg-line" />
              )}
              <div className="relative z-[1] w-[42px] h-[42px] shrink-0 rounded-full bg-brand text-accent grid place-items-center font-extrabold md:mb-3">
                {i + 1}
              </div>
              <div className="pt-1.5 md:pt-0">
                <h3>{s.title}</h3>
                <p className="text-muted text-[15px]">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Cta text={C.process.cta} />
      </div>
    </section>
  );
}

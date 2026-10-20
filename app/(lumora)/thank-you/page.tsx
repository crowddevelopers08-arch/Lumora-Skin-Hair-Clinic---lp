import SubPage from "@/components/lumora/SubPage"
import C from "@/components/lumora/config"
import { WRAP, BTN_BASE, BTN_SIZE, BTN_PRIMARY, BTN_GHOST } from "@/components/lumora/ui"
import { CheckCircle2, Phone, ArrowRight, WhatsAppIcon } from "@/components/lumora/icons"

// Lead forms redirect here after a successful submission (config.tracking.thankYouUrl).
// Also usable as the conversion URL in Google Ads / Meta.
export const metadata = {
  title: `Thank You | ${C.clinic.name}`,
  description: "Your consultation request has been received.",
  robots: { index: false, follow: false },
}

const STEPS = [
  "Our team reviews your enquiry.",
  "We call you within 30 minutes to understand your concern.",
  "We confirm a convenient time for your consultation.",
]

export default function ThankYouPage() {
  return (
    <SubPage>
      <section className="bg-[linear-gradient(135deg,var(--color-soft),#fff_60%)] py-14 sm:py-20">
        <div className={`${WRAP} max-w-[680px] text-center`}>
          <span className="mx-auto mb-5 grid h-[72px] w-[72px] place-items-center rounded-full bg-brand text-accent">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
          </span>
          <h1>Thank You!</h1>
          <p className="text-muted text-[18px] mt-3">
            Your consultation request has been received. {C.form.note}
          </p>

          <ol className="mx-auto mt-8 max-w-[460px] text-left grid gap-3">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-start gap-3 bg-white border border-line rounded-xl p-4 shadow-card">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-accent text-[13px] font-extrabold">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>

          <p className="text-muted mt-8">Need to speak to us sooner?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a href={`tel:${C.clinic.phone}`} data-call className={`${BTN_BASE} ${BTN_SIZE} ${BTN_PRIMARY}`}>
              <Phone className="w-[18px] h-[18px]" aria-hidden="true" />Call {C.clinic.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${C.clinic.whatsapp}?text=${encodeURIComponent(C.clinic.whatsappMsg)}`}
              target="_blank"
              rel="noopener"
              className={`${BTN_BASE} ${BTN_SIZE} ${BTN_GHOST}`}
            >
              <WhatsAppIcon className="w-[18px] h-[18px]" />WhatsApp Us
            </a>
          </div>

          <a href="/" className="mt-8 inline-flex items-center gap-1.5 font-bold text-brand underline underline-offset-4">
            Back to Home<ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </SubPage>
  )
}

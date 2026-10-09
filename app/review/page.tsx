import type { Metadata } from "next"
import Image from "next/image"
import RatingPrompt from "@/components/elite-minima/RatingPrompt"
import { LUMORA_LOGO, LUMORA_NAME } from "@/components/elite-minima/config"

export const metadata: Metadata = {
  title: `Share Your Review | ${LUMORA_NAME}`,
  description: `Tell us about your experience at ${LUMORA_NAME}.`,
  robots: { index: false, follow: false },
}

export default function ReviewPage() {
  return (
    // inline background: `.elite` sets `background: var(--e-paper)` as unlayered
    // CSS, which outranks a Tailwind bg-* utility no matter the specificity
    <div
      className="elite lumora flex min-h-screen flex-col items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "var(--e-green-deep)" }}
    >
      <div className="mx-auto w-full max-w-[460px] rounded-[28px] bg-[var(--e-paper)] px-5 py-8 shadow-[0_40px_80px_-40px_rgba(30,15,8,0.75)] sm:px-9 sm:py-10">
        <div className="flex flex-col items-center">
          {/* the lockup already carries the name and tagline, so it stands in
              for the wordmark-and-subtitle pair at the top of the reference */}
          <Image
            src={LUMORA_LOGO.src}
            alt={LUMORA_NAME}
            width={LUMORA_LOGO.width}
            height={LUMORA_LOGO.height}
            priority
            className="h-14 w-auto sm:h-16"
          />        </div>

        <div className="mt-7">
          <RatingPrompt />
        </div>
      </div>
    </div>
  )
}

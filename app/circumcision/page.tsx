import type { Metadata } from "next"

import CircPage from "@/components/elite-minima/circumcision/CircPage"

const TITLE = "Circumcision Treatment in Chennai | Stapler & Laser — Elite-Minima, Anna Nagar"
const DESCRIPTION =
  "Advanced circumcision treatment in Anna Nagar, Chennai. Modern stapler and laser circumcision with private, specialist care at Elite-Minima – The Surgical Speciality Clinic. Book a consultation."

// Spelled out rather than inherited: the root layout's defaults describe the
// clinic as a whole, and a share card for this page should say circumcision.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: "Circumcision Treatment in Chennai | Stapler & Laser — Elite-Minima",
    description:
      "Modern stapler and laser circumcision at Elite-Minima, Anna Nagar — private, specialist care, with the technique recommended after a clinical evaluation.",
    siteName: "Elite Minima — The Surgical Speciality Clinic",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
}

export default function Page() {
  return <CircPage />
}

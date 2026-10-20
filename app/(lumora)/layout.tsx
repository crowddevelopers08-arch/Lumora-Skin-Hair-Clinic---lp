import type React from "react"
import type { Metadata, Viewport } from "next"
import { AnalyticsHead, AnalyticsNoScript } from "@/components/Analytics"
import "./lumora.css"

// Root layout for the Lumora pages (/, /thank-you, /privacy-policy, /terms-and-conditions),
// replicated from lumora-sample-template/app/layout.js. It is a separate root
// layout from app/(site)/layout.tsx because the template's Tailwind theme
// (lumora.css) redefines `accent`, `muted` and the breakpoints, and would
// break the shadcn-based pages if both stylesheets loaded together.

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  applicationName: "Lumora Skin & Hair Clinic",
}

export const viewport: Viewport = { width: "device-width", initialScale: 1 }

export default function LumoraLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <AnalyticsHead />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Kurale&display=swap" rel="stylesheet" />
      </head>
      <body className="pb-[70px] lg:pb-0">
        <AnalyticsNoScript />
        {children}
      </body>
    </html>
  )
}

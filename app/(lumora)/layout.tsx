import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
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
        {/* Google Tag Manager - placed as high in <head> as possible */}
        <Script id="gtm-head" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PQB2SSM8');`}
        </Script>
        {/* End Google Tag Manager */}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800&family=Kurale&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="pb-[70px] lg:pb-0">
        {/* Google Tag Manager (noscript) - immediately after opening <body> tag */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PQB2SSM8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {children}
      </body>
    </html>
  )
}
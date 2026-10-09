import type React from "react"
import type { Metadata, Viewport } from "next"
import { Lato } from "next/font/google"
import "./globals.css"

// Lato is the site typeface, exposed as --font-lato.
//
// Lato only ships 100/300/400/700/900 — it has no 500, 600 or 800. The design
// uses font-medium/semibold/extrabold, which the CSS font-matching algorithm
// resolves against the faces below as 500→400, 600→700, 800→900.
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
})

const TITLE = "Lumora Skin & Hair Clinic — Advanced Skin & Hair Care"
const DESCRIPTION =
  "Lumora Skin & Hair Clinic offers specialist-led skin and hair treatments tailored to you. Book a private consultation."

// icon.png / apple-icon.png / opengraph-image.png / twitter-image.png live in
// this directory and are picked up by the App Router's file conventions.
export const metadata: Metadata = {
  // Needed so the OG/Twitter images resolve to absolute URLs. Set
  // NEXT_PUBLIC_SITE_URL to the live Lumora domain in each environment.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: "Lumora Skin & Hair Clinic",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Lumora Skin & Hair Clinic",
    type: "website",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  generator: "Nextjs15",
}

// Lumora espresso brown — tints the browser chrome on Android and the iOS status bar.
export const viewport: Viewport = {
  themeColor: "#412519",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`antialiased ${lato.variable}`}>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KRFRND5P');
            `,
          }}
        />
        {/* End Google Tag Manager */}

        {/* Google tag (gtag.js) — Google Ads AW-18361786197.
            The GTM container above is a separate product and does not define a
            global `gtag`, so the base tag has to be loaded here or the two
            snippets under it throw on the first call. Both write to the same
            `dataLayer` array GTM created, which is the supported arrangement.

            ⚠️ If the GTM container is ever given a Google Ads conversion tag
            for this same account, the call conversion will be counted twice —
            once from here and once from there. Keep the Ads tags on one side. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18361786197" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18361786197');

              // Call reporting: swaps the number shown on the page for a Google
              // forwarding number when the visitor arrived from an ad.
              gtag('config', 'AW-18361786197/kLV7CPXm1N8cENW-yrNE', {
                'phone_conversion_number': '9500091428'
              });

              // Click-to-call conversion, verbatim from the Ads UI. Exposed on
              // window so an inline onclick="return gtag_report_conversion(...)"
              // works; the React phone links reach the same conversion through
              // track('call_click') instead — see components/elite-minima/track.ts.
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-18361786197/g1x2CPjm1N8cENW-yrNE',
                    'value': 1.0,
                    'currency': 'INR',
                    'event_callback': callback
                });
                return false;
              }
              window.gtag_report_conversion = gtag_report_conversion;
            `,
          }}
        />
        {/* End Google tag (gtag.js) */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-KRFRND5P"
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
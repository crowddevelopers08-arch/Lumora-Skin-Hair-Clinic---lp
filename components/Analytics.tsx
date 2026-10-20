// Tracking tags shared by both root layouts — app/(site)/layout.tsx and
// app/(lumora)/layout.tsx. Each route group has its own <html>, so the tags
// live here once instead of being pasted into both.

/** Goes inside <head>. */
export function AnalyticsHead() {
  return (
    <>
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

          NOTE: If the GTM container is ever given a Google Ads conversion tag
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
            // works; the React phone links fire
            // gtag("event", "call_click") instead — see components/lumora/ClickTracking.jsx.
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
    </>
  )
}

/** Goes first inside <body>. */
export function AnalyticsNoScript() {
  return (
    <noscript>
      <iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-KRFRND5P"
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  )
}

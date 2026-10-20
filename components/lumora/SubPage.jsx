import Header from "./Header";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import ClickTracking from "./ClickTracking";
import { WRAP } from "./ui";

/* Shell for the pages outside the landing page — /thank-you, /privacy-policy
   and /terms-and-conditions. Same header, footer and tracking as `/`. */
export default function SubPage({ children }) {
  return (
    <>
      <Header />
      <main id="top">{children}</main>
      <Footer />
      <StickyBar />
      <ClickTracking />
    </>
  );
}

/* Long-form legal copy. Styles the plain h2 / p / ul / a children it is given. */
export function LegalPage({ title, updated, children }) {
  return (
    <SubPage>
      <section className="bg-soft border-b border-line py-10 sm:py-14">
        <div className={`${WRAP} max-w-[860px]`}>
          <h1>{title}</h1>
          <p className="text-muted mt-2 text-[14px]">Last updated: {updated}</p>
        </div>
      </section>
      <article
        className={`${WRAP} max-w-[860px] py-10 sm:py-14 text-[16px] leading-[1.75]
          [&_h2]:text-[20px] sm:[&_h2]:text-[22px] [&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:text-brand
          [&_p]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1.5
          [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-brand`}
      >
        {children}
      </article>
    </SubPage>
  );
}

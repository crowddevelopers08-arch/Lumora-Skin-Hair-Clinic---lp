import { LegalPage } from "@/components/lumora/SubPage"
import C from "@/components/lumora/config"

export const metadata = {
  title: `Privacy Policy | ${C.clinic.name}`,
  description: `How ${C.clinic.name} collects, uses and protects the personal information you share with us.`,
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="20 October 2026">
      <p>
        This Privacy Policy explains how {C.clinic.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;),
        located at {C.clinic.address}, collects, uses, shares and protects personal information when you visit this
        website or submit an enquiry through it. By using this website, you agree to the practices described here.
      </p>

      <h2>1. Information We Collect</h2>
      <p><strong>Information you give us</strong> when you fill in a booking or feedback form:</p>
      <ul>
        <li>Your name and mobile number</li>
        <li>The skin or hair concern you select</li>
        <li>On our feedback form: your email address, rating and comments</li>
      </ul>
      <p><strong>Information collected automatically</strong> when you use the website:</p>
      <ul>
        <li>The page you submitted the form from and how you reached it (for example, campaign or advertisement details)</li>
        <li>Device, browser and usage information collected through cookies and similar technologies (see Section 5)</li>
      </ul>
      <p>
        Please do not share detailed medical records or sensitive health information through the website forms. Your
        medical history will be discussed directly with the treating professional during your consultation.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To call you back about your enquiry and arrange a consultation</li>
        <li>To understand your concern so the right team member can assist you</li>
        <li>To send appointment-related reminders or follow-ups you have asked for</li>
        <li>To review feedback and improve our services</li>
        <li>To measure how our website and advertising perform</li>
        <li>To meet legal, regulatory and record-keeping obligations</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>3. Consent</h2>
      <p>
        By submitting a form on this website, you consent to us contacting you by phone call, SMS or WhatsApp about your
        enquiry. You may withdraw your consent at any time by contacting us using the details in Section 9. Withdrawing
        consent does not affect any processing carried out before you withdrew it.
      </p>

      <h2>4. Sharing Your Information</h2>
      <p>We share your information only where needed to respond to you and run our services, with:</p>
      <ul>
        <li>Our clinic team, who handle enquiries and appointments</li>
        <li>Service providers that help us operate, such as our customer relationship management (CRM) system, Google Workspace for record keeping, and our website hosting provider</li>
        <li>Analytics and advertising providers such as Google and Meta (Facebook / Instagram), as described in Section 5</li>
        <li>Government or regulatory authorities, where required by law</li>
      </ul>
      <p>These providers may only use your information to provide services to us.</p>

      <h2>5. Cookies, Analytics and Advertising</h2>
      <p>
        This website uses cookies and similar technologies, including Google Tag Manager, Google Analytics and Google Ads
        tags, and may use other advertising pixels. They help us understand how visitors use the website, measure enquiries
        and calls that come from our advertising, and show relevant advertisements. You can block or delete cookies through
        your browser settings. Some parts of the website may not work as intended if you do so.
      </p>
      <p>
        If you submit an enquiry, we may share your mobile number and name with Meta Platforms in a hashed (encrypted,
        non-readable) form, so we can measure our advertising and avoid showing you advertisements you no longer need,
        or show relevant ones. Your concern or any health information is never shared with Meta. To opt out, contact us
        using the details in Section 9 and we will remove your details from these lists.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We take reasonable technical and organisational measures to protect your information against unauthorised access,
        loss or misuse. Access is limited to people who need it to respond to your enquiry. No method of transmission over
        the internet is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We keep your information only for as long as it is needed for the purposes described in this policy, or as required
        by applicable law. When it is no longer needed, we delete or anonymise it.
      </p>

      <h2>8. Your Rights</h2>
      <p>Subject to applicable law, including the Digital Personal Data Protection Act, 2023, you may ask us to:</p>
      <ul>
        <li>Tell you what personal information we hold about you</li>
        <li>Correct or update inaccurate information</li>
        <li>Delete your information where we are not required to keep it</li>
        <li>Stop contacting you</li>
      </ul>
      <p>To make a request, contact us using the details below. We may need to verify your identity first.</p>

      <h2>9. Contact Us</h2>
      <p>
        For questions, requests or complaints about this policy or how we handle your information, contact us:
      </p>
      <ul>
        <li>Email: <a href={`mailto:${C.clinic.email}`}>{C.clinic.email}</a></li>
        <li>Phone: <a href={`tel:${C.clinic.phone}`} data-call>{C.clinic.phoneDisplay}</a></li>
        <li>Address: {C.clinic.address}</li>
      </ul>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The latest version will always be available on this page, with
        the &ldquo;Last updated&rdquo; date shown at the top.
      </p>
    </LegalPage>
  )
}

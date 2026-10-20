import { LegalPage } from "@/components/lumora/SubPage"
import C from "@/components/lumora/config"

export const metadata = {
  title: `Terms & Conditions | ${C.clinic.name}`,
  description: `Terms and conditions for using the ${C.clinic.name} website and booking a consultation.`,
}

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="20 October 2026">
      <p>
        These Terms &amp; Conditions govern your use of this website, operated by {C.clinic.name}, located at{" "}
        {C.clinic.address}. By using this website or submitting an enquiry through it, you agree to these terms. If you do
        not agree, please do not use the website.
      </p>

      <h2>1. Information Only, Not Medical Advice</h2>
      <p>
        The content on this website is intended for general awareness only. It does not replace professional medical
        advice, diagnosis or treatment. Do not ignore or delay seeking professional advice because of anything you have
        read on this website. In a medical emergency, contact your nearest hospital or emergency services immediately.
      </p>

      <h2>2. Consultations and Treatment</h2>
      <ul>
        <li>Submitting a form is an enquiry. It does not confirm an appointment until our team confirms it with you.</li>
        <li>Treatment is recommended only after a consultation and assessment of your concern, medical history and suitability.</li>
        <li>Not every treatment is suitable for every person. The treating professional may advise against a treatment if it is not appropriate for you.</li>
        <li>Every treatment has its own potential risks and limitations, which will be explained to you before you proceed.</li>
      </ul>

      <h2>3. Results</h2>
      <p>
        Results vary between individuals. They depend on the concern being treated, the procedure chosen, individual
        response and the number of sessions required. We do not guarantee any specific outcome. Any images or descriptions
        on this website are for illustration only.
      </p>

      <h2>4. Free Initial Consultation</h2>
      <p>
        Where a free initial consultation is offered, it covers the first discussion of your concern. Any investigations,
        procedures, products or follow-up treatments are charged separately. The costs will be explained to you before you
        proceed.
      </p>

      <h2>5. Appointments, Cancellations and Payments</h2>
      <ul>
        <li>Please arrive on time for your appointment. Late arrival may mean rescheduling.</li>
        <li>If you need to cancel or reschedule, please inform us as early as possible.</li>
        <li>Treatment fees, package terms and refund conditions are shared with you at the clinic before treatment begins.</li>
      </ul>

      <h2>6. Your Responsibilities</h2>
      <ul>
        <li>Provide accurate contact details and complete, truthful medical information during your consultation.</li>
        <li>Follow the pre-treatment and aftercare instructions given to you.</li>
        <li>Do not misuse the website, submit false enquiries or attempt to interfere with its operation.</li>
      </ul>

      <h2>7. Communication</h2>
      <p>
        By submitting your details, you agree that we may contact you by phone call, SMS or WhatsApp about your enquiry and
        appointments. How we handle your information is explained in our <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <h2>8. Intellectual Property</h2>
      <p>
        The text, images, logos and design of this website belong to {C.clinic.name} or are used with permission. You may
        not copy, reproduce or reuse them without our written consent.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        We try to keep the information on this website accurate and up to date, but we do not guarantee that it is
        complete or error-free. To the extent permitted by law, we are not liable for any loss arising from your use of, or
        reliance on, this website. Links to third-party websites, such as Google Maps or WhatsApp, are provided for
        convenience and are governed by their own terms.
      </p>

      <h2>10. Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of the courts in
        Viluppuram, Tamil Nadu.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. The latest version will always be available on this page, with the
        &ldquo;Last updated&rdquo; date shown at the top.
      </p>

      <h2>12. Contact Us</h2>
      <ul>
        <li>Email: <a href={`mailto:${C.clinic.email}`}>{C.clinic.email}</a></li>
        <li>Phone: <a href={`tel:${C.clinic.phone}`} data-call>{C.clinic.phoneDisplay}</a></li>
        <li>Address: {C.clinic.address}</li>
      </ul>
    </LegalPage>
  )
}

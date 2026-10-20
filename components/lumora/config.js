/* =====================================================================
   CONFIG — all page copy lives here.
   Set a section to enabled:false to hide it.
   Colours live in app/(lumora)/lumora.css (@theme).
   ===================================================================== */
const ADDRESS = "No. 46, Second Floor, above Glam Studios, KK Road, Viluppuram, Tamil Nadu 605602";
const CTA = "Book Your Consultation";

const CONFIG = {
  meta: {
    title: "Skin & Hair Clinic in Viluppuram | Lumora Skin and Hair",
    description: "Personalised skin and hair treatments in Viluppuram, guided by your concerns, needs, and treatment goals. Book your consultation at Lumora Skin and Hair.",
    schemaType: "MedicalClinic",
    url: "",
  },
  clinic: {
    name: "Lumora Skin and Hair",
    logo: "/images/lumora-logo.png",
    phone: "+919360209743",
    phoneDisplay: "+91 93602 09743",
    whatsapp: "919360209743",
    whatsappMsg: "Hi, I'd like to book a consultation at Lumora Skin and Hair.",
    address: ADDRESS,
    mapLink: "https://www.google.com/maps/search/?api=1&query=Lumora+Skin+and+Hair+KK+Road+Viluppuram",
    mapEmbed: "",
    email: "lumoraclinic@gmail.com",
  },
  popup: { enabled: true, delaySeconds: 20, timerTitle: CTA, exitTitle: CTA },
  /* Leads post to leadsEndpoint (app/api/leads), which forwards them to TeleCRM
     and the Google Sheet (lumora-apps-script.gs). formName must match
     LUMORA_LEADS_FORM in lib/forms.ts — it picks the sheet tab. */
  tracking: { leadsEndpoint: "/api/leads", formName: "Lumora LP Leads", thankYouUrl: "/thank-you", metaPixelEvent: "Lead" },

  header: { callLabel: "Call", bookLabel: "Book Now" },

  hero: {
    enabled: true,
    badge: "Skin & Hair Clinic | Viluppuram",
    headline: "Healthier Skin. <u>Stronger Hair.</u> Care That Starts With You.",
    sub: "Personalised skin and hair treatments guided by your concerns, needs, and treatment goals.",
    bullets: ["Skin and hair care under one roof", "Personalised treatment plans", "Free initial consultation"],
    primaryCta: CTA,
  },

  form: {
    title: CTA,
    note: "Our team will call you within 30 minutes.",
    button: "Book Appointment",
    concernLabel: "Select Your Concern",
    concerns: ["Acne / Acne Scars", "Pigmentation / Melasma", "Anti-Ageing / Glow", "Laser Treatment", "Hair Fall / Thinning", "Hair Transplant", "Dandruff / Scalp", "Other"],
    askCity: false,
    askMessage: false,
    privacyText: "Your details are handled with care and used to respond to your enquiry.",
  },

  treatments: {
    enabled: true, slider: true, eyebrow: "Our Services", title: "All Our Skin & Hair Services",
    sub: "Explore treatment options designed to address a range of skin and hair concerns, with recommendations based on individual assessment.",
    items: [
      { title: "PRP Skin Treatment", text: "Uses platelet-rich plasma derived from your blood to support skin rejuvenation.", image: "/images/treatments/prp-skin-treatment.webp" },
      { title: "Glutathione IV", text: "A doctor-supervised IV treatment that may be considered for selected skin-related concerns after medical evaluation.", image: "/images/treatments/glutathione-iv.webp" },
      { title: "Oxygeno Facial", text: "A facial treatment designed to refresh the skin and improve its appearance.", image: "/images/treatments/oxygeno-facial.webp" },
      { title: "Double Chin Reduction", text: "Treatment options to address under-chin fullness and improve facial contour, based on individual suitability.", image: "/images/treatments/double-chin-reduction.webp" },
      { title: "Botox & Fillers", text: "Injectable treatments that soften certain facial lines or restore volume, based on an appropriate assessment.", image: "/images/treatments/botox-and-fillers.webp" },
      { title: "Microdermabrasion", text: "A skin exfoliation treatment that helps improve surface texture and skin smoothness.", image: "/images/treatments/microdermabrasion.webp" },
      { title: "Anti-Acne Treatments", text: "Targeted treatment options to manage acne and address concerns such as post-acne marks.", image: "/images/treatments/anti-acne-treatments.webp" },
      { title: "MNRF & Meso Glow", text: "Skin treatment options to improve selected concerns related to skin texture, appearance, and radiance.", image: "/images/treatments/mnrf-meso-glow.webp" },
    ],
  },

  why: {
    enabled: true, eyebrow: "Why Lumora?", title: "Care That Feels Personal", cta: CTA,
    items: [
      { icon: "sparkles", title: "Skin & Hair Care Under One Roof", text: "Skin and hair treatment options at one clinic." },
      { icon: "target", title: "Treatment Plans Built Around You", text: "Recommendations based on your concerns and assessment rather than a one-size-fits-all approach." },
      { icon: "stethoscope", title: "Consultation Before Treatment", text: "We begin by understanding your concerns and suitability before considering treatment." },
      { icon: "microscope", title: "A Range of Treatment Options", text: "PRP, GFC, laser treatments, and microneedling RF, depending on your individual needs." },
      { icon: "shield", title: "Hygiene and Patient Comfort", text: "A clean, comfortable environment with attention to hygiene throughout your visit." },
      { icon: "calendar", title: "Convenient Appointment Booking", text: "Reach our team via the booking form, phone, or WhatsApp to enquire about appointments." },
    ],
  },

  process: {
    enabled: true, eyebrow: "How It Works", title: "Your Journey to Personalised Skin & Hair Care", cta: CTA,
    steps: [
      { title: "Book", text: "Submit your details through the form or contact us by phone or WhatsApp." },
      { title: "Consult", text: "Discuss your skin or hair concerns with the dermatologist." },
      { title: "Plan", text: "Understand the recommended treatment options, expected costs, and relevant next steps." },
      { title: "Treat & Review", text: "Proceed with suitable treatment and follow-up reviews." },
    ],
  },

  faq: {
    enabled: true, eyebrow: "FAQ", title: "Frequently Asked Questions", cta: CTA,
    items: [
      { q: "What treatments do you offer for skin and hair?", a: "Lumora Skin and Hair offers a range of treatment options, including acne and pigmentation care, PRP, laser treatments, hair fall management, scalp treatments, and hair transplantation." },
      { q: "Do I need a consultation before booking a treatment?", a: "A consultation is recommended before proceeding with treatment. It helps the treating professional understand your concerns, assess suitability, and explain the available options." },
      { q: "How soon can I see results?", a: "Results vary depending on the concern being treated, the chosen procedure, individual response, and the number of sessions required." },
      { q: "Are the treatments safe?", a: "Every treatment has its own suitability criteria, potential risks, and limitations. An appropriate assessment helps determine whether a treatment is suitable for you. Discuss your medical history and any concerns with the treating professional before proceeding." },
      { q: "Where is the clinic?", a: `Lumora Skin and Hair is located at ${ADDRESS}.` },
    ],
  },

  finalCta: { enabled: true },

  location: { visitLabel: "Visit Us", callLabel: "Call", callButton: "Call Now", bookButton: "Book Now" },

  stickyBar: { call: "Call", whatsapp: "WhatsApp", book: "Book Now" },

  footer: {
    about: "Personalised skin and hair care in Viluppuram.",
    links: [["Privacy Policy", "/privacy-policy"], ["Terms & Conditions", "/terms-and-conditions"]],
    legal: "Disclaimer: Information on this page is intended for general awareness and does not replace professional medical advice, diagnosis, or treatment. Treatment suitability and results vary between individuals.",
  },
};

export default CONFIG;

"use client"

import React from "react"
import { Phone, Shield, Lock, Eye, MapPin, Mail, Check } from "lucide-react"
import Header from "@/components/elite-minima/Header"
import Footer from "@/components/elite-minima/Footer"
import { BRAND, ADDRESS_FULL, EMAIL, PHONES } from "@/components/elite-minima/config"

const COLLECTED = [
  "Full Name",
  "Mobile Number",
  "Email Address",
  "Address / Area",
  "Health concerns and medical history",
  "Preferred appointment / call time",
]

const USES = [
  "Contact you regarding your inquiry or appointment.",
  "Provide personalized treatment recommendations and solutions.",
  "Schedule and manage your appointments at our clinic.",
  "Send important health updates or information about our services (only with your consent).",
  "Improve our services and enhance your patient experience.",
]

const RIGHTS = [
  "Request access to your health and personal data.",
  "Correct or update your information.",
  "Request deletion of your personal information.",
  "Opt out of promotional communications.",
]

/** Numbered section header — green chip, deep-green title, consistent per section. */
function SectionHead({ n, icon: Icon, title }: { n: number; icon: React.ElementType; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[var(--e-green)] text-white">
        <Icon className="h-4 w-4" />
      </div>
      <h2 className="text-lg font-semibold text-[var(--e-green-deep)] sm:text-xl">
        {n}. {title}
      </h2>
    </div>
  )
}

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="elite flex min-h-screen flex-col">
      <Header />

      <main className="ribbon-wash flex-1 bg-[var(--e-canvas)] py-8 sm:py-12">
        <section className="mx-auto w-full max-w-4xl overflow-hidden rounded-[24px] border border-[var(--e-line)] bg-white shadow-[0_30px_60px_-36px_rgba(14,22,38,0.28)]">
          {/* brand bar — green running into purple, as in the EM monogram */}
          <div className="h-1.5 w-full bg-[linear-gradient(90deg,var(--e-green),var(--e-purple))]" aria-hidden />

          <div className="px-4 py-8 leading-relaxed text-[var(--e-ink-soft)] sm:px-6 md:px-10">
            {/* Title */}
            <div className="mb-8 text-center">
              <p className="kicker justify-center">Your privacy</p>
              <h1 className="mb-2 mt-3 text-2xl font-bold text-[var(--e-ink)] sm:text-3xl md:text-4xl">Privacy Policy</h1>
              <p className="text-[var(--e-muted)]">{BRAND} — The Surgical Speciality Clinic</p>
            </div>

            {/* Intro */}
            <div className="mb-8 rounded-2xl border-l-4 border-[var(--e-purple)] bg-[var(--e-purple-soft)] p-4 sm:p-6">
              <p className="text-base text-[var(--e-ink-soft)] sm:text-lg">
                At <span className="font-semibold text-[var(--e-purple-deep)]">{BRAND}</span>, we are committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, and safeguard your personal information when you interact with us.
              </p>
            </div>

            {/* 1. Information We Collect */}
            <div className="mb-8">
              <SectionHead n={1} icon={Eye} title="Information We Collect" />
              <p className="mb-3 text-[var(--e-muted)]">
                When you fill out a form on our website, book an appointment, or contact us, we collect the following details:
              </p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {COLLECTED.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--e-green)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 2. How We Use Your Information */}
            <div className="mb-8">
              <SectionHead n={2} icon={Shield} title="How We Use Your Information" />
              <p className="mb-3 text-[var(--e-muted)]">We use your informations to:</p>
              <ul className="space-y-3">
                {USES.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--e-green-soft)]">
                      <Check className="h-3 w-3 text-[var(--e-green-deep)]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 3. Data Protection & Security */}
            <div className="mb-8">
              <SectionHead n={3} icon={Lock} title="Data Protection & Security" />
              <div className="rounded-2xl border border-[var(--e-line)] bg-[var(--e-canvas)] p-4 sm:p-5">
                <p className="text-[var(--e-ink-soft)]">
                  We implement strict security measures to protect your personal and health information from unauthorized access, misuse, or
                  disclosure. Your information is stored securely and is <strong>never shared or sold</strong> to third parties without your
                  explicit consent, except as required by law.
                </p>
              </div>
            </div>

            {/* 4. Your Rights & Choices */}
            <div className="mb-8">
              <SectionHead n={4} icon={Shield} title="Your Rights & Choices" />
              <p className="mb-3 text-[var(--e-muted)]">You have the right to:</p>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {RIGHTS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl border border-[var(--e-line-soft)] bg-[var(--e-canvas)] p-3"
                  >
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[var(--e-purple)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* 5. Contact Us */}
            <div className="mb-8">
              <SectionHead n={5} icon={Phone} title="Contact Us" />
              <p className="mb-4 text-[var(--e-muted)]">
                For any questions or concerns about your privacy, or to exercise your rights regarding your personal data, please reach out
                to us at:
              </p>

              <ul className="space-y-3.5 rounded-2xl border border-[var(--e-line)] bg-[var(--e-canvas)] p-4 sm:p-5">
                {PHONES.map((p) => (
                  <li key={p.tel} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[var(--e-green)] text-white">
                      <Phone className="h-4 w-4" />
                    </span>
                    <a href={`tel:${p.tel}`} className="font-semibold text-[var(--e-ink)] hover:text-[var(--e-green-deep)]">
                      {p.display}
                    </a>
                  </li>
                ))}

                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[var(--e-green)] text-white">
                    <Mail className="h-4 w-4" />
                  </span>
                  <a href={`mailto:${EMAIL}`} className="break-all hover:text-[var(--e-green-deep)]">
                    {EMAIL}
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[var(--e-green)] text-white">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>{ADDRESS_FULL}</span>
                </li>
              </ul>
            </div>

            {/* Footer note */}
            <div className="border-t border-[var(--e-line)] pt-6">
              <p className="text-center text-sm text-[var(--e-muted)]">
                By using our website and services, you agree to this Privacy Policy. We may update it from time to time, so please check back
                periodically for any changes.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default PrivacyPolicy

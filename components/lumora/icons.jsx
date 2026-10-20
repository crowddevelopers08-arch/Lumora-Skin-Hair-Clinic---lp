/* Every icon on the landing page comes from here — lucide-react line icons,
   plus the WhatsApp brand mark (lucide ships no brand logos). No emoji. */
export {
  Phone, MapPin, Mail, Lock, ArrowRight, Check, CheckCircle2, X,
  ChevronLeft, ChevronRight, Sparkles, Target, Stethoscope, Microscope,
  ShieldCheck, CalendarCheck, Plus,
} from "lucide-react";

export function WhatsAppIcon({ className = "", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.93.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.9.99 6.7 2.78a9.4 9.4 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46Zm8.06-17.53A11.33 11.33 0 0 0 12.04.63C5.76.63.64 5.74.64 12.03c0 2.01.53 3.97 1.52 5.7L.55 23.63l6.03-1.58a11.37 11.37 0 0 0 5.45 1.39h.01c6.28 0 11.4-5.12 11.4-11.4 0-3.05-1.19-5.91-3.34-8.07Z" />
    </svg>
  );
}

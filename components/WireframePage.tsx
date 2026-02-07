"use client";

import { Blueprint, SectionType } from "@/lib/types";

const sectionOrder: SectionType[] = [
  "hero",
  "about",
  "services",
  "why_us",
  "testimonials",
  "faq",
  "contact"
];

type WireframePageProps = {
  blueprint: Blueprint;
  targetPage: string;
  primaryColor: string;
  secondaryColor: string;
  logoDataUrl?: string;
};

const FALLBACKS = {
  en: {
    services: ["Service 1", "Service 2", "Service 3"],
    whyUs: ["Benefit 1", "Benefit 2", "Benefit 3"],
    faqs: [
      "What services do you provide?",
      "How can I book an appointment?",
      "What are your working hours?",
      "Do you offer consultations?"
    ],
    testimonials: ["Happy customer", "Local client", "Returning guest"],
    labels: {
      hero: "Hero",
      about: "About",
      services: "Services",
      whyUs: "Why Us",
      testimonials: "Testimonials",
      faq: "FAQ",
      contact: "Contact",
      cta: "Call to Action",
      image: "Image placeholder",
      map: "Map / Address",
      send: "Send",
      logo: "Logo",
      contactInfo: "Address, phone, email"
    }
  },
  ka: {
    services: ["სერვისი 1", "სერვისი 2", "სერვისი 3"],
    whyUs: ["უპირატესობა 1", "უპირატესობა 2", "უპირატესობა 3"],
    faqs: [
      "რომელი სერვისები გაქვთ?",
      "როგორ დავჯავშნო ვიზიტი?",
      "რა არის სამუშაო საათები?",
      "გთავაზობთ კონსულტაციას?"
    ],
    testimonials: [
      "კმაყოფილი პაციენტი",
      "ადგილობრივი კლიენტი",
      "რეკომენდაციით მოსული"
    ],
    labels: {
      hero: "ჰერო",
      about: "ჩვენ შესახებ",
      services: "სერვისები",
      whyUs: "რატომ ჩვენ",
      testimonials: "შეფასებები",
      faq: "ხშირად დასმული კითხვები",
      contact: "კონტაქტი",
      cta: "დაგვიკავშირდით",
      image: "სურათის ადგილი",
      map: "რუკა / მისამართი",
      send: "გაგზავნა",
      logo: "ლოგო",
      contactInfo: "მისამართი, ტელეფონი, ელ.ფოსტა"
    }
  }
};

export default function WireframePage({
  blueprint,
  targetPage,
  primaryColor,
  secondaryColor,
  logoDataUrl
}: WireframePageProps) {
  const page = resolvePage(blueprint, targetPage);
  const language = blueprint.site.language;
  const copy = language === "ka" ? FALLBACKS.ka : FALLBACKS.en;
  const getSection = (type: SectionType) =>
    page?.sections.find((section) => section.type === type);

  const hero = getSection("hero");
  const about = getSection("about");
  const services = getSection("services");
  const whyUs = getSection("why_us");
  const testimonials = getSection("testimonials");
  const faq = getSection("faq");
  const contact = getSection("contact");

  const serviceItems = pickItems(services?.bullets, 6, copy.services);
  const whyItems = pickItems(whyUs?.bullets, 3, copy.whyUs);
  const testimonialItems = pickItems(
    testimonials?.bullets,
    3,
    copy.testimonials
  );
  const faqItems = pickItems(faq?.bullets, 6, copy.faqs);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoDataUrl ? (
              <img
                src={logoDataUrl}
                alt="Logo"
                className="h-10 w-10 rounded-xl object-contain bg-white/70 border border-ink/10"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl border border-dashed border-ink/30 bg-white/60 text-[10px] text-ink/40 flex items-center justify-center">
                {copy.labels.logo}
              </div>
            )}
            <div className="h-4 w-24 rounded bg-ink/10" />
          </div>
          <div className="flex gap-2">
            <div className="h-3 w-10 rounded bg-ink/10" />
            <div className="h-3 w-10 rounded bg-ink/10" />
            <div className="h-3 w-10 rounded bg-ink/10" />
          </div>
        </div>
      </div>

      <section className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white/80 px-4 py-3 border border-ink/10">
              <p className="text-xl font-display">
                {hero?.heading ?? copy.labels.hero}
              </p>
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-3 border border-ink/10 text-sm text-ink/70">
              {hero?.content ?? copy.labels.cta}
            </div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            >
              {hero?.cta?.label ?? copy.labels.cta}
            </div>
          </div>
          <div className="h-44 rounded-2xl border border-dashed border-ink/30 bg-white/40 flex items-center justify-center text-xs text-ink/40">
            {copy.labels.image}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-6 space-y-4">
        <div className="rounded-2xl bg-white/80 px-4 py-2 border border-ink/10">
          <p className="text-lg font-display">
            {about?.heading ?? copy.labels.about}
          </p>
        </div>
        <div className="space-y-2">
          {splitLines(about?.content ?? copy.labels.about, 4).map(
            (line, index) => (
              <div
                key={`about-line-${index}`}
                className="rounded-full bg-white/70 px-4 py-2 border border-ink/10 text-sm text-ink/60"
              >
                {line}
              </div>
            )
          )}
        </div>
        {about?.bullets?.length ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {about.bullets.slice(0, 4).map((item, index) => (
              <div
                key={`about-bullet-${index}`}
                className="rounded-xl border border-ink/10 bg-white/60 px-3 py-2 text-xs text-ink/60"
              >
                {item}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-6 space-y-4">
        <div className="rounded-2xl bg-white/80 px-4 py-2 border border-ink/10">
          <p className="text-lg font-display">
            {services?.heading ?? copy.labels.services}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {serviceItems.map((item, index) => (
            <div
              key={`service-${index}`}
              className="rounded-2xl border border-ink/10 bg-white/70 p-4 space-y-3"
            >
              <div className="h-16 rounded-xl border border-dashed border-ink/20 bg-shell/60" />
              <p className="text-sm font-medium text-ink/70">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-6 space-y-4">
        <div className="rounded-2xl bg-white/80 px-4 py-2 border border-ink/10">
          <p className="text-lg font-display">
            {whyUs?.heading ?? copy.labels.whyUs}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {whyItems.map((item, index) => (
            <div
              key={`why-${index}`}
              className="rounded-2xl border border-ink/10 bg-white/70 p-4"
            >
              <p className="text-sm text-ink/70">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-6 space-y-4">
        <div className="rounded-2xl bg-white/80 px-4 py-2 border border-ink/10">
          <p className="text-lg font-display">
            {testimonials?.heading ?? copy.labels.testimonials}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {testimonialItems.map((item, index) => (
            <div
              key={`testimonial-${index}`}
              className="rounded-2xl border border-ink/10 bg-white/70 p-4 space-y-2"
            >
              <div className="h-10 rounded bg-ink/10" />
              <p className="text-xs text-ink/60">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-6 space-y-4">
        <div className="rounded-2xl bg-white/80 px-4 py-2 border border-ink/10">
          <p className="text-lg font-display">{faq?.heading ?? copy.labels.faq}</p>
        </div>
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={`faq-${index}`}
              className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/60"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-6 space-y-4">
        <div className="rounded-2xl bg-white/80 px-4 py-2 border border-ink/10">
          <p className="text-lg font-display">
            {contact?.heading ?? copy.labels.contact}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="space-y-3">
            {defaultFormFields(blueprint.site.language).map((field) => (
              <div
                key={field}
                className="rounded-xl border border-ink/10 bg-white/70 px-4 py-2 text-xs text-ink/60"
              >
                {field}
              </div>
            ))}
            <div
              className="inline-flex items-center rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            >
              {contact?.cta?.label ?? copy.labels.send}
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-dashed border-ink/20 bg-shell/60 h-28 flex items-center justify-center text-xs text-ink/40">
              {copy.labels.map}
            </div>
            <div className="rounded-xl border border-ink/10 bg-white/70 px-4 py-2 text-xs text-ink/60">
              {contact?.content ?? copy.labels.contactInfo}
            </div>
          </div>
        </div>
      </section>

      <footer className="rounded-3xl border border-dashed border-ink/20 bg-shell/40 p-4">
        <div className="h-3 w-32 rounded" style={{ backgroundColor: secondaryColor }} />
      </footer>
    </div>
  );
}

function resolvePage(blueprint: Blueprint, targetPage: string) {
  const normalized = targetPage.trim().toLowerCase();
  return (
    blueprint.pages.find((page) => page.slug === normalized) ||
    blueprint.pages.find((page) => page.title.toLowerCase().includes(normalized)) ||
    blueprint.pages[0]
  );
}

function pickItems(source: string[] | undefined, max: number, fallback: string[]) {
  if (source && source.length > 0) {
    return source.slice(0, max);
  }
  return fallback.slice(0, max);
}

function splitLines(text: string, count: number) {
  const parts = text
    .split(/\.|\?|!|\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length >= count) return parts.slice(0, count);
  if (parts.length === 0) return Array.from({ length: count }, () => text);
  const lines = [...parts];
  while (lines.length < count) {
    lines.push(parts[parts.length - 1]);
  }
  return lines.slice(0, count);
}

function defaultFormFields(language: "ka" | "en") {
  return language === "ka"
    ? ["სახელი", "ტელეფონი", "შეტყობინება"]
    : ["Name", "Phone", "Message"];
}

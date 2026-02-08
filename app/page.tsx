import Link from "next/link";
import Header from "@/widgets/header";
import { widgetRegistry } from "@/widgets/registry";

export default function HomePage() {
  const variants = widgetRegistry.header.variants;
  const sampleProps = {
    brand: "WEBLIVE.AI",
    nav: [
      { label: "მთავარი", href: "/" },
      { label: "სერვისები", href: "/services" },
      { label: "ფასები", href: "/pricing" },
      { label: "კონტაქტი", href: "/contact" },
    ],
    cta: { label: "დაწყება", href: "/build" },
    tagline: "AI-ით შექმნილი ვებსაიტები",
    announcement: "განსაკუთრებული შეთავაზება — 50% ფასდაკლება პირველ თვეზე",
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">Weblive.ai</p>
            <h1 className="text-3xl font-semibold">ჰედერის ვარიანტები</h1>
          </div>
          <Link
            href="/build"
            className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white"
          >
            გენერაცია
          </Link>
        </header>

        <div className="mt-10 space-y-10">
          {variants.map((variant, index) => (
            <section key={variant} className="space-y-4">
              <div>
                <p className="text-sm font-semibold">ვერსია {index + 1}</p>
                <p className="text-xs text-neutral-500">{variant}</p>
              </div>
              <Header
                variant={variant}
                props={sampleProps}
                theme={{
                  primaryColor: "#2563eb",
                  secondaryColor: "#111827",
                  fontFamily: "Noto Sans Georgian",
                  radius: 16,
                  buttonStyle: "solid",
                }}
              />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

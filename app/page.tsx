import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Weblive.ai</p>
            <h1 className="text-3xl font-semibold">AI ვებსაიტის გენერატორი</h1>
          </div>
          <Link
            href="/build"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
          >
            დაწყება
          </Link>
        </header>

        <section className="mt-16 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-5xl font-semibold leading-tight">
              შექმენი სრულფასოვანი ვებსაიტის გეგმა წუთებში.
            </h2>
            <p className="mt-6 text-lg text-white/70">
              Weblive.ai თქვენს ბიზნესის მონაცემებს აქცევს სტრუქტურირებულ და რედაქტირებად
              ვებსაიტის ბლუპრინტად. რეგისტრაცია არ არის საჭირო, ჰოსტინგი არაა — მხოლოდ
              სწრაფი და გასაზიარებელი პრევიუ.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                href="/build"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                კონსტრუქტორის გაშვება
              </Link>
              <Link
                href="/widget-references"
                className="rounded-full border border-white/20 px-6 py-3 text-sm"
              >
                ვიჯეტების ნახვა
              </Link>
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-slate-900 p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">რას მიიღებთ</p>
            <ul className="mt-6 space-y-4 text-sm text-white/70">
              <li>ნაბიჯ-ნაბიჯ შიზელი ბიზნესის მონაცემებისთვის.</li>
              <li>AI-ისთვის მზად JSON საიტის გეგმა ვიჯეტებით.</li>
              <li>რედაქტირებადი პრევიუ გადაადგილებადი სექციებით.</li>
              <li>7-დღიანი გასაზიარებელი პრევიუს ბმული.</li>
              <li>ჩამოსატვირთი SEO პაკეტი.</li>
            </ul>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            "კლინიკებისთვის გამზადებული ლეიაუთები",
            "სააგენტოებისთვის სტორიტელინგი",
            "E-commerce კონვერსიის ნაკადები",
          ].map((item) => (
            <div key={item} className="rounded-[28px] border border-white/10 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold">{item}</h3>
              <p className="mt-2 text-sm text-white/60">
                კატეგორიაზე მორგებული ვიჯეტების რეცეპტები.
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

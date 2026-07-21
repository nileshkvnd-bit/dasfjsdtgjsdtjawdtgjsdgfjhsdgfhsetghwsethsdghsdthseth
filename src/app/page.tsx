import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const HIGHLIGHTS = [
  {
    title: "Self & Player Tools",
    desc: "God mode, no ragdoll, off-radar, fast run, and other core survivability options in one place.",
  },
  {
    title: "Vehicle Suite",
    desc: "Spawn, customize, and control vehicles with a dedicated Vehicle tab — including a noclip flight mode that works on foot or inside a car.",
  },
  {
    title: "Protection Systems",
    desc: "Built-in crash and modder-attack protection that watches for known malicious script events and blocks them automatically.",
  },
  {
    title: "Custom HUD Themes",
    desc: "Multiple built-in color themes (Cyberpunk, Racing Red, Ice Blue, Golden, and more) for the in-game overlay.",
  },
];

const STATS = [
  { value: "12+", label: "Feature tabs" },
  { value: "Lexis v10", label: "Framework" },
  { value: "1:1", label: "Key-to-device lock" },
  { value: "Discord", label: "Direct support" },
];

const FAQS = [
  {
    q: "How do I get a license key?",
    a: "Sign up, complete checkout, and your key is generated automatically and linked to your account. It's ready on your dashboard immediately.",
  },
  {
    q: "Can I use one key on multiple PCs?",
    a: "No — every key locks to the first device it's used on. This keeps accounts from being shared or resold.",
  },
  {
    q: "I got a new PC. How do I move my key?",
    a: "Message dushayt on Discord and your HWID lock will be reset so you can activate on your new device.",
  },
  {
    q: "How is Kyron kept up to date?",
    a: "Kyron is actively maintained against changes to the Lexis v10 API, with updates posted to the changelog as they ship.",
  },
];

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="flex-1 overflow-hidden">
        {/* Hero */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="kyron-glow absolute left-1/2 top-1/4 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-kyron-red/15 blur-[140px]" />
            <div className="kyron-energy-ring absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="kyron-lightning absolute inset-0" />
          </div>

          <div className="absolute inset-x-0 top-1/3 h-px overflow-hidden pointer-events-none">
            <div className="kyron-scanline h-full w-1/3 bg-gradient-to-r from-transparent via-kyron-red to-transparent" />
          </div>

          {/* Full-bleed faded logo, blended into the page rather than boxed */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="kyron-hero-float relative w-full max-w-4xl aspect-[3/2] mt-8">
              <Image
                src="/kyron-hero-fade.png"
                alt=""
                fill
                priority
                className="object-contain kyron-hero-image"
              />
            </div>
          </div>

          <div className="relative max-w-3xl mx-auto px-4 text-center kyron-fade-up mt-[28vh]">
            <h1 className="sr-only">Kyron — GTA Online Mod Menu</h1>
            <p className="text-neutral-300 text-lg max-w-xl mx-auto mb-10">
              A feature-rich GTA Online mod menu built on the Lexis
              scripting framework — vehicle tools, protection systems, and
              a clean in-game UI.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="kyron-btn kyron-btn-primary bg-kyron-red text-white px-6 py-3 rounded-lg font-medium hover:bg-kyron-red-deep transition-colors"
              >
                Get Kyron
              </Link>
              <Link
                href="/features"
                className="kyron-btn border border-neutral-700 px-6 py-3 rounded-lg font-medium hover:border-kyron-red/60 transition-colors backdrop-blur-sm"
              >
                See features
              </Link>
            </div>
          </div>
        </section>

        {/* Stat strip */}
        <section className="max-w-4xl mx-auto px-4 pt-14 pb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-neutral-900 rounded-xl overflow-hidden">
            {STATS.map((s) => (
              <div key={s.label} className="bg-black px-4 py-6 text-center">
                <div className="text-xl sm:text-2xl font-bold text-kyron-red">
                  {s.value}
                </div>
                <div className="text-xs text-neutral-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Product teaser */}
        <section className="max-w-3xl mx-auto px-4 pt-16 pb-4">
          <Link
            href="/products/kyron"
            className="group block border border-neutral-900 rounded-2xl p-8 hover:border-kyron-red/40 transition-colors relative overflow-hidden"
          >
            <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-kyron-red/0 group-hover:bg-kyron-red/10 blur-3xl transition-colors" />
            <div className="flex flex-col sm:flex-row items-center gap-6 relative">
              <div className="relative w-32 h-24 flex-shrink-0">
                <Image
                  src="/kyron-hero-fade.png"
                  alt="Kyron"
                  fill
                  className="object-contain scale-125"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <span className="text-xs text-kyron-red font-medium">GTA</span>
                <h3 className="font-bold text-lg mb-1">Kyron — Lifetime</h3>
                <p className="text-neutral-500 text-sm">
                  One-time payment, instant key delivery.
                </p>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold mb-1">$15.00</div>
                <span className="text-kyron-red text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                  View product →
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Highlights grid */}
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-24">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Built for reliability
          </h2>
          <p className="text-neutral-500 text-center mb-10 text-sm">
            Everything organized into focused tabs, kept current against
            Lexis API changes.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.title}
                className="group border border-neutral-900 rounded-xl p-6 hover:border-kyron-red/40 transition-colors relative overflow-hidden"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-kyron-red/0 group-hover:bg-kyron-red/10 blur-2xl transition-colors" />
                <h3 className="font-semibold mb-2 relative">{h.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed relative">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-4 pb-24">
          <h2 className="text-2xl font-bold mb-8 text-center">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            {[
              { step: "1", title: "Sign up & purchase", desc: "Create an account and get your license key instantly." },
              { step: "2", title: "Download & run", desc: "Your key locks to your device on first use." },
              { step: "3", title: "Play", desc: "Load into GTA Online and press = to open the menu." },
            ].map((s) => (
              <div key={s.step}>
                <div className="w-10 h-10 rounded-full border border-kyron-red/40 text-kyron-red flex items-center justify-center mx-auto mb-4 text-sm font-medium">
                  {s.step}
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-neutral-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 pb-24">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="group border border-neutral-900 rounded-xl px-5 py-4 open:border-kyron-red/30 transition-colors"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between font-medium text-sm">
                  {f.q}
                  <span className="text-neutral-600 group-open:text-kyron-red group-open:rotate-45 transition-transform text-lg leading-none">
                    +
                  </span>
                </summary>
                <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-3xl mx-auto px-4 pb-28 text-center">
          <div className="border border-kyron-red/20 rounded-2xl px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-kyron-red/10 to-transparent" />
            <h2 className="text-2xl font-bold mb-3">Ready to get started?</h2>
            <p className="text-neutral-500 text-sm mb-6">
              Create an account and get your license key in minutes.
            </p>
            <Link
              href="/signup"
              className="kyron-btn kyron-btn-primary inline-block bg-kyron-red text-white px-6 py-3 rounded-lg font-medium hover:bg-kyron-red-deep transition-colors"
            >
              Get Kyron
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

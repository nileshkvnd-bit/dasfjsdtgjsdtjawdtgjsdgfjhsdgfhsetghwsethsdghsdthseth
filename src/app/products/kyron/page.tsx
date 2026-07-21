"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase-browser";

const FEATURES = [
  "Custom HUD — multiple color themes for a personalized in-game overlay",
  "Vehicle Suite — spawn, customize, and noclip on foot or in a vehicle",
  "Protection Systems — crash and modder-attack protection built in",
  "Regular Updates — kept current against Lexis v10 API changes",
  "And more — self, player, world, and spawn tooling across dedicated tabs",
];

const REQUIREMENTS = ["Lexis installed and updated to the latest version"];

type PayMethod = "card" | "paypal" | "crypto";

const PAY_METHODS: { id: PayMethod; label: string; note: string }[] = [
  { id: "card", label: "Credit / Debit Card", note: "Via Stripe" },
  { id: "paypal", label: "PayPal", note: "Pay with your PayPal balance or card" },
  { id: "crypto", label: "Crypto", note: "BTC, ETH, USDT and more" },
];

export default function KyronProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [payMethod, setPayMethod] = useState<PayMethod>("card");
  const [starting, setStarting] = useState(false);

  async function handlePurchase() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/signup?next=/products/kyron");
      return;
    }

    setStarting(true);
    // Payment provider integration plugs in here — this routes to a
    // checkout-session endpoint per method once that's wired up.
    try {
      const res = await fetch(`/api/checkout/${payMethod}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      alert(
        "Checkout isn't fully wired up yet — payment provider setup is the next step."
      );
    } catch {
      alert(
        "Checkout isn't fully wired up yet — payment provider setup is the next step."
      );
    } finally {
      setStarting(false);
    }
  }

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-24">
          <div className="text-sm text-neutral-600 mb-6">
            <Link href="/products" className="hover:text-neutral-400">
              Products
            </Link>{" "}
            / <span className="text-neutral-500">Kyron</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left: image + description */}
            <div>
              <div className="relative aspect-square sm:aspect-video border border-neutral-900 rounded-xl overflow-hidden bg-black">
                <Image
                  src="/kyron-hero-fade.png"
                  alt="Kyron"
                  fill
                  className="object-contain scale-125"
                  priority
                />
              </div>

              <span className="text-xs text-kyron-red font-medium mt-6 block">
                GTA
              </span>
              <h1 className="text-3xl font-bold mt-1 mb-3">Kyron</h1>
              <p className="text-neutral-400 leading-relaxed mb-4">
                A feature-rich GTA Online mod menu built on the Lexis
                scripting framework. Vehicle tools, protection systems, and
                a clean in-game UI — kept current against Lexis v10 API
                changes.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {["Custom UI", "Vehicle Tools", "Protection", "HWID-Locked"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-neutral-900 text-neutral-400 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <span className="text-kyron-red">★</span> Features
                  </h2>
                  <ul className="space-y-2">
                    {FEATURES.map((f) => (
                      <li
                        key={f}
                        className="text-sm text-neutral-500 leading-relaxed"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <span className="text-kyron-red">✓</span> Requirements
                  </h2>
                  <ul className="space-y-2">
                    {REQUIREMENTS.map((r) => (
                      <li
                        key={r}
                        className="text-sm text-neutral-500 leading-relaxed"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: purchase panel */}
            <div>
              <div className="border border-neutral-900 rounded-xl p-6 sticky top-24">
                <h2 className="font-semibold mb-4">Select plan</h2>
                <div className="border border-kyron-red/40 bg-kyron-red/5 rounded-lg px-4 py-3 flex items-center justify-between mb-6">
                  <span className="text-sm font-medium">Lifetime</span>
                  <span className="font-bold">$15.00</span>
                </div>

                <h2 className="font-semibold mb-3 text-sm">Payment method</h2>
                <div className="space-y-2 mb-6">
                  {PAY_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                        payMethod === m.id
                          ? "border-kyron-red bg-kyron-red/5"
                          : "border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{m.label}</span>
                        <span
                          className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                            payMethod === m.id
                              ? "border-kyron-red bg-kyron-red"
                              : "border-neutral-700"
                          }`}
                        />
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5">
                        {m.note}
                      </p>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={starting}
                  className="kyron-btn kyron-btn-primary w-full bg-kyron-red text-white rounded-lg py-3 font-medium hover:bg-kyron-red-deep transition-colors disabled:opacity-50"
                >
                  {starting ? "Starting checkout..." : "Purchase Now — $15.00"}
                </button>

                <p className="text-xs text-neutral-600 mt-3 text-center">
                  Your key is generated instantly after payment and appears
                  on your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

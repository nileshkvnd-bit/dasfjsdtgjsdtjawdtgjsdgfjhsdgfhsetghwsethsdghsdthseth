"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

type License = {
  license_key: string;
  status: "unredeemed" | "active" | "revoked";
  hwid: string | null;
  hwid_reset_count: number;
  last_validated_at: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loadingLicenses, setLoadingLicenses] = useState(true);

  const [redeemKey, setRedeemKey] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  useEffect(() => {
    async function checkAuthAndLoad() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }
      setCheckingAuth(false);
      await loadLicenses();
    }
    checkAuthAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadLicenses() {
    setLoadingLicenses(true);
    const res = await fetch("/api/me/license");
    const data = await res.json();
    if (data.ok) setLicenses(data.licenses);
    setLoadingLicenses(false);
  }

  async function handleRedeem(e: React.FormEvent) {
    e.preventDefault();
    setRedeemError(null);
    setRedeemSuccess(false);
    setRedeemLoading(true);

    const res = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: redeemKey.trim() }),
    });
    const data = await res.json();

    setRedeemLoading(false);

    if (!data.ok) {
      const messages: Record<string, string> = {
        invalid_key: "That key doesn't exist.",
        already_claimed: "That key is already linked to another account.",
        missing_key: "Enter a key first.",
        not_logged_in: "Please log in again.",
      };
      setRedeemError(messages[data.reason] ?? "Something went wrong.");
      return;
    }

    setRedeemSuccess(true);
    setRedeemKey("");
    await loadLicenses();
  }

  if (checkingAuth) {
    return (
      <>
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-neutral-500 text-sm">Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 pt-16 pb-24">
          <h1 className="text-2xl font-bold mb-10">Dashboard</h1>

          {/* Redeem box */}
          <div className="border border-neutral-900 rounded-xl p-5 mb-8">
            <h2 className="font-semibold mb-1">Redeem a key</h2>
            <p className="text-neutral-500 text-sm mb-4">
              If you received a license key by email, enter it here to link
              it to your account.
            </p>
            <form onSubmit={handleRedeem} className="flex gap-2">
              <input
                type="text"
                placeholder="KYRON-XXXX-XXXX-XXXX"
                value={redeemKey}
                onChange={(e) => setRedeemKey(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-kyron-red/50 font-mono"
              />
              <button
                type="submit"
                disabled={redeemLoading}
                className="bg-kyron-red text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-kyron-red-deep transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {redeemLoading ? "..." : "Redeem"}
              </button>
            </form>
            {redeemError && (
              <p className="text-red-400 text-sm mt-2">{redeemError}</p>
            )}
            {redeemSuccess && (
              <p className="text-green-400 text-sm mt-2">
                Key linked to your account.
              </p>
            )}
          </div>

          {/* Licenses list */}
          <h2 className="font-semibold mb-3">Your licenses</h2>

          {loadingLicenses ? (
            <p className="text-neutral-500 text-sm">Loading...</p>
          ) : licenses.length === 0 ? (
            <div className="border border-neutral-900 rounded-xl p-6 text-center">
              <p className="text-neutral-500 text-sm">
                No licenses yet. Purchase Kyron to get your key.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {licenses.map((lic) => (
                <div
                  key={lic.license_key}
                  className="border border-neutral-900 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm">
                      {lic.license_key}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        lic.status === "active"
                          ? "bg-green-500/10 text-green-400"
                          : lic.status === "revoked"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-neutral-500/10 text-neutral-400"
                      }`}
                    >
                      {lic.status}
                    </span>
                  </div>

                  <div className="text-sm text-neutral-500 space-y-1 mb-4">
                    <p>
                      HWID: {lic.hwid ? "bound to a device" : "not yet bound"}
                    </p>
                    {lic.last_validated_at && (
                      <p>
                        Last used:{" "}
                        {new Date(lic.last_validated_at).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {lic.status !== "revoked" && (
                      <a
                        href="/api/download"
                        className="bg-kyron-red text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-kyron-red-deep transition-colors"
                      >
                        Download Kyron
                      </a>
                    )}
                    {lic.hwid && (
                      <a
                        href="https://discord.com/users/dushayt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-400 hover:text-white transition-colors"
                      >
                        Need a HWID reset? Contact dushayt on Discord →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Check your email to confirm your account.");
  }

  async function handleDiscordSignup() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-neutral-400 text-sm mb-6">
          Sign up to purchase and manage your Kyron license.
        </p>

        <button
          onClick={handleDiscordSignup}
          className="w-full mb-4 flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] transition-colors rounded-lg py-2.5 font-medium"
        >
          Continue with Discord
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-neutral-800 flex-1" />
          <span className="text-neutral-500 text-xs">OR</span>
          <div className="h-px bg-neutral-800 flex-1" />
        </div>

        <form onSubmit={handleSignup} className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-neutral-600"
          />
          <input
            type="password"
            required
            minLength={8}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-neutral-600"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-kyron-red text-white rounded-lg py-2.5 font-medium hover:bg-kyron-red-deep transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="text-neutral-500 text-sm mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

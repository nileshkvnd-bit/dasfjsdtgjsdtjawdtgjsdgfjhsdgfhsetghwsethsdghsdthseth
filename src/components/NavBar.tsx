"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

const BASE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/changelog", label: "Changelog" },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  }

  const links = user
    ? [...BASE_LINKS, { href: "/dashboard", label: "Dashboard" }]
    : BASE_LINKS;

  const displayName = user?.email ? user.email.split("@")[0] : "";

  return (
    <header className="border-b border-neutral-900 sticky top-0 bg-black/80 backdrop-blur z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          KY<span className="text-kyron-red">RON</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!checked ? null : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-kyron-red/20 border border-kyron-red/40 flex items-center justify-center text-xs font-semibold text-kyron-red">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{displayName}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden shadow-xl">
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-900 hover:text-white transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-neutral-400 hover:text-white transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="kyron-btn text-sm bg-kyron-red text-white px-4 py-1.5 rounded-lg font-medium hover:bg-kyron-red-deep transition-colors"
              >
                Get Kyron
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

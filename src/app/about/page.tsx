import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 pt-20 pb-24">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">About Kyron</h1>

          <div className="space-y-6 text-neutral-400 leading-relaxed">
            <p>
              Kyron is a GTA Online mod menu built on the Lexis scripting
              framework, focused on stability and a clean in-game
              experience. Every feature is organized into dedicated tabs —
              Self, Player, World, Vehicle, Spawn, and more — so the menu
              stays fast and easy to navigate even as functionality grows.
            </p>
            <p>
              Development is ongoing, with regular updates to keep pace with
              Lexis API changes and to keep protection systems current
              against known crash and exploit patterns.
            </p>
            <p>
              Every license is tied to a single account and device. This
              keeps the project sustainable and lets support stay focused —
              if you ever need to move your license to a new PC, reach out
              on Discord and it&apos;ll be sorted out directly.
            </p>
          </div>

          <div className="mt-12 border border-neutral-900 rounded-xl p-6">
            <h2 className="font-semibold mb-2">Support</h2>
            <p className="text-neutral-500 text-sm mb-4">
              Questions, issues, or license transfers — reach out directly.
            </p>
            <a
              href="https://discord.com/users/dushayt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-kyron-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-kyron-red-deep transition-colors"
            >
              Discord: dushayt
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

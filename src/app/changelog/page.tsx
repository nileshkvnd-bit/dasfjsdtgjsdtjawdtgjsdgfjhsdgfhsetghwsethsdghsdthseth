import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// Add new entries to the TOP of this array as you release updates.
const ENTRIES = [
  {
    version: "v4.0",
    date: "2026",
    changes: [
      "Updated for compatibility with the latest Lexis v10 API",
      "Improved crash and modder-attack protection coverage",
      "Added additional HUD color themes",
      "General stability and performance improvements",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 pt-20 pb-24">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Changelog</h1>
          <p className="text-neutral-400 mb-12">
            Every update to Kyron, in order.
          </p>

          <div className="space-y-10">
            {ENTRIES.map((entry) => (
              <div
                key={entry.version}
                className="border-l-2 border-neutral-800 pl-6"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <h2 className="text-xl font-bold">{entry.version}</h2>
                  <span className="text-neutral-600 text-sm">
                    {entry.date}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {entry.changes.map((c) => (
                    <li
                      key={c}
                      className="text-sm text-neutral-500 flex gap-2"
                    >
                      <span className="text-neutral-700">—</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

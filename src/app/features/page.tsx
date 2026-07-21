import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const CATEGORIES = [
  {
    name: "Self",
    items: [
      "God mode",
      "No ragdoll",
      "Off-radar",
      "Fast run",
      "Invisibility",
    ],
  },
  {
    name: "Player",
    items: [
      "Player-targeted actions",
      "Network-aware entity handling",
    ],
  },
  {
    name: "World",
    items: [
      "Traffic removal thread",
      "World-to-screen positioning (shared across menu threads)",
    ],
  },
  {
    name: "Protection",
    items: [
      "Crash protection — blocks known GTA Online crash events",
      "Modder attack / exploit blocking",
      "Menu detection",
      "Targeted protection against specific attack signatures",
    ],
  },
  {
    name: "Vehicle",
    items: [
      "Vehicle spawning & customization",
      "Noclip — works on foot or inside a vehicle",
      "Auto waypoint teleport",
      "Vehicle thrower with animation handling",
    ],
  },
  {
    name: "Spawn",
    items: ["Squad spawning with configurable model & weapon loadouts"],
  },
  {
    name: "UI",
    items: [
      "Multiple HUD color themes (Cyberpunk, Racing Red, Ice Blue, Golden, Neon Purple, and more)",
      "Debug overlay with performance marks and memory tracking",
    ],
  },
  {
    name: "Settings",
    items: [
      "Configurable keybinds",
      "Persistent on-disk config saving",
      "Adjustable debug/logging verbosity",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-20 pb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Features</h1>
          <p className="text-neutral-400 max-w-xl">
            Kyron is organized into focused tabs so you can find what you
            need fast. Here&apos;s what&apos;s inside.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-24">
          <div className="grid sm:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.name}
                className="border border-neutral-900 rounded-xl p-6"
              >
                <h3 className="font-semibold mb-3">{cat.name}</h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-neutral-500 flex gap-2"
                    >
                      <span className="text-neutral-700">—</span>
                      <span>{item}</span>
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

import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function ProductsPage() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-20 pb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Products</h1>
          <p className="text-neutral-400 max-w-xl">
            Browse the catalog. Click a product for full details and
            purchase options.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 pb-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link
              href="/products/kyron"
              className="group border border-neutral-900 rounded-xl overflow-hidden hover:border-kyron-red/50 transition-colors"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <Image
                  src="/kyron-hero-fade.png"
                  alt="Kyron"
                  fill
                  className="object-contain scale-125 group-hover:scale-[1.35] transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                  In Stock
                </span>
              </div>
              <div className="p-5">
                <span className="text-xs text-kyron-red font-medium">
                  GTA
                </span>
                <h3 className="font-semibold text-lg mt-1 mb-2">Kyron</h3>
                <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                  A feature-rich GTA Online mod menu with vehicle tools,
                  protection systems, and a clean in-game UI.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {["Vehicle Tools", "Protection", "Custom UI", "HWID-Locked"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-neutral-900 text-neutral-400 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-neutral-600 text-xs">from </span>
                    <span className="font-bold">$15.00</span>
                  </div>
                  <span className="text-kyron-red text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

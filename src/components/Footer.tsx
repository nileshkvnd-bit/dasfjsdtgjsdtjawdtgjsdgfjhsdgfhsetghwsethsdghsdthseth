export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 mt-24">
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
        <p>© {new Date().getFullYear()} Kyron. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a
            href="https://discord.com/users/dushayt"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Discord: dushayt
          </a>
          <a href="/changelog" className="hover:text-white transition-colors">
            Changelog
          </a>
        </div>
      </div>
    </footer>
  );
}

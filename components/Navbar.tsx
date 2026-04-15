import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 flex justify-between items-center px-6 h-16 w-full z-50 bg-transparent backdrop-blur-xl border-b border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold tracking-tighter text-emerald-400 font-headline uppercase tracking-widest">
          NeuroFlow
        </span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {["Network", "Vault", "Nodes"].map((item) => (
          <Link
            key={item}
            href="#"
            className="text-emerald-900/60 font-headline uppercase tracking-widest text-sm hover:text-emerald-300 hover:bg-emerald-500/10 px-3 py-1 transition-all"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-emerald-500 hover:text-emerald-300 transition-colors">
          <span className="material-symbols-outlined">terminal</span>
        </button>
        <button className="p-2 text-emerald-500 hover:text-emerald-300 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="w-8 h-8 bg-surface-variant overflow-hidden border border-primary/30">
          <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-primary font-mono text-xs">
            OP
          </div>
        </div>
      </div>
    </nav>
  );
}

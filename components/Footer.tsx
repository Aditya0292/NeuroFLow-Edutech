import Link from "next/link";

const footerLinks = [
  { label: "Privacy_Protocol", href: "#" },
  { label: "Terms_of_Engagement", href: "#" },
  { label: "Neural_API", href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-primary/10 bg-surface-container-low relative overflow-hidden">
      {/* Top glow line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Left stats */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-primary">System Clock</span>
            <span className="font-mono text-sm tracking-tighter">23:59:01 UTC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-primary">Operator Level</span>
            <span className="font-mono text-sm tracking-tighter">LVL_42_ARCHITECT</span>
          </div>
        </div>

        {/* Center links */}
        <div className="flex items-center gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs font-mono text-on-surface-variant hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right status */}
        <div className="flex items-center gap-2 px-3 py-1 border border-primary/30 rounded-full">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-primary uppercase font-bold">
            Mainframe Sync: 100%
          </span>
        </div>
      </div>
    </footer>
  );
}

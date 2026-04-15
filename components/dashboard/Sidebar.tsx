import Link from "next/link";

const navItems = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard", active: true },
  { label: "Missions", icon: "track_changes", href: "/dashboard/missions", active: false },
  { label: "Armory", icon: "bolt", href: "/dashboard/armory", active: false },
  { label: "Comms", icon: "forum", href: "/dashboard/comms", active: false },
];

export default function Sidebar() {
  return (
    <div className="glass-panel w-72 h-screen fixed left-0 top-0 border-r border-primary/20 flex flex-col justify-between p-6 z-10 hidden md:flex">
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <header className="flex items-center gap-3">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-on-surface text-xl font-headline font-bold uppercase tracking-[0.05em]">
            Cmd_Center
          </h2>
        </header>

        {/* User Profile */}
        <div className="flex gap-4 items-center bg-surface-container-high p-4 border-l-2 border-primary">
          <div className="size-12 bg-surface-container-highest ghost-border flex items-center justify-center text-primary font-mono text-lg font-bold">
            01
          </div>
          <div className="flex flex-col">
            <h1 className="text-on-surface font-headline font-medium uppercase text-sm tracking-wider">
              Operative 01
            </h1>
            <p className="text-secondary font-mono text-xs">SYS.ADMIN</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 border-l-2 transition-all group ${
                item.active
                  ? "bg-surface-container-highest border-primary"
                  : "border-transparent hover:bg-surface-container-high hover:border-outline-variant"
              }`}
            >
              <span
                className={`material-symbols-outlined ${
                  item.active ? "text-primary" : "text-on-surface-variant group-hover:text-on-surface"
                }`}
                style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span
                className={`font-headline uppercase text-sm tracking-wide ${
                  item.active
                    ? "text-on-surface"
                    : "text-on-surface-variant group-hover:text-on-surface"
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {/* System Status Footer */}
      <div className="mt-auto pt-6 border-t ghost-border">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-on-surface-variant">SYS_STAT:</span>
          <span className="text-secondary">ONLINE</span>
        </div>
        <div className="flex justify-between items-center text-xs font-mono mt-2">
          <span className="text-on-surface-variant">UPLINK:</span>
          <span className="text-primary">SECURE</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function TopBar() {
  const [command, setCommand] = useState("");

  return (
    <div className="flex justify-between items-center w-full pb-4 border-b ghost-border">
      {/* Mobile title */}
      <h1 className="text-3xl font-headline font-bold uppercase tracking-[0.05em] text-on-surface md:hidden">
        Dashboard
      </h1>

      {/* Desktop terminal input */}
      <div className="hidden md:flex items-center gap-2 border-b border-outline-variant/50 focus-within:border-primary pb-1 w-64 transition-colors">
        <span className="material-symbols-outlined text-on-surface-variant text-sm">terminal</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command..."
          className="bg-transparent border-none text-on-surface font-mono text-sm focus:ring-0 w-full p-0 placeholder:text-on-surface-variant/50 outline-none"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <button className="bg-surface-container-highest p-2 hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="bg-surface-container-highest p-2 hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface md:hidden">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function AccessTerminal() {
  const [uid, setUid] = useState("");
  const [cipher, setCipher] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: hook up your auth logic here
    console.log({ uid, cipher, remember });
  };

  return (
    <div className="w-full lg:w-1/2 flex justify-center">
      <div className="w-full max-w-md relative">
        {/* Offset ghost border */}
        <div className="absolute -top-4 -left-4 w-full h-full border border-primary/20 pointer-events-none" />

        {/* Terminal Card */}
        <div className="bg-surface-container-low backdrop-blur-xl p-8 clip-terminal border border-primary/30 relative">
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-br" />

          {/* Header */}
          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-headline font-black uppercase text-primary tracking-tighter">
              Access Terminal
            </h2>
            <p className="text-xs font-mono text-on-surface-variant terminal-cursor">
              Verification required...
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* UID */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Operator Identity
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="UID_0000"
                  className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-on-surface font-mono py-3 px-0 placeholder:text-outline outline-none"
                />
                <span className="absolute right-0 top-3 text-primary/40 material-symbols-outlined text-sm">
                  person
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Cipher Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={cipher}
                  onChange={(e) => setCipher(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-on-surface font-mono py-3 px-0 placeholder:text-outline outline-none"
                />
                <span className="absolute right-0 top-3 text-primary/40 material-symbols-outlined text-sm">
                  key
                </span>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 bg-surface-container border-outline text-primary focus:ring-0 rounded-none accent-primary"
                />
                <span className="text-on-surface-variant group-hover:text-primary transition-colors">
                  Remember Node
                </span>
              </label>
              <a href="#" className="text-secondary hover:underline">
                Forgot Key?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-primary text-on-primary font-headline font-black uppercase tracking-[0.3em] hover:bg-primary-dim transition-all shadow-[0_0_15px_rgba(105,246,184,0.3)]"
            >
              Initialize
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8 pt-6 border-t border-primary/10 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-outline-variant" />
              <span className="text-[10px] font-mono text-outline uppercase">
                External Uplink
              </span>
              <div className="h-[1px] flex-1 bg-outline-variant" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant hover:border-primary/50 transition-all font-mono text-xs uppercase">
                {/* Google SVG icon inline to avoid img dependency */}
                <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button className="flex items-center justify-center gap-2 py-3 border border-outline-variant hover:border-primary/50 transition-all font-mono text-xs uppercase">
                {/* GitHub SVG icon */}
                <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                Github
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-xs text-on-surface-variant font-mono">
              Unregistered Operator?{" "}
            </span>
            <a
              href="#"
              className="text-primary font-mono text-xs uppercase tracking-widest hover:underline"
            >
              Request Access
            </a>
          </div>
        </div>

        {/* Floating Log Stream */}
        <div className="absolute -right-12 -bottom-12 hidden xl:block w-32 h-32 bg-surface-variant border border-primary/20 backdrop-blur-md p-3 text-[10px] font-mono overflow-hidden">
          <div className="text-primary mb-1">LOG_STREAM</div>
          <div className="text-on-surface-variant/50 leading-tight">
            &gt; PING 127.0.0.1
            <br />
            &gt; OK 0.2ms
            <br />
            &gt; AUTH_REQ_RECV
            <br />
            &gt; PARSING_CYPHER
            <br />
            &gt; NODES_ONLINE: 402
            <br />
            &gt; STREAMS: ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function AccessTerminal() {
  const [uid, setUid] = useState("");
  const [cipher, setCipher] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const supabase = createClient();
    
    let result;
    if (mode === 'signup') {
      result = await supabase.auth.signUp({
        email: uid,
        password: cipher,
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email: uid,
        password: cipher,
      });
    }

    if (result.error) {
      setErrorMsg(result.error.message);
      setLoading(false);
    } else {
      if (mode === 'signup') {
        // usually signUp on Supabase requires email confirmation unless disabled.
        // We'll proceed to dash but inform if error
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
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
           <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-black uppercase text-primary tracking-tighter">
              {mode === 'login' ? 'Access Terminal' : 'Registration Protocol'}
            </h2>
           </div>
            <p className="text-xs font-mono text-on-surface-variant terminal-cursor">
              {mode === 'login' ? 'Verification required...' : 'New operator initialization...'}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleEmailAuth}>
            {/* UID */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Operator Identity (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="operator@neuroflow.net"
                  className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-on-surface font-mono py-3 px-0 placeholder:text-outline outline-none"
                  required
                />
                <span className="absolute right-0 top-3 text-primary/40 material-symbols-outlined text-sm">
                  mail
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">
                Cipher Key (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={cipher}
                  onChange={(e) => setCipher(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-highest border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-on-surface font-mono py-3 px-0 placeholder:text-outline outline-none"
                  required
                />
                <span className="absolute right-0 top-3 text-primary/40 material-symbols-outlined text-sm">
                  key
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-error font-mono">{errorMsg}</div>
            )}

            {/* Remember + Forgot */}
            {mode === 'login' && (
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
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-on-primary font-headline font-black uppercase tracking-[0.2em] hover:bg-primary-dim transition-all shadow-[0_0_15px_rgba(105,246,184,0.3)] disabled:opacity-50"
            >
              {loading 
                 ? "Processing..." 
                 : (mode === 'login' ? "Initialize Session" : "Register Credentials")
              }
            </button>
          </form>

          {/* Mode Toggle Link */}
          <div className="mt-6 pt-4 border-t border-primary/10 text-center">
            <span className="text-xs text-on-surface-variant font-mono">
              {mode === 'login' ? "Unregistered Operator? " : "Already authenticated? "}
            </span>
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setErrorMsg("");
              }}
              className="text-primary font-mono text-xs uppercase tracking-widest hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              {mode === 'login' ? "Request Access" : "Return to Login"}
            </button>
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

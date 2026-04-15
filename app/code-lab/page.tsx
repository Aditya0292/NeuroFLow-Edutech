"use client"
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { executeCode, challenges, CodingChallenge, validateChallenge } from "@/lib/piston";

type Message = {
  sender: "Syn_Intel" | "Operator";
  time: string;
  text: string;
  type?: "warning" | "success" | "info" | "error";
};

export default function CodeLabPage() {
  const [terminalInput, setTerminalInput] = useState("");
  const [sessionActive, setSessionActive] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeMsn, setActiveMsn] = useState<CodingChallenge>(challenges[0]);
  
  const [code, setCode] = useState(activeMsn.starterCode);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "Syn_Intel",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: "SYSTEM_ONLINE. Awaiting neural code synthesis from Operator 01.",
      type: "info",
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setCode(activeMsn.starterCode);
    setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: `NEW_MISSION: ${activeMsn.title}. OBJECTIVE: ${activeMsn.description}`,
        type: "info",
      }]);
  }, [activeMsn]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const newMsg: Message = {
      sender: "Operator",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: terminalInput,
    };

    setMessages((prev) => [...prev, newMsg]);
    const cmd = terminalInput.toUpperCase().trim();
    setTerminalInput("");

    setTimeout(() => {
      let response: Message = {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: "COMMAND_RECOGNIZED: EXECUTION_PENDING...",
        type: "info",
      };

      if (cmd === "START" || cmd === "INITIATE") {
        setSessionActive(true);
        response.text = "SYSTEM_RE-INITIATED. SYNCHRONIZING_COGNITIVE_NODES...";
        response.type = "success";
      } else if (cmd === "STOP" || cmd === "HALT") {
        setSessionActive(false);
        response.text = "SYSTEM_HALTED. ALL_PROCESSES_SUSPENDED.";
        response.type = "warning";
      } else if (cmd === "HELP") {
        response.text = "AVAILABLE_COMMANDS: START, STOP, RESET, EXECUTE, MSN_1..5";
      } else if (cmd === "EXECUTE" || cmd === "RUN") {
        evaluateCode();
        return;
      } else if (cmd === "CLEAN" || cmd === "CLEAR") {
        setMessages([]);
        return;
      } else if (cmd.startsWith("MSN_")) {
          const idx = parseInt(cmd.split("_")[1]) - 1;
          if (challenges[idx]) {
              setActiveMsn(challenges[idx]);
              return;
          }
      } 
      setMessages((prev) => [...prev, response]);
    }, 400);
  };

  const evaluateCode = async () => {
    if (!sessionActive) {
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: "ERROR: System offline. Use 'START' to restore power.",
        type: "error",
      }]);
      return;
    }

    setIsEvaluating(true);
    setMessages((prev) => [...prev, {
      sender: "Operator",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: "EXECUTING_ALGORITHMIC_STEP...",
    }]);

    try {
      const { output, error } = await executeCode(code);
      
      if (output) {
         setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '1-digit', minute: '2-digit' }),
            text: `>>> OUT:\n${output}`,
            type: "info",
          }]);
      }
      
      if (error) {
         setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '1-digit', minute: '2-digit' }),
            text: `>>> ERR:\n${error}`,
            type: "error",
          }]);
      }

      // Check for success
      const isCorrect = validateChallenge(output, activeMsn.expectedOutput);

      const res = await fetch("/api/code-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            code, 
            challenge: activeMsn.title,
            output,
            error,
            isCorrect
        })
      });
      const data = await res.json();
      
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: data.message,
        type: data.message.includes("APPROVED") ? "success" : "warning",
      }]);

      if (isCorrect) {
          setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            text: `MISSION_SUCCESS: Objective ${activeMsn.title} finalized. XP Gain: +${activeMsn.xp}`,
            type: "success",
          }]);
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: "COMMUNICATION_FAILURE: Neural link terminated unexpectedly.",
        type: "error",
      }]);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 z-50 scanlines mix-blend-screen" />
      <Sidebar />

      <main className="flex-1 md:ml-72 p-6 lg:p-10 flex flex-col overflow-y-auto min-h-screen relative z-10">
          <div className="mb-8 flex justify-between items-end border-b border-outline-variant/10 pb-6">
            <div>
              <h1 className="text-3xl font-headline font-black uppercase text-on-surface tracking-widest flex items-center gap-2">
                SYNTHESIS_LAB <span className="text-primary animate-pulse">_</span>
              </h1>
              <p className="font-mono text-[10px] text-secondary uppercase tracking-[0.3em] mt-2">
                Protocol: Algorithmic_Verification // Site: Alpha_Core
              </p>
            </div>
            <div className="flex gap-10 items-center">
                 <div className="flex flex-col items-end">
                    <span className="font-mono text-[9px] text-on-surface-variant uppercase">Current_Rank</span>
                    <span className="font-headline font-bold text-xl text-primary">ELITE_OP</span>
                 </div>
                 <div className="h-10 w-[1px] bg-outline-variant/20" />
                 <div className="flex flex-col items-end">
                    <span className="font-mono text-[9px] text-on-surface-variant uppercase">System_State</span>
                    <span className={`font-headline font-bold text-xl ${sessionActive ? "text-primary" : "text-error"}`}>{sessionActive ? "NOMINAL" : "HALTED"}</span>
                 </div>
            </div>
          </div>

          <div className="flex flex-col 2xl:flex-row gap-8 flex-1 mb-8 overflow-hidden">
            {/* Left Column: Missions */}
            <div className="w-full 2xl:w-[380px] flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 w-max mb-2">
                 <div className="size-1.5 bg-primary rounded-full animate-ping" />
                 <h3 className="font-mono font-black text-primary text-[10px] tracking-widest uppercase">
                  Available_Missions
                </h3>
              </div>

              {challenges.map((msn, idx) => (
                <div 
                    key={msn.id} 
                    onClick={() => setActiveMsn(msn)}
                    className={`p-6 relative group cursor-pointer transition-all border shadow-2xl overflow-hidden ${activeMsn.id === msn.id ? "bg-surface-container-high border-primary/50" : "bg-surface-container-low/40 border-outline-variant/10 hover:border-primary/30"}`}>
                    
                    {activeMsn.id === msn.id && <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 blur-2xl" />}

                    <div className="flex justify-between items-start mb-4">
                        <div className={`font-mono text-[9px] px-2 py-0.5 border ${activeMsn.id === msn.id ? "bg-primary text-on-primary border-primary" : "text-on-surface-variant border-outline-variant/20"}`}>
                            MSN_0{idx + 1} // {msn.difficulty.toUpperCase()}
                        </div>
                        <span className={`material-symbols-outlined text-[16px] ${activeMsn.id === msn.id ? "text-primary shadow-glow" : "text-outline-variant/40"}`}>
                            {activeMsn.id === msn.id ? "verified" : "radio_button_unchecked"}
                        </span>
                    </div>

                    <h4 className="font-headline font-black text-on-surface text-base mb-2 uppercase tracking-tight group-hover:text-primary transition-colors">
                        {msn.title}
                    </h4>
                    <p className="font-body text-[11px] text-on-surface-variant leading-relaxed opacity-70">
                        {msn.description}
                    </p>
                    <div className="mt-6 flex justify-between items-center">
                        <span className="font-mono text-[9px] text-secondary tracking-widest">+ {msn.xp} XP_GAIN</span>
                        <span className="font-mono text-[8px] text-outline-variant uppercase">Click to Deploy</span>
                    </div>
                </div>
              ))}
            </div>

            {/* Right Column: IDE */}
            <div className="flex-1 flex flex-col gap-6 min-h-[700px]">
                <div className="flex-1 border border-outline-variant/20 bg-[#060a15] relative overflow-hidden shadow-2xl flex flex-col group">
                    <div className={`absolute top-0 right-0 w-full h-full pointer-events-none transition-opacity duration-1000 ${sessionActive ? "opacity-10" : "opacity-0"}`} style={{backgroundImage: 'radial-gradient(circle at 100% 0%, #69f6b8 0%, transparent 40%)'}} />

                    {/* Editor Header */}
                    <div className="flex items-center justify-between border-b border-outline-variant/15 bg-surface-container-low/80 backdrop-blur-md px-6 py-4">
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
                                <span className="font-mono text-xs text-on-surface font-bold tracking-widest uppercase">source_logic // {activeMsn.title.toLowerCase().replace(/ /g, '_')}.py</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={evaluateCode}
                                disabled={isEvaluating || !sessionActive}
                                className={`group relative px-8 py-2.5 font-headline font-black text-[11px] uppercase tracking-[0.2em] transition-all overflow-hidden ${sessionActive && !isEvaluating ? "bg-primary text-on-primary hover:scale-[1.02] shadow-[0_0_30px_rgba(105,246,184,0.3)]" : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed"}`}
                            >
                                <div className="absolute inset-0 bg-white/20 translate-x-[-101%] group-hover:translate-x-[101%] transition-transform duration-500 skew-x-12" />
                                {isEvaluating ? "SYNTHESIZING..." : "EXECUTE_SEQUENCE"}
                            </button>
                        </div>
                    </div>

                    {/* Code Space */}
                    <div className={`flex-1 flex overflow-hidden relative ${!sessionActive || isEvaluating ? "opacity-40 grayscale" : ""}`}>
                        <div className="w-[50px] bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col items-center py-6 text-on-surface-variant/20 font-mono text-[11px] select-none">
                            {code.split('\n').map((_, i) => (
                            <span key={i} className="h-[22px] leading-[22px]">{String(i + 1).padStart(2, '0')}</span>
                            ))}
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck={false}
                            readOnly={isEvaluating}
                            className="flex-1 bg-transparent text-primary/80 font-mono text-sm leading-[22px] p-6 resize-none outline-none custom-scrollbar whitespace-pre shadow-inner z-10 w-full h-full placeholder-primary/20"
                            style={{ tabSize: 4 }}
                        />
                    </div>
                </div>

                {/* Comms Window */}
                <div className="h-[340px] border border-primary/20 bg-[#080d19] shadow-2xl flex flex-col relative z-20">
                     <div className="px-4 py-2.5 border-b border-primary/10 flex justify-between items-center bg-primary/5">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary text-[14px]">psychology</span>
                            <span className="font-headline font-black text-[10px] uppercase tracking-widest text-on-surface flex items-center gap-2">
                                SYN_INTEL // Cognitive_Buffer
                                <div className="size-1 rounded-full bg-primary animate-pulse" />
                            </span>
                        </div>
                        <div className="font-mono text-[9px] text-primary/50 tracking-tighter">SECURE_CHANNEL_ESTABLISHED</div>
                    </div>
                    
                    <div className="p-6 flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(105,246,184,0.02),transparent)]">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex flex-col gap-1.5 ${m.sender === "Operator" ? "items-end" : "items-start"}`}>
                        <div className="font-mono text-[8px] text-on-surface-variant/60 uppercase tracking-widest flex items-center gap-1.5">
                            {m.sender === "Syn_Intel" && <span className="size-1.5 bg-primary/40 rounded-full" />}
                            {m.sender} // {m.time}
                        </div>
                        <div className={`border font-mono text-[11px] p-4 leading-relaxed transition-all whitespace-pre-wrap max-w-[90%] shadow-lg ${
                            m.sender === "Operator" 
                            ? "bg-surface/40 border-outline-variant/10 text-on-surface-variant italic" 
                            : (m.type === 'error' ? 'bg-error/10 border-error/50 text-error animate-shake' : m.type === 'warning' ? 'bg-amber-400/5 border-amber-400/30 text-amber-300' : m.type === 'success' ? 'bg-primary/10 border-primary/40 text-primary shadow-[0_0_20px_rgba(105,246,184,0.1)]' : 'bg-surface/60 border-outline-variant/10 text-on-surface')
                        }`}>
                            {m.text}
                        </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                    </div>

                    <form onSubmit={handleCommand} className="p-3 border-t border-outline-variant/10 bg-surface-container-low flex">
                        <div className="border border-primary/20 flex-1 flex items-center px-4 py-2.5 bg-[#060a15] focus-within:border-primary/50 transition-all shadow-inner group">
                            <span className="text-primary font-mono text-xs mr-4 font-black opacity-40 group-focus-within:opacity-100">&gt;</span>
                            <input 
                            type="text" 
                            value={terminalInput}
                            onChange={(e) => setTerminalInput(e.target.value)}
                            placeholder="Awaiting Command..." 
                            className="bg-transparent border-none w-full font-mono text-[11px] text-on-surface outline-none placeholder-on-surface-variant/20 focus:ring-0 p-0 uppercase tracking-widest" 
                            />
                        </div>
                    </form>
                </div>
            </div>
          </div>
        </main>
    </div>
  );
}

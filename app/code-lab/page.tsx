"use client"
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { executeCode, challenges, CodingChallenge } from "@/lib/piston";

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

  // Sync code and description when mission changes
  useEffect(() => {
    setCode(activeMsn.starterCode);
    setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: `NEW_MISSION_ASSIGNED: ${activeMsn.title}. HINT: ${activeMsn.hint}`,
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
      } else if (cmd === "RESET") {
        setMessages([]);
        response.text = "LOG_BUFFER_CLEARED. SYSTEM_IDLE.";
      } else if (cmd === "HELP") {
        response.text = "AVAILABLE_COMMANDS: START, STOP, RESET, EXECUTE, MISSION_1...5";
      } else if (cmd === "EXECUTE") {
        evaluateCode();
        return;
      } else if (cmd.startsWith("MISSION_")) {
          const idx = parseInt(cmd.split("_")[1]) - 1;
          if (challenges[idx]) {
              setActiveMsn(challenges[idx]);
              return;
          } else {
              response.text = "INVALID_MISSION_INDEX. ACCESS_DENIED.";
              response.type = "error";
          }
      } else {
        response.text = `UNKNOWN_COMMAND: ${cmd}. TYPE 'HELP' FOR LIST.`;
        response.type = "warning";
      }
      setMessages((prev) => [...prev, response]);
    }, 600);
  };

  const evaluateCode = async () => {
    if (!sessionActive) {
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: "ERROR: Cannot execute code while SYSTEM_HALTED. Enter START command.",
        type: "error",
      }]);
      return;
    }

    setIsEvaluating(true);
    setMessages((prev) => [...prev, {
      sender: "Operator",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      text: "INITIATING_CODE_SYNTHESIS_PIPELINE...",
    }]);

    try {
      // 1. REAL EXECUTION via Piston
      const { output, error } = await executeCode(code);
      
      if (output) {
         setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            text: `EXECUTION_OUTPUT:\n${output}`,
            type: "info",
          }]);
      }
      
      if (error) {
         setMessages((prev) => [...prev, {
            sender: "Syn_Intel",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            text: `RUNTIME_ERROR_DETECTED:\n${error}`,
            type: "error",
          }]);
      }

      // 2. AI ANALYSIS via SYN_INTEL
      const res = await fetch("/api/code-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            code, 
            challenge: activeMsn.title,
            output,
            error
        })
      });
      const data = await res.json();
      
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: data.message,
        type: data.message.includes("APPROVED") ? "success" : "warning",
      }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, {
        sender: "Syn_Intel",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        text: "COMMUNICATION_FAILURE: AI core offline or connection timing out.",
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
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-headline font-black uppercase text-on-surface tracking-wide flex items-center gap-2">
                Learning Hub <span className="text-primary">&amp;</span> Code Lab
              </h1>
              <p className="font-mono text-xs text-secondary uppercase tracking-wider mt-2">
                ACTIVE_OPERATOR: 01 // DEPLOYMENT_STATUS: {sessionActive ? "ONLINE" : "OFFLINE"}
              </p>
            </div>
          </div>

          <div className="flex gap-8 flex-1 min-h-[600px] mb-8">
            {/* Left Column: Missions */}
            <div className="w-[340px] flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-primary px-2 py-1 w-max mb-1">
                <div className="w-1.5 h-4 bg-surface" />
                <h3 className="font-headline font-bold text-on-primary text-[10px] tracking-widest uppercase">
                  Mission Directory
                </h3>
              </div>

              {challenges.map((msn, idx) => (
                <div 
                    key={msn.id} 
                    onClick={() => setActiveMsn(msn)}
                    className={`p-5 relative group cursor-pointer transition-all border-l-4 shadow-lg ${activeMsn.id === msn.id ? "bg-surface-container-high border-primary translate-x-1" : "bg-surface-container-low border-outline-variant/30 hover:bg-surface-container"}`}>
                    
                    <div className="absolute top-5 right-5">
                       <span className={`material-symbols-outlined text-[18px] ${activeMsn.id === msn.id ? "text-primary" : "text-on-surface-variant/30"}`}>
                       {activeMsn.id === msn.id ? "target" : "radio_button_unchecked"}
                       </span>
                    </div>

                    <div className={`inline-block font-mono text-[9px] px-1.5 py-0.5 mb-3 border ${activeMsn.id === msn.id ? "bg-primary/20 text-primary border-primary/30" : "bg-surface/40 text-on-surface-variant border-outline-variant/20"}`}>
                    MSN_00{idx + 1} // {msn.difficulty}
                    </div>
                    <h4 className="font-headline font-bold text-on-surface text-lg mb-2 uppercase tracking-wide">
                    {msn.title}
                    </h4>
                    <p className="font-body text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {msn.description}
                    </p>
                    <div className="mt-6 flex justify-between items-end opacity-60">
                    <span className="font-mono text-[9px] text-secondary">REWARD: +{msn.xp}XP</span>
                    </div>
                </div>
              ))}
            </div>

            {/* Right Column: Code Editor */}
            <div className="flex-1 border border-outline-variant/20 bg-[#0d1326] relative overflow-hidden shadow-2xl flex flex-col group">
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[120px] pointer-events-none transition-colors ${sessionActive ? "bg-primary/5" : "bg-error/5"}`} />

              <div className="flex border-b border-outline-variant/20 bg-surface-container-low/90 backdrop-blur-md sticky top-0 z-10">
                <div className="px-4 py-3 border-r border-outline-variant/20 flex items-center gap-2 border-t-2 border-t-primary bg-[#0d1326]">
                  <span className="material-symbols-outlined text-primary text-[16px]">code</span>
                  <span className="font-mono text-xs text-on-surface font-bold uppercase">{activeMsn.title.toLowerCase().replace(/ /g, '_')}.py</span>
                </div>
                <div className="ml-auto px-4 py-2 flex items-center gap-4">
                  <button 
                    onClick={evaluateCode}
                    disabled={isEvaluating}
                    className={`flex items-center gap-2 px-4 py-1.5 font-mono text-[10px] uppercase font-bold transition-all ${sessionActive ? "bg-primary text-on-primary hover:bg-primary-dim shadow-[0_0_10px_rgba(105,246,184,0.3)]" : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50"}`}
                  >
                    {isEvaluating ? <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span> : <span className="material-symbols-outlined text-[14px]">play_arrow</span>}
                    {isEvaluating ? "SYNCHRONIZING..." : "EXECUTE_LOGIC"}
                  </button>
                </div>
              </div>

              <div className={`flex-1 flex overflow-hidden relative ${!sessionActive || isEvaluating ? "opacity-50 grayscale" : ""}`}>
                 <div className="w-12 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col items-center py-4 text-outline font-mono text-sm select-none">
                    {code.split('\n').map((_, i) => (
                      <span key={i} className="mb-0.5">{i + 1}</span>
                    ))}
                 </div>
                 <textarea
                   value={code}
                   onChange={(e) => setCode(e.target.value)}
                   spellCheck={false}
                   readOnly={isEvaluating}
                   className="flex-1 bg-transparent text-primary/90 font-mono text-sm leading-relaxed p-4 resize-none outline-none custom-scrollbar whitespace-pre shadow-inner z-10 block w-full h-full"
                   style={{ tabSize: 4 }}
                 />
              </div>

              <div className="border-t border-primary/30 bg-surface shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col relative z-20" style={{ height: "300px" }}>
                <div className="px-3 py-2 border-b border-primary/20 flex justify-between items-center bg-primary/5">
                  <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary text-[14px]">terminal</span>
                     <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">SYN_INTEL Tactical Output</span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className={`size-2 rounded-full ${sessionActive ? (isEvaluating ? "bg-amber-400 animate-pulse" : "bg-primary animate-pulse") : "bg-error"}`} />
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto custom-scrollbar bg-surface-container-low/50">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex flex-col gap-1 ${m.sender === "Operator" ? "items-end" : "items-start"}`}>
                      <div className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest flex items-center gap-1">
                        {m.sender === "Syn_Intel" && <span className="material-symbols-outlined text-[10px] text-primary">smart_toy</span>}
                        {m.sender} // {m.time}
                      </div>
                      <div className={`border font-mono text-xs p-3 leading-relaxed transition-all whitespace-pre-wrap ${
                        m.sender === "Operator" 
                        ? "bg-surface border-outline-variant/20 text-on-surface-variant max-w-[85%]" 
                        : (m.type === 'error' ? 'bg-error/10 border-error/30 text-error' : m.type === 'warning' ? 'bg-error/5 border-error/20 text-error' : m.type === 'success' ? 'bg-primary/10 border-primary/30 text-primary shadow-[0_0_10px_rgba(105,246,184,0.1)]' : 'bg-surface border-outline-variant/20 text-on-surface')
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleCommand} className="p-2 border-t border-outline-variant/20 bg-surface-container flex">
                  <div className="border border-primary/30 flex-1 flex items-center px-3 py-2 bg-surface focus-within:border-primary transition-colors">
                    <span className="text-secondary font-mono text-xs mr-3">&gt;</span>
                    <input 
                      type="text" 
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      placeholder="ENTER_CMD... (Try 'EXECUTE' or 'HELP')" 
                      className="bg-transparent border-none w-full font-mono text-xs text-on-surface outline-none placeholder-on-surface-variant/40 focus:ring-0 p-0 uppercase" 
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

"use client"
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

type Message = {
  sender: "Syn_Intel" | "Operator";
  time: string;
  text: string;
  type?: "warning" | "success" | "info";
};

export default function LearningHubPage() {
  const [terminalInput, setTerminalInput] = useState("");
  const [sessionActive, setSessionActive] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "Syn_Intel",
      time: "09:42:11",
      text: "Warning: Neural weight deviation detected in MSN_082. Recommend increasing learning rate by 0.05.",
      type: "warning",
    },
    {
      sender: "Operator",
      time: "09:42:25",
      text: "Adjusting hyperparameters now. Checking for gradient explosion.",
    },
    {
      sender: "Syn_Intel",
      time: "09:43:02",
      text: "Gradient stable. Validation accuracy increased to 92.4%. Mission MSN_082 milestone reached.",
      type: "success",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    // Simple Command Processing
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
        response.text = "AVAILABLE_COMMANDS: START, STOP, RESET, STATUS, CLEAR";
      } else {
        response.text = `UNKNOWN_COMMAND: ${cmd}. TYPE 'HELP' FOR LIST.`;
        response.type = "warning";
      }

      setMessages((prev) => [...prev, response]);
    }, 600);
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col overflow-x-hidden">
      {/* Scanline overlay */}
      <div className="scanlines mix-blend-screen" />

      {/* Top Navbar */}
      <header className="border-b border-outline-variant/20 bg-surface-container-low px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-8">
          <h1 className="text-primary font-headline font-black text-xl tracking-widest uppercase">
            NEUROFLOW
          </h1>
          <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
            <Link href="/learning" className="text-primary border-b-2 border-primary pb-1">
              Neural Hub
            </Link>
            <Link href="/games" className="hover:text-primary transition-colors pb-1">
              ML Models
            </Link>
            <Link href="/quiz" className="hover:text-primary transition-colors pb-1">
              Datasets
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className={`bg-surface-container border transition-colors px-3 py-1.5 flex items-center gap-2 font-mono text-[10px] uppercase ${sessionActive ? "border-primary/20 text-primary" : "border-error/20 text-error"}`}>
            <span className={`material-symbols-outlined text-[14px] ${sessionActive ? "animate-pulse" : ""}`}>terminal</span>
            SESSION_{sessionActive ? "ACTIVE" : "HALTED"}: OP_CODE_LAB
          </div>
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors text-sm">notifications</span>
            <span className="material-symbols-outlined hover:text-primary cursor-pointer transition-colors text-sm">settings</span>
            <div className="size-6 bg-surface-container-highest border border-primary/30 ml-2" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden z-10">
        {/* Sidebar */}
        <aside className="w-64 border-r border-outline-variant/20 bg-surface-container-low flex flex-col justify-between">
          <div>
            <div className="p-6 border-b border-outline-variant/10">
              <h2 className="font-headline font-bold text-on-surface tracking-wider text-sm">OPERATOR_01</h2>
              <p className="font-mono text-[10px] text-on-surface-variant uppercase mt-1 tracking-widest">
                Level 42 Architect
              </p>
            </div>
            <nav className="flex flex-col py-4">
              {[
                { label: "Neural Hub", icon: "hub", active: true },
                { label: "ML Models", icon: "model_training" },
                { label: "Datasets", icon: "database" },
                { label: "Logs", icon: "receipt_long" },
                { label: "Terminal", icon: "terminal" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href="#"
                  className={`flex items-center gap-4 px-6 py-3 border-l-4 transition-all ${
                    item.active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] opacity-80" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                    {item.icon}
                  </span>
                  <span className="font-headline text-sm font-bold tracking-wide">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="p-6 pb-8">
            <button className={`w-full py-3 font-headline font-bold uppercase tracking-widest text-sm transition-all shadow-lg ${sessionActive ? "bg-primary text-on-primary shadow-primary/10 hover:bg-primary-dim" : "bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50"}`}>
              Deploy Model
            </button>
            <div className="mt-4 flex flex-col gap-2 font-mono text-[10px] text-on-surface-variant uppercase">
              <a href="#" className="flex items-center gap-2 hover:text-primary"><span className="material-symbols-outlined text-[14px]">grid_view</span> System Health</a>
              <a href="#" className="flex items-center gap-2 hover:text-error"><span className="material-symbols-outlined text-[14px]">logout</span> Logout</a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-headline font-black uppercase text-on-surface tracking-wide flex items-center gap-2">
              Learning Hub <span className="text-primary">&amp;</span> Code Lab
            </h1>
            <div className="flex justify-between items-end mt-2">
              <p className="font-mono text-xs text-secondary uppercase tracking-wider">
                ACCESS_LEVEL: RESTRICTED // SUBJECT: NEURAL_NETWORK_SYNTHESIS
              </p>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Mission Progress</span>
                <div className="flex gap-1">
                  <div className="h-2 w-6 bg-secondary" />
                  <div className="h-2 w-6 bg-secondary" />
                  <div className={`h-2 w-6 ${sessionActive ? "bg-secondary/30" : "bg-error/20"}`} />
                  <div className={`h-2 w-6 ${sessionActive ? "bg-secondary/30" : "bg-error/20"}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8 flex-1 min-h-[500px]">
            {/* Left Column: Missions */}
            <div className="w-[340px] flex flex-col gap-4">
              <div className="flex items-center gap-2 bg-primary px-2 py-0.5 w-max mb-1">
                <div className="w-1.5 h-4 bg-surface" />
                <h3 className="font-headline font-bold text-on-primary text-xs tracking-widest uppercase">
                  Active Missions
                </h3>
              </div>

              {/* Mission Card 1 */}
              <div className="bg-surface-container-low border-l-4 border-primary p-5 relative group cursor-pointer hover:bg-surface-container transition-colors">
                <div className="absolute top-5 right-5 text-primary">
                  <span className="material-symbols-outlined text-[18px]">lock_open</span>
                </div>
                <div className="inline-block bg-primary/20 text-primary font-mono text-[9px] px-1.5 py-0.5 mb-3 border border-primary/30">
                  MSN_082
                </div>
                <h4 className="font-headline font-bold text-on-surface text-lg mb-2 uppercase tracking-wide">
                  Tensor_Flow_Optimization
                </h4>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  Refine neural weights in a multi-layered perceptron environment. Critical for model stability.
                </p>
                <div className="mt-6 flex justify-between items-end">
                  <div className="flex gap-1 font-mono text-[9px] text-on-surface-variant">
                    <span className="border border-outline-variant/40 px-1 py-0.5 bg-surface-container-highest">01</span>
                    <span className="border border-primary/50 text-primary px-1 py-0.5 bg-primary/10">02</span>
                    <span className="border border-outline-variant/40 px-1 py-0.5 bg-surface-container-highest opacity-50">03</span>
                  </div>
                  <span className="font-mono text-[10px] text-secondary">REWARD: +500XP</span>
                </div>
              </div>

              {/* Mission Card 2 */}
              <div className="bg-surface-container-low/50 border border-outline-variant/10 p-5 relative opacity-50">
                <div className="absolute top-5 right-5 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div className="inline-block bg-surface-container-highest text-on-surface-variant font-mono text-[9px] px-1.5 py-0.5 mb-3 border border-outline-variant/20">
                  MSN_085
                </div>
                <h4 className="font-headline font-bold text-on-surface text-lg mb-2 uppercase tracking-wide">
                  GPT_Kernel_Injection
                </h4>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  Analyze transformer attention maps to isolate heuristic hallucinations in real-time.
                </p>
                <div className="mt-6 flex justify-between items-end">
                  <div className="font-mono text-[9px] text-on-surface-variant border border-outline-variant/40 px-1 py-0.5 bg-surface-container-highest">??</div>
                  <span className="font-mono text-[10px] text-on-surface-variant">LOCKED_BY_LVL_45</span>
                </div>
              </div>

              {/* Cognitive Sync Rate Widget */}
              <div className="bg-surface-container border border-outline-variant/20 p-4 mt-auto">
                <div className="flex justify-between font-mono text-[9px] text-on-surface-variant uppercase mb-2">
                  <span>Diagnostic</span>
                  <span className="text-primary/70">System_Diagnostic</span>
                </div>
                <h4 className="font-headline font-bold text-sm tracking-widest text-on-surface uppercase mb-3">
                  Cognitive Sync Rate
                </h4>
                <div className="flex gap-1 h-3 mb-2">
                  <div className={`flex-1 transition-colors ${sessionActive ? "bg-primary" : "bg-error/40"}`} />
                  <div className={`flex-1 transition-colors ${sessionActive ? "bg-primary" : "bg-error/40"}`} />
                  <div className={`flex-1 transition-colors ${sessionActive ? "bg-primary" : "bg-error/40"}`} />
                  <div className="flex-1 bg-surface-container-highest relative overflow-hidden">
                    <div className={`h-full transition-all ${sessionActive ? "w-1/2 bg-primary" : "w-0 bg-error"}`} />
                  </div>
                </div>
                <div className="flex justify-between font-mono text-[10px] uppercase">
                  <span className={sessionActive ? "text-primary" : "text-error"}>{sessionActive ? "82% OPTIMIZED" : "SYNC_INTERRUPTED"}</span>
                  <span className="text-on-surface-variant">{sessionActive ? "SYNC_STABLE" : "OFFLINE"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Code Editor */}
            <div className="flex-1 border border-outline-variant/20 bg-[#0d1326] relative overflow-hidden shadow-2xl flex flex-col">
              {/* Backglow element */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[100px] pointer-events-none transition-colors ${sessionActive ? "bg-primary/5" : "bg-error/5"}`} />

              {/* Editor Tabs */}
              <div className="flex border-b border-outline-variant/20 bg-surface-container-low/80">
                <div className="px-4 py-2 border-r border-outline-variant/20 flex items-center gap-2 border-t-2 border-t-primary bg-[#0d1326]">
                  <span className="material-symbols-outlined text-primary text-[14px]">code</span>
                  <span className="font-mono text-xs text-on-surface">neural_synthesis.py</span>
                </div>
                <div className="px-4 py-2 border-r border-outline-variant/20 flex items-center gap-2 opacity-50">
                  <span className="font-mono text-xs text-on-surface-variant">config.json</span>
                </div>
                <div className="ml-auto px-4 py-2 flex items-center gap-3">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-on-surface cursor-pointer">play_arrow</span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant hover:text-on-surface cursor-pointer">save</span>
                </div>
              </div>

              {/* Code Area */}
              <div className="flex-1 p-4 font-mono text-sm leading-loose overflow-auto relative text-on-surface-variant">
                <div className={`flex ${sessionActive ? "opacity-100" : "opacity-40 grayscale transition-all"}`}>
                  {/* Line Numbers */}
                  <div className="flex flex-col text-right pr-4 text-outline border-r border-outline-variant/20 select-none mr-4">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <span key={i}>{i + 1}</span>
                    ))}
                  </div>
                  {/* Code */}
                  <div className="flex flex-col whitespace-pre">
                    <span className="text-outline italic"># OPERATOR_COMMAND: INITIATE_LAYER_NORMALIZATION</span>
                    <span><span className="text-primary">import</span> neuroflow <span className="text-primary">as</span> nf</span>
                    <span><span className="text-primary">from</span> synapse <span className="text-primary">import</span> WeightMatrix, Node</span>
                    <br />
                    <span><span className="text-secondary">def</span> <span className="text-on-surface">synthesize_layer</span>(inputs, weights):</span>
                    <span className="text-outline/70 italic text-xs ml-4">"""Calibrates nodal thresholds for tactical inference"""</span>
                    <span className="ml-4">layer = nf.<span className="text-secondary">Dense</span>(</span>
                    <span className="ml-8 text-tertiary">units</span>=512,
                    <span className="ml-8 text-tertiary">activation</span>=<span className="text-secondary">'relu'</span>,
                    <span className="ml-8 text-tertiary">kernel_initializer</span>=<span className="text-secondary">'glorot_uniform'</span>
                    <span className="ml-4">)</span>
                    <span className="ml-4"><span className="text-primary">return</span> layer.<span className="text-secondary">execute</span>(inputs, weights)</span>
                    <br />
                    <span className="text-outline italic"># TODO: Implement backprop delta compression</span>
                    <span>node_cluster = <span className="text-secondary">WeightMatrix</span>(<span className="text-secondary">0x4F2A</span>)</span>
                    <span><span className="text-primary">print</span>(<span className="text-secondary">"SYNCING_NODES..."</span>)</span>
                    <span className={`w-2 h-4 bg-primary inline-block mt-1 ${sessionActive ? "animate-pulse" : ""}`} />
                  </div>
                </div>

                {/* Comms Dialog Box Overlaid */}
                <div className="absolute bottom-6 right-6 w-[360px] bg-surface border border-primary/40 shadow-[0_0_20px_rgba(105,246,184,0.1)] flex flex-col">
                  {/* Dialog Header */}
                  <div className="px-3 py-2 border-b border-primary/20 flex justify-between items-center bg-primary/5">
                    <div className="flex items-center gap-2">
                       <span className="material-symbols-outlined text-primary text-[14px]">support_agent</span>
                       <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface">AI Tactical Comms</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className={`size-1.5 rounded-full ${sessionActive ? "bg-primary animate-pulse" : "bg-error"}`} />
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer">close</span>
                    </div>
                  </div>
                  {/* Chat Area */}
                  <div className="p-4 flex flex-col gap-4 h-[240px] overflow-y-auto custom-scrollbar">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col gap-1 ${m.sender === "Operator" ? "items-end" : ""}`}>
                        <div className="font-mono text-[9px] text-on-surface-variant uppercase">{m.sender} // {m.time}</div>
                        <div className={`border font-mono text-xs p-3 leading-relaxed transition-all ${
                          m.sender === "Operator" 
                          ? "bg-surface-container-highest border-outline-variant/30 text-on-surface-variant max-w-[85%]" 
                          : `${m.type === 'warning' ? 'bg-error/5 border-error/20 text-error' : m.type === 'success' ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-surface-container border-outline-variant/20 text-on-surface'}`
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  {/* Input area */}
                  <form onSubmit={handleCommand} className="p-2 border-t border-outline-variant/20 bg-surface-container">
                    <div className="border border-primary/30 flex items-center px-2 py-1 bg-surface focus-within:border-primary transition-colors">
                      <span className="text-secondary font-mono text-xs mr-2">&gt;</span>
                      <input 
                        type="text" 
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        placeholder="AWAITING_INPUT..." 
                        className="bg-transparent border-none w-full font-mono text-xs text-on-surface outline-none placeholder-on-surface-variant/50 focus:ring-0 p-0 uppercase" 
                      />
                    </div>
                  </form>
                </div>

              </div>

              {/* Editor Footer */}
              <div className="border-t border-outline-variant/20 bg-surface-container-low px-4 py-1.5 flex justify-between font-mono text-[10px] text-outline">
                <div className="flex gap-4">
                  <span>LINE 18, COL 24</span>
                  <span>UTF-8</span>
                </div>
                <div className="flex gap-4">
                  <span>PYTHON 3.11</span>
                  <span className={sessionActive ? "text-primary" : "text-error"}>SYNC_{sessionActive ? "ACTIVE" : "HALTED"}</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #41475b; border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #69f6b8; }
      `}</style>
    </div>
  );
}

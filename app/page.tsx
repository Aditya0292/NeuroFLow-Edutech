export default function HomePage() {
  return (
    <>
      <div className="scanlines" />

      <nav className="fixed top-0 z-50 flex h-16 w-full items-center justify-between border-b border-primary/20 bg-transparent px-6 shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-xl">
        <div className="flex items-center gap-8">
          <span className="font-headline text-2xl font-bold uppercase tracking-widest text-primary">
            NeuroFlow
          </span>
          <div className="hidden gap-6 md:flex">
            <a className="border-b-2 border-primary font-headline text-sm uppercase tracking-widest text-primary" href="#">
              Neural Hub
            </a>
            <a className="font-headline text-sm uppercase tracking-widest text-on-surface-variant transition-colors duration-100 hover:text-primary-dim" href="#">
              ML Models
            </a>
            <a className="font-headline text-sm uppercase tracking-widest text-on-surface-variant transition-colors duration-100 hover:text-primary-dim" href="#">
              Datasets
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border border-outline-variant/30 bg-surface-container-highest px-3 py-1">
            <span className="material-symbols-outlined text-sm text-primary">terminal</span>
            <span className="font-mono text-xs text-primary-dim">SESSION_ACTIVE: OP_CODE_LAB</span>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined cursor-pointer text-on-surface-variant transition-colors hover:text-primary">
              notifications
            </span>
            <span className="material-symbols-outlined cursor-pointer text-on-surface-variant transition-colors hover:text-primary">
              settings
            </span>
          </div>
          <img
            alt="Operator"
            className="h-8 w-8 rounded-none border border-primary shadow-[0_0_10px_rgba(105,246,184,0.3)]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUFcKpqwB8awhiuFQwsduhWS1Oko52pnLFD8u2ZhhaQnuweEVLUN1prmxCP1P4WObugsS2Sx9YPi7V3Fno8HMuUWSlHG1waHqX1rbR_gO-DrnHCohb4zOhGK0Xxq1hJaZOO6S831bwEeRgsXCWb6JPs76Cj0MSXPhEyoaQC66FfJ_JT1N2nu98Xst_E3OOcbrh2_YAvl4r0lshTHhZVMDdvBA5joOB87o_T3wARbqczfIe0Fn-EXl7p8Bqr8piodEAgrU3bUEKFEo"
          />
        </div>
      </nav>

      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-primary/30 bg-[#0c1326]/70 px-4 pb-8 pt-20 backdrop-blur-lg md:flex">
        <div className="mb-8 px-2">
          <div className="font-headline text-lg font-black text-primary">OPERATOR_01</div>
          <div className="font-mono text-xs uppercase tracking-widest text-on-surface-variant">Level 42 Architect</div>
        </div>
        <nav className="flex-1 space-y-2">
          <a className="group flex items-center gap-3 px-3 py-3 text-on-surface-variant transition-all duration-75 hover:bg-primary/10" href="#">
            <span className="material-symbols-outlined group-hover:text-primary">psychology</span>
            <span className="font-headline font-bold">Neural Hub</span>
          </a>
          <a className="flex items-center gap-3 border-r-4 border-primary bg-primary/20 px-3 py-3 text-primary transition-all duration-75" href="#">
            <span className="material-symbols-outlined">model_training</span>
            <span className="font-headline font-bold">ML Models</span>
          </a>
          <a className="group flex items-center gap-3 px-3 py-3 text-on-surface-variant transition-all duration-75 hover:bg-primary/10" href="#">
            <span className="material-symbols-outlined group-hover:text-primary">database</span>
            <span className="font-headline font-bold">Datasets</span>
          </a>
          <a className="group flex items-center gap-3 px-3 py-3 text-on-surface-variant transition-all duration-75 hover:bg-primary/10" href="#">
            <span className="material-symbols-outlined group-hover:text-primary">history_edu</span>
            <span className="font-headline font-bold">Logs</span>
          </a>
          <a className="group flex items-center gap-3 px-3 py-3 text-on-surface-variant transition-all duration-75 hover:bg-primary/10" href="#">
            <span className="material-symbols-outlined group-hover:text-primary">terminal</span>
            <span className="font-headline font-bold">Terminal</span>
          </a>
        </nav>
        <div className="mt-auto space-y-2 border-t border-outline-variant/30 pt-4">
          <button className="w-full bg-primary py-3 font-headline font-bold uppercase tracking-tighter text-on-primary transition-all hover:shadow-[0_0_15px_rgba(105,246,184,0.4)]">
            DEPLOY MODEL
          </button>
          <div className="mt-4 flex flex-col gap-1">
            <a className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant transition-colors hover:text-primary" href="#">
              <span className="material-symbols-outlined text-sm">settings_input_component</span>
              <span>System Health</span>
            </a>
            <a className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant transition-colors hover:text-error" href="#">
              <span className="material-symbols-outlined text-sm">logout</span>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </aside>

      <main className="min-h-screen bg-surface pt-16 md:pl-64">
        <div className="grid grid-cols-12 gap-6 p-6 lg:p-8">
          <header className="col-span-12 mb-4">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="font-headline text-4xl font-black uppercase tracking-tighter text-on-surface">
                  Learning Hub <span className="text-primary">&amp;</span> Code Lab
                </h1>
                <p className="mt-2 font-mono text-sm text-secondary-dim">
                  ACCESS_LEVEL: RESTRICTED // SUBJECT: NEURAL_NETWORK_SYNTHESIS
                </p>
              </div>
              <div className="hidden gap-4 lg:flex">
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[10px] uppercase text-on-surface-variant">Mission Progress</span>
                  <div className="mt-1 flex gap-1">
                    <div className="h-1.5 w-3 bg-secondary" />
                    <div className="h-1.5 w-3 bg-secondary" />
                    <div className="h-1.5 w-3 bg-secondary" />
                    <div className="h-1.5 w-3 bg-surface-container-highest" />
                    <div className="h-1.5 w-3 bg-surface-container-highest" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="col-span-12 space-y-6 lg:col-span-4">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-4 w-2 bg-primary" />
              <h2 className="font-headline font-bold uppercase tracking-widest text-on-surface-variant">Active Missions</h2>
            </div>

            <div className="corner-bracket group relative cursor-pointer overflow-hidden border-l-4 border-primary bg-surface-container-low p-5 transition-colors hover:bg-surface-container-high">
              <div className="absolute right-0 top-0 h-12 w-12 -translate-y-6 translate-x-6 -rotate-45 bg-primary/5" />
              <div className="mb-4 flex items-start justify-between">
                <span className="bg-primary/10 px-2 py-0.5 font-mono text-[10px] text-primary">MSN_082</span>
                <span className="material-symbols-outlined text-xl text-primary">lock_open</span>
              </div>
              <h3 className="mb-2 font-headline text-lg font-bold transition-colors group-hover:text-primary">
                TENSOR_FLOW_OPTIMIZATION
              </h3>
              <p className="mb-6 text-sm text-on-surface-variant">
                Refine neural weights in a multi-layered perceptron environment. Critical for model stability.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center border border-primary bg-surface-container-highest font-mono text-[8px]">
                    01
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center border border-primary bg-surface-container-highest font-mono text-[8px]">
                    02
                  </div>
                  <div className="flex h-6 w-6 items-center justify-center border border-outline-variant bg-surface-dim font-mono text-[8px] text-outline">
                    03
                  </div>
                </div>
                <span className="font-mono text-[10px] text-secondary-dim">REWARD: +500XP</span>
              </div>
            </div>

            <div className="cursor-pointer border-l-4 border-outline-variant/30 bg-surface-container-low p-5 grayscale transition-colors hover:bg-surface-container-high hover:grayscale-0">
              <div className="mb-4 flex items-start justify-between">
                <span className="bg-surface-container-highest px-2 py-0.5 font-mono text-[10px] text-on-surface-variant">
                  MSN_085
                </span>
                <span className="material-symbols-outlined text-xl text-outline">lock</span>
              </div>
              <h3 className="mb-2 font-headline text-lg font-bold">GPT_KERNEL_INJECTION</h3>
              <p className="mb-6 text-sm text-on-surface-variant">
                Analyze transformer attention maps to isolate heuristic hallucinations in real-time.
              </p>
              <div className="flex items-center justify-between opacity-50">
                <div className="flex -space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center border border-outline-variant bg-surface-dim font-mono text-[8px]">
                    ??
                  </div>
                </div>
                <span className="font-mono text-[10px]">LOCKED_BY_LVL_45</span>
              </div>
            </div>

            <div className="relative border border-outline-variant/10 bg-surface-container-highest p-6">
              <div className="absolute right-2 top-2 font-mono text-[8px] text-primary/40">SYSTEM_DIAGNOSTIC</div>
              <h4 className="mb-4 font-headline text-xs font-bold uppercase text-on-surface-variant">Cognitive Sync Rate</h4>
              <div className="mb-2 flex gap-1">
                <div className="h-2 flex-1 bg-primary" />
                <div className="h-2 flex-1 bg-primary" />
                <div className="h-2 flex-1 bg-primary" />
                <div className="h-2 flex-1 bg-primary" />
                <div className="h-2 flex-1 bg-primary/20" />
              </div>
              <div className="flex justify-between font-mono text-[10px]">
                <span className="text-primary">82% OPTIMIZED</span>
                <span className="text-on-surface-variant">SYNC_STABLE</span>
              </div>
            </div>
          </section>

          <section className="relative col-span-12 flex h-[600px] flex-col overflow-hidden border border-outline-variant/20 bg-surface-container-low shadow-2xl lg:col-span-8">
            <div className="flex h-10 items-center justify-between border-b border-outline-variant/30 bg-surface-container-highest px-4">
              <div className="flex h-full items-center gap-6">
                <div className="flex h-full items-center gap-2 border-b-2 border-primary px-2">
                  <span className="material-symbols-outlined text-sm text-primary">terminal</span>
                  <span className="font-mono text-xs text-on-surface">neural_synthesis.py</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <span className="font-mono text-xs">config.json</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary">play_arrow</button>
                <button className="material-symbols-outlined text-sm text-on-surface-variant hover:text-primary">save</button>
              </div>
            </div>

            <div className="emerald-night-scroll flex flex-1 overflow-y-auto font-mono text-sm">
              <div className="w-12 select-none border-r border-outline-variant/10 bg-surface-container-lowest py-4 pr-3 text-right text-outline-variant">
                1
                <br />
                2
                <br />
                3
                <br />
                4
                <br />
                5
                <br />
                6
                <br />
                7
                <br />
                8
                <br />
                9
                <br />
                10
                <br />
                11
                <br />
                12
                <br />
                13
                <br />
                14
                <br />
                15
                <br />
                16
                <br />
                17
                <br />
                18
              </div>
              <div className="relative flex-1 bg-surface-container-lowest/50 p-4">
                <div className="mb-2 italic text-[#888]"># OPERATOR_COMMAND: INITIATE_LAYER_NORMALIZATION</div>
                <div className="mb-1">
                  <span className="text-primary-dim">import</span> neuroflow <span className="text-primary-dim">as</span> nf
                </div>
                <div className="mb-1">
                  <span className="text-primary-dim">from</span> synapse <span className="text-primary-dim">import</span> WeightMatrix, Node
                </div>
                <div className="mb-4" />
                <div className="mb-1">
                  <span className="text-secondary-dim">def</span> <span className="text-primary">synthesize_layer</span>(inputs, weights):
                </div>
                <div className="mb-1 ml-4">
                  <span className="text-on-surface-variant">"""Calibrates nodal thresholds for tactical inference"""</span>
                </div>
                <div className="mb-1 ml-4">
                  layer = nf.<span className="text-tertiary">Dense</span>(
                </div>
                <div className="mb-1 ml-8">
                  units=<span className="text-secondary">512</span>,
                </div>
                <div className="mb-1 ml-8">
                  activation=<span className="text-on-tertiary-container">&apos;relu&apos;</span>,
                </div>
                <div className="mb-1 ml-8">
                  kernel_initializer=<span className="text-on-tertiary-container">&apos;glorot_uniform&apos;</span>
                </div>
                <div className="mb-1 ml-4">)</div>
                <div className="mb-1 ml-4">
                  <span className="text-primary-dim">return</span> layer.<span className="text-tertiary">execute</span>(inputs, weights)
                </div>
                <div className="mb-4" />
                <div className="mb-1 text-[#888]"># TODO: Implement backprop delta compression</div>
                <div className="mb-1">
                  node_cluster = WeightMatrix(<span className="text-secondary">0x4F2A</span>)
                </div>
                <div className="mb-1">
                  <span className="text-primary">print</span>(<span className="text-on-tertiary-container">&quot;SYNCING_NODES...&quot;</span>)
                </div>
                <div className="ml-1 inline-block h-5 w-2 align-middle bg-primary/50" />
              </div>
            </div>

            <div className="flex h-8 items-center justify-between border-t border-outline-variant/30 bg-surface-container-low px-4">
              <div className="flex gap-6">
                <span className="font-mono text-[10px] uppercase text-on-surface-variant">Line 18, Col 24</span>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant">UTF-8</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 font-mono text-[10px] uppercase text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  SYSTEM_LIVE
                </span>
                <span className="font-mono text-[10px] uppercase text-on-surface-variant">Python 3.11-Tactical</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-[60] flex h-[400px] w-80 flex-col border border-primary/40 bg-surface-container-low shadow-[0_0_30px_rgba(105,246,184,0.15)]">
        <div className="flex items-center justify-between border-b border-primary/30 bg-primary/10 p-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">support_agent</span>
            <span className="font-headline text-xs font-bold uppercase tracking-tighter text-primary">AI Tactical Comms</span>
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="material-symbols-outlined cursor-pointer text-xs text-on-surface-variant">close</span>
          </div>
        </div>
        <div className="emerald-night-scroll flex-1 space-y-4 overflow-y-auto p-4 font-mono text-[11px]">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-primary/60">SYN_INTEL // 09:42:11</span>
            <div className="border-l-2 border-primary/50 bg-primary/5 p-2 text-primary">
              Warning: Neural weight deviation detected in MSN_082. Recommend increasing learning rate by 0.05.
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] text-on-surface-variant">OPERATOR // 09:42:25</span>
            <div className="max-w-[90%] border-r-2 border-outline-variant/50 bg-surface-container-highest p-2 text-on-surface">
              Adjusting hyperparameters now. Checking for gradient explosion.
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-primary/60">SYN_INTEL // 09:43:02</span>
            <div className="border-l-2 border-primary/50 bg-primary/5 p-2 text-primary">
              Gradient stable. Validation accuracy increased to 92.4%. Mission MSN_082 milestone reached.
            </div>
          </div>
          <div className="flex animate-pulse items-center gap-1 text-primary">
            <span className="h-1.5 w-1.5 bg-primary" />
            <span>NEURAL_ENGINE_PROCESSING...</span>
          </div>
        </div>
        <div className="border-t border-primary/20 bg-surface-container-lowest p-3">
          <div className="flex items-center gap-2 border-b border-primary/40 pb-1">
            <span className="font-mono text-xs text-primary">&gt;</span>
            <input
              className="w-full border-none bg-transparent font-mono text-xs text-primary placeholder:text-primary/30 focus:ring-0"
              placeholder="AWAITING_INPUT..."
              type="text"
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed right-0 top-0 h-screen w-1/3 opacity-10">
        <img
          className="h-full w-full object-cover grayscale mix-blend-screen"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_rTM6IExULIZft6_1sAMgkxigfJFHOpqCx5d9SKtJPYlRwonoCPbtwFOGe5b4d0g1rh0xoY3HWcB-WZBGnLeYSqV-jdQouUJZHkd8VMcJjFNT4QWRFwbBCFY4GwLs7yxTFUMEe6m1ryrgeQPsQbhyY-cPj_rnY1G4OemYMhwlzyUZKGUaepgf5DdfCJvxDwcFOT_5GgMODh31b_Aa9f7wLtYDT3h5pf1RnA0bjSlcOIBB45BqbltSM-Du7cfW5sz76nS0wdHbzT4"
          alt="Abstract visualization of complex data networks and cascading code fragments in a deep void with emerald highlights"
        />
      </div>
    </>
  );
}

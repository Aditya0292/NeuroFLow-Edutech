import Navbar from "@/components/Navbar";
import HeroContent from "@/components/HeroContent";
import AccessTerminal from "@/components/AccessTerminal";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      {/* CRT scanline overlay */}
      <div className="scanlines" />

      <Navbar />

      <main className="min-h-screen pt-16 relative">
        {/* Hero background radial glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
        </div>

        {/* Hero section */}
        <div className="relative z-10 container mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
          <HeroContent />
          <AccessTerminal />
        </div>
      </main>

      <Footer />

      {/* Side decorations */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 h-64 w-1 bg-primary/20" />
      <div className="fixed right-2 top-1/2 -translate-y-1/2 h-48 w-px bg-primary/40" />
    </>
  );
}

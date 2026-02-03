import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { MANIFESTO_TEXT } from '../constants';
import { IconArrowRight } from '../components/Icons';

const Landing: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const reveal = (delay: string) => `reveal ${isReady ? 'reveal-active' : ''} ${delay}`;

  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 md:pt-20 overflow-x-hidden selection:bg-[#00FFD1] selection:text-black">
      {/* Landing Header matches App Header logic but standalone for aesthetic control */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 md:px-12 h-16 md:h-24 flex justify-between items-center bg-black/40 backdrop-blur-3xl border-b border-white/5">
        <div className={`syne text-xl md:text-3xl tracking-tighter text-white ${reveal('delay-[100ms]')}`}>MADE</div>
        <div className={`flex gap-5 md:gap-12 items-center ${reveal('delay-[200ms]')}`}>
          <Link to="/login" className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/30 hover:text-white transition-all">Login</Link>
          <Link to="/onboarding" className="px-5 md:px-7 py-2 md:py-2.5 bg-[#00FFD1] text-black rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,209,0.2)]">Join MADE</Link>
        </div>
      </header>

      {/* Hero: The Statement */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-5 md:px-6 pt-24 md:pt-32 pb-24 md:pb-48 relative z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className={`${reveal('delay-[300ms]')} syne leading-[0.82] tracking-tighter uppercase mb-8 md:mb-16 select-none`}>
            PROOF OVER<br/><span className="text-white/10 italic">TITLES.</span>
          </h1>
          
          <div className={`${reveal('delay-[450ms]')} max-w-4xl mx-auto space-y-5 md:space-y-10 mb-12 md:mb-24`}>
            <p className="text-xl md:text-5xl text-white/40 leading-tight md:leading-[1.15] font-medium tracking-tight px-4 sm:px-0">
              The elite network for people who <br className="hidden md:block"/> actually <span className="text-white">build things.</span>
            </p>
            <p className="serif-italic text-2xl md:text-5xl text-white/20">
              No bios. No resumes. Just work.
            </p>
          </div>
          
          <div className={`${reveal('delay-[600ms]')} flex flex-col sm:flex-row gap-4 md:gap-8 justify-center items-center px-4 sm:px-0`}>
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" variant="hyper" className="w-full sm:w-auto !rounded-full !px-10 md:!px-24 !py-5 md:!py-10 !text-base md:!text-xl group">
                Join Now <IconArrowRight className="ml-3 md:ml-5 w-5 h-5 md:w-7 md:h-7 group-hover:translate-x-3 transition-transform duration-500"/>
              </Button>
            </Link>
            <Link to="/feed" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto !rounded-full !px-10 md:!px-24 !py-5 md:!py-10 !text-base md:!text-xl !border-white/10 hover:!bg-white/5 transition-all">
                View Work
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <div className="separator" />

      {/* Manifesto: The Filter */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
        <div className="p-10 md:p-32 space-y-12 md:space-y-24 bg-black relative group overflow-hidden">
          <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/[0.02] transition-colors duration-1000" />
          <div className="flex items-center gap-4 md:gap-6 relative z-10">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
            <h2 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-red-500/40">WE_REJECT</h2>
          </div>
          <div className="space-y-6 md:space-y-14 relative z-10">
            {MANIFESTO_TEXT.rejection.map((item, i) => (
              <div key={i} className="group/item cursor-default">
                <div className="syne text-2xl md:text-7xl text-white/10 group-hover/item:text-white group-hover/item:translate-x-3 md:group-hover/item:translate-x-6 transition-all duration-1000 leading-none">
                   {item}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-10 md:p-32 space-y-12 md:space-y-24 bg-black relative group overflow-hidden">
          <div className="absolute inset-0 bg-[#00FFD1]/0 group-hover:bg-[#00FFD1]/[0.02] transition-colors duration-1000" />
          <div className="flex items-center gap-4 md:gap-6 relative z-10">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-[#00FFD1] rounded-full shadow-[0_0_15px_rgba(0,255,209,0.5)]" />
            <h2 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-[#00FFD1]/40">WE_ENFORCE</h2>
          </div>
          <div className="space-y-6 md:space-y-14 relative z-10">
            {MANIFESTO_TEXT.enforcement.map((item, i) => (
              <div key={i} className="group/item cursor-default">
                <div className="syne text-2xl md:text-7xl text-white group-hover/item:text-[#00FFD1] group-hover/item:translate-x-3 md:group-hover/item:translate-x-6 transition-all duration-1000 leading-none">
                   {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer: The Anchor */}
      <footer className="px-6 md:px-12 py-16 md:py-32 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-24 bg-black">
        <div className="space-y-4 md:space-y-6 text-center md:text-left">
          <div className="syne text-2xl md:text-4xl text-white">MADE.</div>
          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[0.7em] text-white/10">PROOF_PROTOCOL_V1_2026</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-24">
          <Link to="/login" className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/20 hover:text-white transition-colors">Login</Link>
          <Link to="/feed" className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/20 hover:text-white transition-colors">Arena</Link>
          <a href="#" className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/20 hover:text-white transition-colors">Privacy</a>
        </div>
        
        <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[0.7em] text-white/5 block text-center md:text-right max-w-xs leading-loose">
          MADE IS A NON-IDENTITY PROFESSIONAL GRAPH ENFORCING RADICAL MERITOCRACY.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
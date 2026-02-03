import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { MANIFESTO_TEXT } from '../constants';
import { IconArrowRight } from '../components/Icons';

const Landing: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const reveal = (delay: string) => `reveal ${isReady ? 'reveal-active' : ''} ${delay}`;

  return (
    <div className="min-h-screen bg-black flex flex-col pt-16 md:pt-20 overflow-x-hidden selection:bg-[#00FFD1] selection:text-black">
      {/* Landing Header */}
      <header className="fixed top-0 left-0 right-0 z-50 adaptive-padding h-16 md:h-24 flex justify-between items-center bg-black/60 backdrop-blur-3xl border-b border-white/5">
        <div className={`syne text-step-0 md:text-step-2 tracking-tighter text-white ${reveal('delay-100')}`}>MADE</div>
        <div className={`flex gap-4 md:gap-10 items-center ${reveal('delay-200')}`}>
          <Link to="/login" className="text-step--2 md:text-step--1 font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all">Login</Link>
          <Link to="/onboarding" className="px-5 md:px-8 py-2 md:py-3 bg-[#00FFD1] text-black rounded-full text-step--2 md:text-step--1 font-black uppercase tracking-[0.1em] hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,209,0.2)]">Join</Link>
        </div>
      </header>

      {/* Hero: The Statement */}
      <main className="flex-1 flex flex-col items-center justify-center text-center adaptive-padding pt-32 md:pt-48 pb-24 md:pb-64 relative z-10">
        <div className="max-w-[1440px] mx-auto w-full">
          <h1 className={`${reveal('delay-300')} text-display-xl syne uppercase mb-8 md:mb-16 select-none`}>
            PROOF OVER<br/><span className="text-white/10 italic">TITLES.</span>
          </h1>
          
          <div className={`${reveal('delay-500')} max-w-5xl mx-auto space-y-6 md:space-y-12 mb-16 md:mb-24`}>
            <p className="text-step-1 md:text-step-4 text-white/40 leading-tight font-medium tracking-tight px-4 sm:px-0">
              The elite network for people who <br className="hidden md:block"/> actually <span className="text-white">build things.</span>
            </p>
            <p className="serif-italic text-step-0 md:text-step-2 text-white/20">
              No bios. No resumes. Just work.
            </p>
          </div>
          
          <div className={`${reveal('delay-700')} flex flex-col sm:flex-row gap-5 md:gap-10 justify-center items-center`}>
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button size="lg" variant="hyper" className="w-full sm:w-auto !rounded-full group">
                Join Now <IconArrowRight className="ml-3 md:ml-5 w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-3 transition-transform duration-500"/>
              </Button>
            </Link>
            <Link to="/feed" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto !rounded-full !border-white/10 hover:!bg-white/5 transition-all">
                View Arena
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Manifesto: Responsive Split Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 border-t border-white/5">
        <div className="p-10 md:p-20 lg:p-32 space-y-12 md:space-y-20 bg-black relative group overflow-hidden">
          <div className="absolute inset-0 bg-red-500/[0.01] group-hover:bg-red-500/[0.03] transition-colors duration-1000" />
          <div className="flex items-center gap-4 md:gap-8 relative z-10">
            <div className="w-2 md:w-3 h-2 md:h-3 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
            <h2 className="text-step--2 md:text-step--1 font-black uppercase tracking-[0.5em] text-red-500/40">REJECT</h2>
          </div>
          <div className="space-y-6 md:space-y-10 relative z-10">
            {MANIFESTO_TEXT.rejection.map((item, i) => (
              <div key={i} className="group/item cursor-default">
                <div className="syne text-step-2 md:text-step-5 lg:text-[clamp(2.5rem,7vw,6rem)] text-white/10 group-hover/item:text-white group-hover/item:translate-x-4 transition-all duration-1000 leading-none">
                   {item}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-10 md:p-20 lg:p-32 space-y-12 md:space-y-20 bg-black relative group overflow-hidden border-t lg:border-t-0 lg:border-l border-white/5">
          <div className="absolute inset-0 bg-[#00FFD1]/[0.01] group-hover:bg-[#00FFD1]/[0.03] transition-colors duration-1000" />
          <div className="flex items-center gap-4 md:gap-8 relative z-10">
            <div className="w-2 md:w-3 h-2 md:h-3 bg-[#00FFD1] rounded-full shadow-[0_0_20px_rgba(0,255,209,0.5)]" />
            <h2 className="text-step--2 md:text-step--1 font-black uppercase tracking-[0.5em] text-[#00FFD1]/40">ENFORCE</h2>
          </div>
          <div className="space-y-6 md:space-y-10 relative z-10">
            {MANIFESTO_TEXT.enforcement.map((item, i) => (
              <div key={i} className="group/item cursor-default">
                <div className="syne text-step-2 md:text-step-5 lg:text-[clamp(2.5rem,7vw,6rem)] text-white group-hover/item:text-[#00FFD1] group-hover/item:translate-x-4 transition-all duration-1000 leading-none">
                   {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsive Footer */}
      <footer className="adaptive-padding py-24 md:py-40 border-t border-white/5 flex flex-col md:flex-row justify-between items-center adaptive-gap bg-black">
        <div className="space-y-4 md:space-y-6 text-center md:text-left">
          <div className="syne text-step-2 md:text-step-4 text-white">MADE.</div>
          <p className="text-step--2 font-black uppercase tracking-[0.5em] text-white/10">PROTOCOL_V1_2026</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-20">
          <Link to="/login" className="text-step--2 md:text-step--1 font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">Login</Link>
          <Link to="/feed" className="text-step--2 md:text-step--1 font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">Arena</Link>
          <a href="#" className="text-step--2 md:text-step--1 font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors">Privacy</a>
        </div>
        
        <div className="text-step--2 font-black uppercase tracking-[0.4em] text-white/5 block text-center md:text-right max-w-[20rem] leading-loose">
          MADE IS A NON-IDENTITY PROFESSIONAL GRAPH ENFORCING RADICAL MERITOCRACY.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
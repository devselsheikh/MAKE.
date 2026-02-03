import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Project, User, Track } from '../types';
import { calculateSignalScore } from '../utils/signalScore';
import { Button } from '../components/Button';
import { SignalGauge } from '../components/SignalGauge';
import { TRACKS } from '../constants';

interface FeedProps {
  projects: Project[];
  user: User | null;
  onLogout: () => void;
}

const Feed: React.FC<FeedProps> = ({ projects, user, onLogout }) => {
  const [activeTrack, setActiveTrack] = useState<Track | 'All'>('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => !p.isSpotlight);
    if (activeTrack !== 'All') {
      result = result.filter(p => p.userTrack === activeTrack);
    }
    return result;
  }, [projects, activeTrack]);

  return (
    <div className="min-h-screen bg-black pt-24 md:pt-40 pb-40 md:pb-64 selection:bg-[#00FFD1] selection:text-black">
      <Header userId={user?.id} onLogout={onLogout} />
      
      <div className="max-w-[1920px] mx-auto adaptive-padding">
        <header className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-10 md:gap-16 mb-20 md:mb-32 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="space-y-4 md:space-y-8">
            <h1 className="syne text-display-lg leading-none tracking-tighter">ARENA.</h1>
            <p className="text-step-0 md:text-step-2 text-white/40 font-medium tracking-tight">Validated architectural artifacts.</p>
          </div>
          {user && (
            <Link to={`/profile/${user.id}`} className="w-full md:w-auto">
              <Button variant="hyper" className="w-full md:w-auto !rounded-full !py-5 md:!py-6">Transmit Proof</Button>
            </Link>
          )}
        </header>

        {/* Dynamic Category Scroller */}
        <div className={`relative mb-16 md:mb-24 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex overflow-x-auto gap-3 md:gap-6 pb-6 scrollbar-hide border-b border-white/5 scroll-fade-right">
            <button 
              onClick={() => setActiveTrack('All')}
              className={`px-8 md:px-12 py-3 md:py-5 rounded-full text-step--2 md:text-step--1 font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTrack === 'All' ? 'bg-white text-black' : 'bg-white/5 text-white/30 hover:text-white'}`}
            >
              All Signals
            </button>
            {TRACKS.map(t => (
              <button 
                key={t.value}
                onClick={() => setActiveTrack(t.value as Track)}
                className={`px-8 md:px-12 py-3 md:py-5 rounded-full text-step--2 md:text-step--1 font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${activeTrack === t.value ? 'bg-white text-black' : 'bg-white/5 text-white/30 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fluid Grid Layout: Optimized for Mobile up to 4K */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          {filteredProjects.map((project, idx) => (
            <Link 
              to={`/project/${project.id}`} 
              key={project.id} 
              className={`group transition-all duration-1000 h-full`}
              style={{ transitionDelay: `${idx * 100}ms`, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}
            >
              <div className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] hover:bg-white/[0.04] hover:scale-[1.02] transition-all duration-700 h-full flex flex-col justify-between group-active:scale-[0.98]">
                <div className="space-y-8 md:space-y-12">
                  <div className="flex justify-between items-start">
                    <span className="text-step--2 font-black text-[#00FFD1] uppercase tracking-[0.4em]">{project.userTrack}</span>
                    <SignalGauge score={calculateSignalScore({ id: project.userId }, projects)} size="sm" />
                  </div>
                  <h3 className="syne text-step-1 md:text-step-3 group-hover:text-[#00FFD1] transition-colors duration-700 leading-tight tracking-tighter">{project.title}</h3>
                  <p className="text-step--1 md:text-step-0 text-white/30 line-clamp-3 leading-relaxed font-medium group-hover:text-white/50 transition-colors duration-700">
                    {project.problem}
                  </p>
                </div>

                <div className="pt-8 md:pt-12 flex justify-between items-center border-t border-white/5 mt-10 md:mt-16">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-step--2 font-black uppercase text-white/40">
                      {project.userName.charAt(0)}
                    </div>
                    <span className="text-step--1 font-bold text-white/50 group-hover:text-white transition-colors">{project.userName}</span>
                  </div>
                  <span className="text-step--2 font-black text-white/20 uppercase tracking-[0.2em]">{project.comments.length} AUDITS</span>
                </div>
              </div>
            </Link>
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-48 md:py-64 text-center space-y-8 animate-reveal">
              <h4 className="syne text-step-5 lg:text-[10rem] text-white/5">VACUUM.</h4>
              <p className="text-white/20 text-step-1 md:text-step-3 font-medium tracking-tight">No signals detected in this sector.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
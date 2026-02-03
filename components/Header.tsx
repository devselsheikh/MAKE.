import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { db } from '../db';

export const Header: React.FC<{ userId?: string; onLogout?: () => void }> = ({ userId, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutAction = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  const navItem = (path: string, label: string) => {
    const isActive = location.pathname === path;
    return (
      <Link to={path} className={`text-step--2 md:text-step--1 font-black uppercase tracking-[0.2em] transition-all duration-300 ${isActive ? 'text-[#00FFD1]' : 'text-white/30 hover:text-white'}`}>
        {label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/60 backdrop-blur-3xl border-b border-white/5 h-16 md:h-24">
      <div className="max-w-[1440px] mx-auto adaptive-padding h-full flex justify-between items-center">
        <Link to="/" className="syne text-step-1 md:text-step-3 tracking-tighter text-white hover:opacity-70 transition-opacity">MADE</Link>
        
        <nav className="flex items-center gap-4 md:gap-12">
          {userId ? (
            <>
              {navItem('/feed', 'Arena')}
              {navItem(`/profile/${userId}`, 'Profile')}
              <button onClick={handleLogoutAction} className="text-step--2 md:text-step--1 font-black uppercase tracking-[0.2em] text-red-500/60 hover:text-red-500 transition-all">
                Exit
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-step--2 md:text-step--1 font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-all">Login</Link>
              <Link to="/onboarding" className="px-5 md:px-8 py-2 md:py-3 bg-[#00FFD1] text-black rounded-full text-step--2 md:text-step--1 font-black uppercase tracking-[0.1em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,209,0.2)]">Join</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
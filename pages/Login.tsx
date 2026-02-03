import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { User, Track } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email === 'shehabdiaa12345@gmail.com' && password === 'BREAD3184_') {
      const adminUser: User = {
        id: 'admin-made',
        name: 'System Admin',
        track: Track.OTHER,
        sessionPrice: 0,
        microContracts: [],
        sessionsCompleted: 0,
        projects: [],
        isVerified: true,
        isAdmin: true
      };
      onLogin(adminUser);
      navigate('/admin');
      return;
    }

    const saved = localStorage.getItem('made_user');
    if (saved) {
      onLogin(JSON.parse(saved));
      navigate('/feed');
    } else {
      const mockUser: User = {
        id: 'mock-user-' + Math.random().toString(36).substr(2, 5),
        name: email.split('@')[0] || 'Member',
        track: Track.ENGINEER,
        sessionPrice: 25,
        microContracts: [],
        sessionsCompleted: 1,
        projects: [],
        isVerified: true
      };
      onLogin(mockUser);
      navigate('/feed');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center adaptive-padding selection:bg-[#007AFF]">
      <div className="max-w-xl w-full space-y-16 md:space-y-24 animate-reveal reveal-active">
        <div className="text-center space-y-6">
          <h1 className="syne text-display-lg md:text-display-xl tracking-tighter leading-none">MADE.</h1>
          <p className="text-step--2 uppercase tracking-[0.6em] opacity-30 font-black">Proof of existence required.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-12 md:space-y-16 glass p-10 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_60px_100px_rgba(0,0,0,0.8)] border-white/5">
          <div className="space-y-4 md:space-y-6">
            <label className="block text-step--2 uppercase font-black tracking-[0.4em] opacity-30">Identity URI</label>
            <input 
              type="email"
              required
              className="w-full bg-transparent border-b border-white/20 py-4 md:py-6 text-step-1 md:text-step-2 outline-none focus:border-[#007AFF] transition-all font-bold tracking-tight"
              placeholder="id@entity.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-4 md:space-y-6">
            <label className="block text-step--2 uppercase font-black tracking-[0.4em] opacity-30">Auth Token</label>
            <input 
              type="password"
              className="w-full bg-transparent border-b border-white/20 py-4 md:py-6 text-step-1 md:text-step-2 outline-none focus:border-[#007AFF] transition-all font-bold tracking-tight"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-step--2 uppercase font-black tracking-widest text-center">{error}</p>}

          <Button type="submit" fullWidth size="lg" className="!py-6 md:!py-8 !rounded-full">Sync Graph</Button>
        </form>

        <p className="text-center text-step--2 uppercase tracking-[0.4em] font-black opacity-30">
          Unregistered? <Link to="/onboarding" className="text-white hover:text-[#00FFD1] transition-colors border-b border-white/10 hover:border-[#00FFD1]">Enter Graph</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
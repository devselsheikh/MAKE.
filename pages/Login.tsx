
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

    // Check for Admin Credentials
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

    // Standard User Logic (Simulated for MVP)
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
    <div className="min-h-screen bg-black flex items-center justify-center p-6 selection:bg-[#007AFF]">
      <div className="max-w-md w-full space-y-12 animate-in">
        <div className="text-center">
          <h1 className="grotesk text-6xl tracking-tighter mb-4">MADE</h1>
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-40 font-black">Proof of work required.</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-8 bg-white/[0.02] border border-white/10 p-12">
          <div className="space-y-4">
            <label className="block text-[10px] uppercase font-black tracking-widest opacity-40">Email Address</label>
            <input 
              type="email"
              required
              className="w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#007AFF] transition-colors font-black tracking-tight"
              placeholder="you@university.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] uppercase font-black tracking-widest opacity-40">Security Key</label>
            <input 
              type="password"
              className="w-full bg-transparent border-b border-white/20 py-4 text-xl outline-none focus:border-[#007AFF] transition-colors font-black tracking-tight"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-[10px] uppercase font-black tracking-widest text-center">{error}</p>}

          <Button type="submit" fullWidth className="!py-6">Authorize Entry</Button>
        </form>

        <p className="text-center text-[10px] uppercase tracking-widest font-black opacity-40">
          First time? <Link to="/onboarding" className="text-white hover:text-[#007AFF] transition-colors underline decoration-2 underline-offset-4">Join the network</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

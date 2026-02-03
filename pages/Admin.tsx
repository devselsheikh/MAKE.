
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { User } from '../types';
import { db } from '../db';
import { GlassCard } from '../components/GlassCard';

interface AdminProps {
  user: User | null;
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [invites, setInvites] = useState<string[]>([]);
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      setInvites(db.getInvites());
    }
  }, [user, navigate]);

  const handleAddCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    const code = newCode.trim().toUpperCase();
    db.addInvite(code);
    setInvites(db.getInvites());
    setNewCode('');
  };

  const handleRemoveCode = (code: string) => {
    db.removeInvite(code);
    setInvites(db.getInvites());
  };

  if (!user || !user.isAdmin) return null;

  return (
    <div className="pt-32 pb-48 px-6 md:px-12 bg-black min-h-screen selection:bg-[#007AFF] font-mono">
      <Header userId={user.id} onLogout={onLogout} />

      <div className="max-w-6xl mx-auto space-y-32">
        <div className="space-y-6">
          <h1 className="grotesk text-8xl md:text-9xl tracking-tighter uppercase leading-none font-sans">COMMAND</h1>
          <div className="flex items-center gap-6">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.6em] text-[#007AFF] font-black font-sans">System Level: Gatekeeper Authorization Established</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <main className="lg:col-span-8 space-y-16">
            <div className="bg-white/5 border border-white/10 p-12 space-y-12">
              <div className="flex justify-between items-baseline border-b border-white/5 pb-8">
                <h2 className="text-[10px] uppercase tracking-[0.5em] font-black opacity-40">Invitation Registry</h2>
                <span className="text-[10px] opacity-20 tabular-nums">ACTIVE_KEYS: {invites.length}</span>
              </div>

              <form onSubmit={handleAddCode} className="flex gap-px bg-white/10 border border-white/10 p-1">
                <input 
                  className="flex-1 bg-black p-8 text-2xl outline-none focus:bg-white/[0.02] transition-all font-black tracking-[0.4em] uppercase"
                  placeholder="NEW_PAYLOAD_ID"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                />
                <Button type="submit" className="!px-16 !bg-[#007AFF] !text-white border-none font-sans">Deploy</Button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {invites.map(code => (
                  <div key={code} className="bg-white/[0.03] border border-white/10 p-8 flex justify-between items-center group hover:border-[#007AFF] transition-all">
                    <div className="space-y-1">
                      <span className="text-[10px] opacity-20 uppercase font-black tracking-widest block">KEY_SHA256</span>
                      <span className="text-xl font-black tracking-[0.4em]">{code}</span>
                    </div>
                    <button 
                      onClick={() => handleRemoveCode(code)}
                      className="p-4 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                      REVOKE
                    </button>
                  </div>
                ))}
              </div>

              {invites.length === 0 && (
                <p className="text-center text-xs opacity-20 uppercase tracking-widest font-black py-48 bg-white/[0.01]">Zero active entropy.</p>
              )}
            </div>
          </main>

          <aside className="lg:col-span-4 space-y-12">
             <section className="bg-white/5 border border-white/10 p-10 space-y-8">
                <h3 className="text-[10px] uppercase font-black tracking-[0.5em] opacity-40 border-b border-white/10 pb-6">System Logs</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-4 scrollbar-hide text-[9px] font-black uppercase tracking-widest opacity-30 leading-relaxed">
                   <div>[{new Date().toLocaleTimeString()}] Accessing Made_DB...</div>
                   <div>[{new Date().toLocaleTimeString()}] Fetching active invites...</div>
                   <div>[{new Date().toLocaleTimeString()}] Validating admin ID shehabdiaa12345...</div>
                   <div className="text-green-500">[{new Date().toLocaleTimeString()}] Success: Data synchronized.</div>
                   <div>[{new Date().toLocaleTimeString()}] Waiting for input...</div>
                </div>
             </section>

             <GlassCard hover={false} className="!p-10 !bg-red-500/5 border-red-500/20 text-red-500/50">
               <h4 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4">Critical Warning</h4>
               <p className="text-[9px] font-black uppercase leading-relaxed tracking-widest">
                 Revoking a key does not eject the existing entity, only blocks future initializations. Proceed with precision.
               </p>
             </GlassCard>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Admin;

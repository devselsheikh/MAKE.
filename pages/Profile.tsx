import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Project, User, MicroContract, ContractStatus, Conversation, Message } from '../types';
import { calculateSignalScore } from '../utils/signalScore';
import { GlassCard } from '../components/GlassCard';
import { SignalGauge } from '../components/SignalGauge';
import { IconVerified, IconArrowRight } from '../components/Icons';

interface ProfileProps {
  projects: Project[];
  contracts: MicroContract[];
  currentUser: User | null;
  conversations: Conversation[];
  onAddMicroContract: (contract: MicroContract) => void;
  onUpdateContract: (id: string, updates: Partial<MicroContract>) => void;
  onSendMessage: (toUserId: string, text: string) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ projects, contracts, currentUser, conversations, onAddMicroContract, onUpdateContract, onSendMessage, onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const [isAddingContract, setIsAddingContract] = useState(false);
  const [newContract, setNewContract] = useState({ title: '', description: '', price: 25, deliveryDays: 2 });
  const [bookingContractId, setBookingContractId] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [isDeliveringId, setIsDeliveringId] = useState<string | null>(null);
  const [chatText, setChatText] = useState('');

  const isOwnProfile = id === currentUser?.id;
  const userProjects = projects.filter(p => p.userId === id);
  const userContracts = contracts.filter(c => c.userId === id);
  
  const user = useMemo(() => {
    if (isOwnProfile) return currentUser;
    return {
      id: id || '',
      name: userProjects[0]?.userName || "Member Entity",
      track: userProjects[0]?.userTrack || "Creator",
      sessionPrice: 25,
      sessionsCompleted: 0,
      isVerified: userProjects.length >= 3,
      microContracts: userContracts
    } as User;
  }, [id, isOwnProfile, currentUser, userProjects, userContracts]);

  const signalScore = calculateSignalScore(user as User, projects);
  const hasCompletedSessionWithUser = contracts.some(c => 
    c.status === ContractStatus.COMPLETED && 
    ((c.userId === id && c.buyerId === currentUser?.id) || (c.userId === currentUser?.id && c.buyerId === id))
  );

  const activeConvId = [currentUser?.id || '', id || ''].sort().join('-');
  const conversation = conversations.find(c => c.id === activeConvId);

  const handleAddContract = () => {
    if (!currentUser) return;
    const contract: MicroContract = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      status: ContractStatus.AVAILABLE,
      ...newContract
    };
    onAddMicroContract(contract);
    setIsAddingContract(false);
  };

  const confirmBooking = () => {
    if (bookingContractId && currentUser) {
      onUpdateContract(bookingContractId, { 
        status: ContractStatus.ESCROW, 
        buyerId: currentUser.id,
        buyerName: currentUser.name 
      });
      setBookingContractId(null);
    }
  };

  const handleDeliver = (contractId: string) => {
    onUpdateContract(contractId, { 
        status: ContractStatus.DELIVERED, 
        deliveryNote: deliveryNote 
    });
    setIsDeliveringId(null);
    setDeliveryNote('');
  };

  const handleComplete = (contractId: string) => {
    onUpdateContract(contractId, { status: ContractStatus.COMPLETED });
  };

  const handleSendChat = () => {
    if (!chatText.trim() || !id) return;
    onSendMessage(id, chatText);
    setChatText('');
  };

  return (
    <div className="pt-20 md:pt-32 pb-32 md:pb-48 px-5 md:px-12 bg-black min-h-screen selection:bg-[#007AFF]">
      <Header userId={currentUser?.id} onLogout={onLogout} />
      
      {/* Transactional Modals - Full screen on Mobile */}
      {bookingContractId && (
          <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-0 md:p-6 backdrop-blur-md animate-in fade-in duration-300">
              <div className="h-full md:h-auto max-w-xl w-full border-none md:border border-white/10 p-10 md:p-16 space-y-10 md:space-y-12 bg-black shadow-[0_0_150px_rgba(0,122,255,0.15)] flex flex-col justify-center">
                  <div className="space-y-4">
                    <h2 className="syne text-4xl md:text-6xl tracking-tighter">Authorize Escrow</h2>
                    <p className="opacity-40 text-base md:text-lg leading-relaxed font-medium">Commit $ {contracts.find(c => c.id === bookingContractId)?.price} to the protocol vault.</p>
                  </div>
                  <div className="bg-white/5 p-8 md:p-10 space-y-6">
                      <div className="flex justify-between uppercase text-[10px] font-black font-mono">
                          <span className="opacity-40">Contract Payload</span>
                          <span>${contracts.find(c => c.id === bookingContractId)?.price}.00</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between uppercase text-[10px] font-black tracking-[0.2em] md:tracking-[0.4em] text-[#007AFF]">
                          <span>SIGNAL NETWORK FEE</span>
                          <span>WAVED (BETA)</span>
                      </div>
                  </div>
                  <div className="flex flex-col gap-5 md:gap-6">
                    <Button fullWidth size="lg" onClick={confirmBooking} className="!bg-[#007AFF] !text-white border-none py-6 md:py-8">Commit Funds</Button>
                    <button onClick={() => setBookingContractId(null)} className="text-[10px] uppercase font-black opacity-30 hover:opacity-100 transition-opacity tracking-[0.4em] py-4">Abort Protocol</button>
                  </div>
              </div>
          </div>
      )}

      {isDeliveringId && (
          <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-0 md:p-6 backdrop-blur-md animate-in fade-in duration-300">
              <div className="h-full md:h-auto max-w-xl w-full border-none md:border border-white/10 p-10 md:p-16 space-y-10 md:space-y-12 bg-black flex flex-col justify-center">
                  <h2 className="syne text-4xl md:text-6xl tracking-tighter uppercase">Deliver Proof</h2>
                  <p className="opacity-40 text-base md:text-lg font-medium">Transmit evidence of work to counterparty.</p>
                  <textarea 
                      className="w-full bg-white/5 border border-white/10 p-6 md:p-10 text-base md:text-lg outline-none h-48 md:h-64 focus:border-[#007AFF] transition-all"
                      placeholder="Artifact Link (GitHub, Figma, etc)..."
                      value={deliveryNote}
                      onChange={e => setDeliveryNote(e.target.value)}
                  />
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    <Button fullWidth size="lg" onClick={() => handleDeliver(isDeliveringId)} disabled={!deliveryNote.trim()} className="!bg-[#007AFF] !text-white !py-6 md:!py-8">Transmit Package</Button>
                    <Button variant="ghost" onClick={() => setIsDeliveringId(null)} className="!py-6">Cancel</Button>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Profile Hero Section */}
        <section className="mb-16 md:mb-48 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start pb-12 md:pb-24 border-b border-white/5">
          <div className="lg:col-span-8 space-y-6 md:space-y-12">
            <div className="flex flex-wrap items-center gap-2.5 md:gap-6">
              <div className="px-3 md:px-4 py-1.5 md:py-2 bg-[#007AFF]/5 border border-[#007AFF]/20 text-[#007AFF] text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
                  {user?.track}
              </div>
              {user?.isVerified && (
                <div className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-green-500/5 border border-green-500/20 text-green-500 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
                  <IconVerified className="w-2.5 h-2.5 md:w-3 md:h-3" /> VERIFIED
                </div>
              )}
              <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 border border-white/10 text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-40">
                INIT_2024
              </div>
            </div>
            <h1 className="syne text-[15vw] sm:text-[10vw] md:text-[8vw] tracking-tighter leading-[0.82] uppercase truncate">
              {user?.name}
            </h1>
            <div className="flex gap-6 md:gap-12 opacity-30 uppercase text-[9px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] pt-4 md:pt-8">
                <div className="space-y-1">
                  <span className="block opacity-50">EVIDENCE</span>
                  <span className="text-white text-base md:text-xl tabular-nums">{userProjects.length}</span>
                </div>
                <div className="h-10 md:h-12 w-px bg-white/20" />
                <div className="space-y-1">
                  <span className="block opacity-50">UTILITY</span>
                  <span className="text-white text-base md:text-xl tabular-nums">{user?.sessionsCompleted}</span>
                </div>
            </div>
          </div>
          
          <aside className="lg:col-span-4">
             <GlassCard hover={false} className="!p-10 md:!p-16 space-y-8 md:space-y-12 !bg-[#007AFF]/5 border-[#007AFF]/20 text-center relative overflow-hidden group !rounded-[32px]">
                <div className="absolute top-[-20%] right-[-20%] w-48 md:w-64 h-48 md:h-64 bg-[#007AFF]/10 rounded-full blur-[60px] md:blur-[80px] group-hover:scale-125 transition-transform duration-1000" />
                <div className="flex justify-center mb-4 relative z-10">
                   <SignalGauge score={signalScore} size={window.innerWidth < 480 ? 'md' : 'lg'} />
                </div>
                <div className="space-y-3 md:space-y-4 relative z-10">
                  <span className="block text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-30 font-black">EXPERT STRATEGY</span>
                  <div className="flex items-baseline justify-center gap-1 md:gap-2">
                    <span className="text-5xl md:text-7xl font-black tracking-tighter tabular-nums">${user?.sessionPrice}</span>
                    <span className="text-[8px] md:text-[10px] opacity-30 uppercase font-black">/ 30M</span>
                  </div>
                </div>
                {!isOwnProfile && (
                  <Button variant="primary" size="lg" fullWidth className="!py-5 md:!py-8 !bg-[#007AFF] !text-white border-none hover:shadow-[0_15px_40px_rgba(0,122,255,0.4)] relative z-10 !text-sm">
                    Secure Expertise
                  </Button>
                )}
                <p className="text-[8px] opacity-20 uppercase tracking-[0.3em] font-black relative z-10">
                  100% Signal Integrity • Real-Time
                </p>
             </GlassCard>
          </aside>
        </section>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          
          <div className="lg:col-span-8 space-y-24 md:space-y-48">
            
            {/* Project Proof Section */}
            <section className="space-y-8 md:space-y-16">
              <div className="flex justify-between items-baseline">
                <h2 className="syne text-3xl md:text-5xl uppercase tracking-tighter">Proof Ledger</h2>
                <div className="text-[9px] uppercase tracking-[0.3em] opacity-20 font-black">Records {userProjects.length}</div>
              </div>
              <div className="space-y-5 md:space-y-12">
                {userProjects.map((project) => (
                  <Link to={`/project/${project.id}`} key={project.id} className="block group">
                    <article className="bg-white/[0.02] border border-white/5 p-6 md:p-12 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-700 rounded-2xl">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-8">
                        <div className="space-y-3 md:space-y-4">
                          <div className="flex items-center gap-3">
                             <h3 className="syne text-2xl md:text-5xl group-hover:text-[#007AFF] transition-all leading-tight">{project.title}</h3>
                             {project.originalProjectId && <span className="text-[7px] md:text-[8px] bg-green-500 text-black px-2 md:px-3 py-1 font-black uppercase tracking-widest">REMIX</span>}
                          </div>
                          <p className="text-sm md:text-xl opacity-40 line-clamp-2 leading-relaxed font-medium max-w-2xl">
                            {project.problem}
                          </p>
                        </div>
                        <IconArrowRight className="w-5 h-5 md:w-8 md:h-8 opacity-10 md:group-hover:opacity-100 group-hover:translate-x-2 md:group-hover:translate-x-4 transition-all self-end md:self-auto" />
                      </div>
                    </article>
                  </Link>
                ))}
                {!userProjects.length && <div className="py-20 text-center opacity-10 italic serif text-3xl md:text-4xl">No proofs discovered.</div>}
              </div>
            </section>

            {/* Communication Terminal */}
            <section className="pt-16 md:pt-24 border-t border-white/5 space-y-10 md:space-y-16">
                <div className="flex justify-between items-baseline">
                    <h2 className="syne text-3xl md:text-5xl uppercase tracking-tighter">Terminal</h2>
                    {!hasCompletedSessionWithUser && !isOwnProfile && (
                        <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-red-500/40">Restricted Link</span>
                    )}
                </div>

                {hasCompletedSessionWithUser || isOwnProfile ? (
                    <GlassCard hover={false} className="!p-0 border-white/10 overflow-hidden !bg-black !rounded-3xl">
                        <div className="p-5 md:p-10 bg-white/5 border-b border-white/10">
                           <div className="flex items-center gap-2 md:gap-3">
                             <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Established Link</span>
                           </div>
                        </div>
                        <div className="p-5 md:p-10 space-y-6 md:space-y-10 min-h-[300px] md:min-h-[400px] max-h-[500px] md:max-h-[600px] overflow-y-auto scrollbar-hide flex flex-col justify-end">
                            {conversation?.messages.map(m => (
                                <div key={m.id} className={`flex flex-col ${m.senderId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 md:p-6 max-w-[85%] md:max-w-[80%] text-sm md:text-base ${m.senderId === currentUser?.id ? 'bg-[#007AFF] text-white' : 'bg-white/10 text-white/90'} border border-white/10 rounded-sm`}>
                                        {m.text}
                                    </div>
                                    <span className="text-[7px] md:text-[8px] uppercase font-black opacity-20 mt-2 tracking-widest tabular-nums">{new Date(m.timestamp).toLocaleTimeString()}</span>
                                </div>
                            ))}
                            {!conversation?.messages.length && (
                                <div className="py-16 text-center opacity-20 uppercase text-[9px] md:text-xs tracking-[0.4em] italic font-black">No signals...</div>
                            )}
                        </div>
                        {!isOwnProfile && (
                          <div className="p-4 md:p-10 bg-white/5 border-t border-white/10 flex gap-3 md:gap-6">
                              <input 
                                  className="flex-1 bg-black border border-white/10 p-4 md:p-6 outline-none text-base md:text-lg focus:border-[#007AFF] transition-all font-medium rounded-xl"
                                  placeholder="Message..."
                                  value={chatText}
                                  onChange={e => setChatText(e.target.value)}
                                  onKeyPress={e => e.key === 'Enter' && handleSendChat()}
                              />
                              <Button size="md" onClick={handleSendChat} className="!px-6 md:!px-12 !rounded-xl">Trans</Button>
                          </div>
                        )}
                    </GlassCard>
                ) : (
                    <div className="border border-white/5 p-16 md:p-32 text-center bg-white/[0.01] grayscale rounded-3xl">
                        <p className="text-base md:text-2xl font-medium opacity-30 mb-8 md:mb-12 leading-relaxed">
                            Communication protocol is locked. <br/> Access requires one completed exchange.
                        </p>
                        <Button variant="secondary" size="md" disabled className="!px-8 md:!px-12 opacity-50 !rounded-full">Locked</Button>
                    </div>
                )}
            </section>
          </div>

          {/* Sidebar Exchanges */}
          <aside className="lg:col-span-4 space-y-12 md:space-y-24">
            <section className="border border-white/10 p-6 md:p-10 bg-black/80 backdrop-blur-xl space-y-8 md:space-y-12 sticky top-24 md:top-32 rounded-3xl">
              <div className="flex justify-between items-baseline">
                <h2 className="syne text-2xl md:text-3xl uppercase tracking-tighter">Exchanges</h2>
                {isOwnProfile && (
                  <button onClick={() => setIsAddingContract(true)} className="text-[8px] md:text-[10px] font-black uppercase border-b-2 border-[#007AFF] text-[#007AFF] pb-1 tracking-widest">+ NEW</button>
                )}
              </div>

              {isAddingContract && (
                <div className="bg-[#007AFF]/5 border border-[#007AFF]/20 p-6 md:p-10 space-y-6 md:space-y-8 animate-in slide-in-from-top duration-500 rounded-2xl">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Label</label>
                    <input placeholder="TITLE" className="w-full bg-transparent border-b-2 border-white/10 py-3 text-lg outline-none focus:border-[#007AFF] transition-all font-black tracking-tighter" value={newContract.title} onChange={e => setNewContract({...newContract, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">Scope</label>
                    <textarea placeholder="Scope..." className="w-full bg-white/5 border border-white/10 p-4 text-sm outline-none h-24 resize-none leading-relaxed rounded-xl" value={newContract.description} onChange={e => setNewContract({...newContract, description: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <select className="bg-black border border-white/10 p-3 text-[10px] font-black uppercase tracking-widest outline-none rounded-xl" value={newContract.price} onChange={e => setNewContract({...newContract, price: Number(e.target.value)})}>
                        <option value={10}>Tier I ($10)</option>
                        <option value={25}>Tier II ($25)</option>
                        <option value={50}>Tier III ($50)</option>
                    </select>
                    <Button size="md" onClick={handleAddContract} fullWidth className="!py-4 !rounded-xl">Publish</Button>
                  </div>
                </div>
              )}

              <div className="space-y-5 md:space-y-8">
                {userContracts.map(mc => (
                    <div key={mc.id} className={`p-6 md:p-10 border transition-all duration-700 rounded-2xl ${mc.status !== ContractStatus.AVAILABLE ? 'border-[#007AFF] bg-[#007AFF]/5' : 'border-white/10 hover:border-white/40'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-black uppercase tracking-widest leading-tight max-w-[70%]">{mc.title}</span>
                            <span className="text-lg md:text-xl font-black text-[#007AFF] tabular-nums">${mc.price}</span>
                        </div>
                        <p className="text-[10px] opacity-40 mb-8 leading-relaxed font-medium">{mc.description}</p>
                        
                        {mc.status === ContractStatus.AVAILABLE ? (
                            !isOwnProfile ? (
                                <Button variant="secondary" size="md" fullWidth className="!py-3 !rounded-xl" onClick={() => setBookingContractId(mc.id)}>Initiate Protocol</Button>
                            ) : (
                                <div className="text-[7px] uppercase tracking-[0.4em] opacity-20 text-center font-black">Awaiting Counterparty</div>
                            )
                        ) : (
                            <div className="text-[8px] uppercase tracking-[0.4em] text-center font-black opacity-60">Status: {mc.status}</div>
                        )}
                    </div>
                ))}
                {!userContracts.length && <p className="text-[9px] opacity-10 uppercase tracking-[0.4em] text-center italic py-16 font-black">History null.</p>}
              </div>
            </section>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Profile;
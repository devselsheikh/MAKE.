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
    <div className="pt-24 md:pt-40 pb-40 md:pb-64 adaptive-padding bg-black min-h-screen selection:bg-[#007AFF]">
      <Header userId={currentUser?.id} onLogout={onLogout} />
      
      {/* Transactional Modals */}
      {bookingContractId && (
          <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-reveal reveal-active">
              <div className="max-w-xl w-full glass p-10 md:p-16 space-y-12 md:space-y-16 rounded-[2.5rem] shadow-[0_0_150px_rgba(0,122,255,0.15)]">
                  <div className="space-y-4">
                    <h2 className="syne text-step-3 md:text-step-5 tracking-tighter leading-none">Authorize Escrow</h2>
                    <p className="opacity-40 text-step-0 leading-relaxed font-medium">Commit funds to the vault for secure expertise transfer.</p>
                  </div>
                  <div className="bg-white/5 p-8 md:p-12 space-y-8 rounded-2xl">
                      <div className="flex justify-between uppercase text-step--2 font-black font-mono">
                          <span className="opacity-40">Contract Payload</span>
                          <span>${contracts.find(c => c.id === bookingContractId)?.price}.00</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between uppercase text-step--2 font-black tracking-[0.4em] text-[#007AFF]">
                          <span>SECURE_FEE</span>
                          <span>WAVED (BETA)</span>
                      </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <Button fullWidth size="lg" onClick={confirmBooking} className="!bg-[#007AFF] !text-white border-none !py-6 md:!py-8">Commit Funds</Button>
                    <button onClick={() => setBookingContractId(null)} className="text-step--2 uppercase font-black opacity-30 hover:opacity-100 tracking-[0.5em] py-4">Abort Protocol</button>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-[1600px] mx-auto w-full">
        
        {/* Profile Hero Section */}
        <section className="mb-20 md:mb-48 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-start pb-20 md:pb-32 border-b border-white/5">
          <div className="lg:col-span-8 space-y-10 md:space-y-16">
            <div className="flex flex-wrap items-center gap-4 md:gap-8">
              <div className="px-5 py-2 md:py-3 bg-[#007AFF]/5 border border-[#007AFF]/20 text-[#007AFF] text-step--2 font-black uppercase tracking-[0.4em]">
                  {user?.track}
              </div>
              {user?.isVerified && (
                <div className="flex items-center gap-3 px-5 py-2 md:py-3 bg-green-500/5 border border-green-500/20 text-green-500 text-step--2 font-black uppercase tracking-[0.4em]">
                  <IconVerified className="w-4 h-4" /> VERIFIED
                </div>
              )}
              <div className="px-5 py-2 md:py-3 bg-white/5 border border-white/10 text-step--2 font-black uppercase tracking-[0.4em] opacity-40">
                INIT_2026
              </div>
            </div>
            <h1 className="syne text-display-xl tracking-tighter uppercase break-words leading-[0.85]">
              {user?.name}
            </h1>
            <div className="flex gap-12 md:gap-20 opacity-30 uppercase text-step--2 font-black tracking-[0.6em] pt-8 md:pt-12">
                <div className="space-y-2">
                  <span className="block opacity-50">ARTIFACTS</span>
                  <span className="text-white text-step-2 md:text-step-4 tabular-nums leading-none">{userProjects.length}</span>
                </div>
                <div className="h-16 w-px bg-white/20" />
                <div className="space-y-2">
                  <span className="block opacity-50">SIGNAL</span>
                  <span className="text-white text-step-2 md:text-step-4 tabular-nums leading-none">{signalScore}</span>
                </div>
            </div>
          </div>
          
          <aside className="lg:col-span-4 w-full">
             <GlassCard hover={false} className="!p-12 md:!p-20 space-y-10 md:space-y-16 !bg-[#007AFF]/5 border-[#007AFF]/20 text-center relative overflow-hidden group !rounded-[3rem]">
                <div className="absolute top-[-20%] right-[-20%] w-64 h-64 md:w-96 md:h-96 bg-[#007AFF]/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
                <div className="flex justify-center mb-6 relative z-10">
                   <SignalGauge score={signalScore} size="lg" />
                </div>
                <div className="space-y-4 md:space-y-6 relative z-10">
                  <span className="block text-step--2 uppercase tracking-[0.5em] opacity-30 font-black">UTILITY_VALUATION</span>
                  <div className="flex items-baseline justify-center gap-3">
                    <span className="text-display-md font-black tracking-tighter tabular-nums leading-none">${user?.sessionPrice}</span>
                    <span className="text-step--2 opacity-30 uppercase font-black">/ 30M</span>
                  </div>
                </div>
                {!isOwnProfile && (
                  <Button variant="primary" size="lg" fullWidth className="!py-7 md:!py-9 !bg-[#007AFF] !text-white border-none hover:shadow-[0_20px_60px_rgba(0,122,255,0.4)] relative z-10">
                    Secure Expertise
                  </Button>
                )}
             </GlassCard>
          </aside>
        </section>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 md:gap-32">
          
          <div className="lg:col-span-8 space-y-32 md:space-y-64">
            
            {/* Project Proof Section */}
            <section className="space-y-12 md:space-y-20">
              <div className="flex justify-between items-baseline border-b border-white/5 pb-10">
                <h2 className="syne text-step-3 md:text-step-5 uppercase tracking-tighter">Proof Ledger</h2>
                <div className="text-step--2 uppercase tracking-[0.5em] opacity-20 font-black">ENTRIES {userProjects.length}</div>
              </div>
              <div className="space-y-8 md:space-y-16">
                {userProjects.map((project) => (
                  <Link to={`/project/${project.id}`} key={project.id} className="block group">
                    <article className="bg-white/[0.02] border border-white/5 p-8 md:p-16 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-700 rounded-[2rem] md:rounded-[3rem]">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-8 md:gap-16">
                        <div className="space-y-5 md:space-y-8 flex-1">
                          <div className="flex items-center gap-6">
                             <h3 className="syne text-step-1 md:text-step-4 group-hover:text-[#007AFF] transition-all leading-none tracking-tighter">{project.title}</h3>
                             {project.originalProjectId && <span className="text-step--2 bg-green-500 text-black px-4 py-1.5 font-black uppercase tracking-widest rounded-sm">REMIX</span>}
                          </div>
                          <p className="text-step-0 md:text-step-1 opacity-40 line-clamp-2 leading-relaxed font-medium max-w-3xl">
                            {project.problem}
                          </p>
                        </div>
                        <IconArrowRight className="w-8 h-8 md:w-12 md:h-12 opacity-10 group-hover:opacity-100 group-hover:translate-x-4 transition-all self-end md:self-auto" />
                      </div>
                    </article>
                  </Link>
                ))}
                {!userProjects.length && <div className="py-32 text-center opacity-10 italic serif text-step-4">Zero signals emitted.</div>}
              </div>
            </section>

            {/* Terminal View */}
            <section className="pt-20 md:pt-32 border-t border-white/5 space-y-12 md:space-y-20">
                <div className="flex justify-between items-baseline">
                    <h2 className="syne text-step-3 md:text-step-5 uppercase tracking-tighter">Terminal</h2>
                    {!hasCompletedSessionWithUser && !isOwnProfile && (
                        <span className="text-step--2 uppercase font-black tracking-[0.5em] text-red-500/40">Restricted Link</span>
                    )}
                </div>

                {hasCompletedSessionWithUser || isOwnProfile ? (
                    <GlassCard hover={false} className="!p-0 border-white/10 overflow-hidden !bg-black !rounded-[2.5rem]">
                        <div className="p-6 md:p-12 bg-white/5 border-b border-white/10">
                           <div className="flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-step--2 font-black uppercase tracking-[0.5em]">Sync established</span>
                           </div>
                        </div>
                        <div className="p-8 md:p-16 space-y-10 md:space-y-16 min-h-[400px] md:min-h-[600px] max-h-[700px] md:max-h-[800px] overflow-y-auto scrollbar-hide flex flex-col justify-end">
                            {conversation?.messages.map(m => (
                                <div key={m.id} className={`flex flex-col ${m.senderId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-6 md:p-10 max-w-[90%] md:max-w-[80%] text-step-0 ${m.senderId === currentUser?.id ? 'bg-[#007AFF] text-white' : 'bg-white/10 text-white/90'} border border-white/10 rounded-2xl`}>
                                        {m.text}
                                    </div>
                                    <span className="text-step--2 uppercase font-black opacity-20 mt-4 tracking-widest tabular-nums">{new Date(m.timestamp).toLocaleTimeString()}</span>
                                </div>
                            ))}
                            {!conversation?.messages.length && (
                                <div className="py-32 text-center opacity-20 uppercase text-step--1 tracking-[0.6em] italic font-black">No signals transmitted.</div>
                            )}
                        </div>
                        {!isOwnProfile && (
                          <div className="p-6 md:p-12 bg-white/5 border-t border-white/10 flex gap-4 md:gap-8">
                              <input 
                                  className="flex-1 bg-black border border-white/10 p-6 md:p-8 outline-none text-step-0 md:text-step-1 focus:border-[#007AFF] transition-all font-medium rounded-2xl"
                                  placeholder="Type signal..."
                                  value={chatText}
                                  onChange={e => setChatText(e.target.value)}
                                  onKeyPress={e => e.key === 'Enter' && handleSendChat()}
                              />
                              <Button size="md" onClick={handleSendChat} className="!px-10 md:!px-16 !rounded-2xl">Transmit</Button>
                          </div>
                        )}
                    </GlassCard>
                ) : (
                    <div className="border border-white/10 p-24 md:p-48 text-center bg-white/[0.01] grayscale rounded-[3rem]">
                        <p className="text-step-1 md:text-step-3 font-medium opacity-30 mb-12 md:mb-20 leading-relaxed max-w-2xl mx-auto">
                            Protocol requires one validated expertise exchange before terminal access is granted.
                        </p>
                        <Button variant="secondary" size="lg" disabled className="!px-12 md:!px-20 opacity-30 !rounded-full">LOCKED_SYNC</Button>
                    </div>
                )}
            </section>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-16 md:space-y-32">
            <section className="border border-white/10 p-8 md:p-16 bg-black/80 backdrop-blur-3xl space-y-12 md:space-y-20 sticky top-24 md:top-40 rounded-[3rem]">
              <div className="flex justify-between items-baseline border-b border-white/5 pb-10">
                <h2 className="syne text-step-2 md:text-step-4 uppercase tracking-tighter">Exchanges</h2>
                {isOwnProfile && (
                  <button onClick={() => setIsAddingContract(true)} className="text-step--2 font-black uppercase border-b-2 border-[#007AFF] text-[#007AFF] pb-2 tracking-[0.4em] transition-all hover:text-white hover:border-white">+ NEW</button>
                )}
              </div>

              {isAddingContract && (
                <div className="bg-[#007AFF]/5 border border-[#007AFF]/20 p-8 md:p-12 space-y-10 md:space-y-12 animate-reveal rounded-3xl">
                  <div className="space-y-4">
                    <label className="text-step--2 font-black uppercase tracking-[0.5em] opacity-30">Label</label>
                    <input placeholder="TITLE" className="w-full bg-transparent border-b-2 border-white/10 py-4 text-step-1 outline-none focus:border-[#007AFF] transition-all font-black tracking-tighter" value={newContract.title} onChange={e => setNewContract({...newContract, title: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                    <label className="text-step--2 font-black uppercase tracking-[0.5em] opacity-30">Scope</label>
                    <textarea placeholder="Define scope..." className="w-full bg-white/5 border border-white/10 p-6 text-step--1 outline-none h-32 md:h-40 resize-none leading-relaxed rounded-2xl" value={newContract.description} onChange={e => setNewContract({...newContract, description: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-6">
                    <select className="bg-black border border-white/10 p-5 text-step--2 font-black uppercase tracking-[0.4em] outline-none rounded-2xl" value={newContract.price} onChange={e => setNewContract({...newContract, price: Number(e.target.value)})}>
                        <option value={10}>Tier I ($10)</option>
                        <option value={25}>Tier II ($25)</option>
                        <option value={50}>Tier III ($50)</option>
                    </select>
                    <Button size="lg" onClick={handleAddContract} fullWidth className="!py-6 !rounded-2xl">Publish</Button>
                  </div>
                </div>
              )}

              <div className="space-y-8 md:space-y-12">
                {userContracts.map(mc => (
                    <div key={mc.id} className={`p-8 md:p-12 border transition-all duration-700 rounded-[2rem] md:rounded-[2.5rem] ${mc.status !== ContractStatus.AVAILABLE ? 'border-[#007AFF] bg-[#007AFF]/5' : 'border-white/5 hover:border-white/20'}`}>
                        <div className="flex justify-between items-start mb-8">
                            <span className="text-step-0 md:text-step-1 font-black uppercase tracking-tight leading-none max-w-[70%]">{mc.title}</span>
                            <span className="text-step-2 md:text-step-3 font-black text-[#007AFF] tabular-nums leading-none">${mc.price}</span>
                        </div>
                        <p className="text-step--1 opacity-40 mb-10 leading-relaxed font-medium">{mc.description}</p>
                        
                        {mc.status === ContractStatus.AVAILABLE ? (
                            !isOwnProfile ? (
                                <Button variant="secondary" size="md" fullWidth className="!py-5 !rounded-2xl" onClick={() => setBookingContractId(mc.id)}>Initiate sync</Button>
                            ) : (
                                <div className="text-step--2 uppercase tracking-[0.5em] opacity-20 text-center font-black">Awaiting counterparty</div>
                            )
                        ) : (
                            <div className="text-step--1 uppercase tracking-[0.5em] text-center font-black opacity-80 text-[#007AFF]"> {mc.status}</div>
                        )}
                    </div>
                ))}
                {!userContracts.length && <p className="text-step--1 opacity-10 uppercase tracking-[0.6em] text-center italic py-24 font-black">Exchanges null.</p>}
              </div>
            </section>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Profile;
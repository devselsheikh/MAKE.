import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Project, User, Comment } from '../types';
import { SignalGauge } from '../components/SignalGauge';
import { calculateSignalScore } from '../utils/signalScore';
import { GlassCard } from '../components/GlassCard';
import { IconArrowRight, IconVerified } from '../components/Icons';

interface ProjectDetailProps {
  projects: Project[];
  user: User | null;
  allUsers: { id: string, name: string }[];
  onAddComment: (id: string, comment: Comment) => void;
  onRemix: (project: Project) => void;
  onRequestReview: (projectId: string, reviewer: { id: string, name: string }) => void;
  onLogout: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projects, user, allUsers, onAddComment, onRemix, onRequestReview, onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = projects.find(p => p.id === id);
  
  const [commentText, setCommentText] = useState('');
  const [isRemixing, setIsRemixing] = useState(false);
  const [remixReason, setRemixReason] = useState('');
  const [isTagging, setIsTagging] = useState(false);
  const [searchTag, setSearchTag] = useState('');
  const [focusMode, setFocusMode] = useState(false);

  if (!project) return <div className="min-h-screen bg-black flex items-center justify-center syne text-2xl uppercase">Proof Not Found</div>;

  const signalScore = calculateSignalScore({ id: project.userId }, projects);

  const handleSubmitComment = () => {
    if (!commentText.trim() || !user) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      text: commentText,
      timestamp: Date.now()
    };
    onAddComment(project.id, newComment);
    setCommentText('');
  };

  const handleRemix = () => {
    if (!remixReason.trim() || !user) return;
    const remixedProject: Project = {
      ...project,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userTrack: user.track,
      originalProjectId: project.id,
      remixReason: remixReason,
      timestamp: Date.now(),
      comments: [],
      peerReviewRequests: []
    };
    onRemix(remixedProject);
    setIsRemixing(false);
    navigate(`/project/${remixedProject.id}`);
  };

  return (
    <div className={`pt-20 md:pt-32 pb-32 md:pb-48 px-5 md:px-12 bg-black min-h-screen selection:bg-[#00FFD1] transition-all duration-1000 ${focusMode ? 'pt-8' : ''}`}>
      {!focusMode && <Header userId={user?.id} onLogout={onLogout} />}
      
      {/* Remix Modal */}
      {isRemixing && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-5 md:p-6 backdrop-blur-md animate-reveal">
          <div className="max-w-2xl w-full bg-black border border-white/10 p-8 md:p-16 space-y-10 md:space-y-12 rounded-[32px]">
            <h2 className="syne text-3xl md:text-6xl uppercase tracking-tighter">Remix Pivot</h2>
            <p className="opacity-40 text-sm md:text-lg leading-relaxed font-medium">Define your architectural deviation. Sub-standard remixing decays signal strength.</p>
            <div className="space-y-3">
              <label className="block text-[9px] uppercase tracking-[0.5em] font-black opacity-30">Pivot Hypothesis</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 p-6 md:p-10 text-base md:text-xl outline-none h-40 md:h-64 focus:border-[#00FFD1] transition-all leading-relaxed rounded-2xl"
                placeholder="I re-engineered the logic layer..."
                value={remixReason}
                onChange={e => setRemixReason(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button fullWidth size="lg" onClick={handleRemix} disabled={!remixReason.trim()} variant="hyper" className="!rounded-2xl !py-5 md:!py-8">Deploy Remix</Button>
              <Button variant="ghost" size="lg" onClick={() => setIsRemixing(false)} className="!rounded-2xl !py-5 md:!py-8">Abort</Button>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${focusMode ? 'max-w-4xl' : ''}`}>
        
        {/* Project Header */}
        <div className="mb-16 md:mb-32">
            <div className="flex justify-between items-center mb-10 md:mb-12">
              <Link to="/feed" className={`text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-30 hover:opacity-100 flex items-center gap-3 transition-opacity ${focusMode ? 'invisible' : ''}`}>
                  <IconArrowRight className="w-3 h-3 rotate-180" /> ARENA
              </Link>
              <button 
                onClick={() => setFocusMode(!focusMode)}
                className="text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] border border-white/10 px-5 md:px-6 py-2.5 md:py-3 hover:bg-white hover:text-black transition-all bg-black rounded-full"
              >
                {focusMode ? 'EXIT' : 'FOCUS'}
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-8 md:gap-12">
              <div className="space-y-4 md:space-y-6 flex-1">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="px-2.5 py-1 bg-[#00FFD1]/5 border border-[#00FFD1]/20 text-[#00FFD1] text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">
                      {project.userTrack}
                  </div>
                  {!focusMode && (
                    <Link to={`/profile/${project.userId}`} className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] hover:text-[#00FFD1] transition-all opacity-40 hover:opacity-100">
                      {project.userName}
                    </Link>
                  )}
                </div>
                <h1 className="syne text-4xl md:text-[100px] tracking-tighter leading-[1.05] md:leading-[0.85] uppercase">
                    {project.title}
                </h1>
              </div>
              
              {!focusMode && (
                <div className="flex flex-row md:flex-col items-center gap-6 w-full md:w-auto justify-between border-t border-white/5 pt-8 md:border-none md:pt-0">
                   <SignalGauge score={signalScore} size={window.innerWidth < 480 ? 'md' : 'lg'} />
                   {user && user.id !== project.userId && (
                     <Button variant="secondary" size="md" onClick={() => setIsRemixing(true)} className="hover:!bg-white hover:!text-black !rounded-full !px-8 md:!px-12 !py-4">Remix</Button>
                   )}
                </div>
              )}
            </div>
        </div>

        {/* Main Content Grid */}
        <div className={`grid grid-cols-1 gap-16 md:gap-24 ${focusMode ? '' : 'lg:grid-cols-12'}`}>
            
            <div className={`${focusMode ? 'space-y-24 md:space-y-32' : 'lg:col-span-8 space-y-24 md:space-y-48'}`}>
                
                {project.remixReason && (
                  <div className="bg-[#00FFD1]/5 border-l-4 md:border-l-8 border-[#00FFD1] p-8 md:p-16 space-y-3 md:space-y-4 rounded-r-2xl">
                    <h4 className="text-[9px] uppercase font-black tracking-[0.5em] text-[#00FFD1]">PIVOT_LOGIC</h4>
                    <p className="serif-italic text-xl md:text-4xl leading-relaxed opacity-90">"{project.remixReason}"</p>
                  </div>
                )}

                <section className="space-y-6 md:space-y-8 px-1">
                    <h2 className="text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] opacity-30 font-black border-b border-white/5 pb-4">01_PROBLEM</h2>
                    <p className="text-xl md:text-5xl leading-tight text-white/90 font-bold tracking-tight">{project.problem}</p>
                </section>

                <section className="bg-white/[0.02] p-8 md:p-20 border border-white/5 space-y-12 md:space-y-24 rounded-[32px]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                       <h2 className="text-[9px] uppercase tracking-[0.4em] md:tracking-[0.6em] text-[#00FFD1] font-black">02_AUTOPSY</h2>
                       <span className="text-[8px] opacity-10 font-black uppercase tracking-[0.4em] hidden md:block">VERIFIED_PROOF_V2</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-[9px] uppercase opacity-20 font-black tracking-[0.3em]">Intent</h4>
                        <p className="text-base md:text-lg opacity-60 leading-relaxed font-medium">{project.whatFailed?.goal || project.outcomeDescription}</p>
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <h4 className="text-[9px] uppercase opacity-20 font-black tracking-[0.3em]">Approach</h4>
                        <p className="text-base md:text-lg opacity-60 leading-relaxed font-medium">{project.whatFailed?.approach || "Standard architectural implementation."}</p>
                      </div>
                    </div>

                    <div className="bg-red-500/[0.03] border border-red-500/10 p-6 md:p-12 space-y-4 md:space-y-6 rounded-2xl">
                      <h4 className="text-[9px] uppercase text-red-500 font-black tracking-[0.4em] md:tracking-[0.6em]">FAILURE_VECTORS</h4>
                      <p className={`serif-italic border-l-2 border-red-500/30 pl-6 md:pl-10 leading-relaxed opacity-90 ${focusMode ? 'text-xl md:text-2xl' : 'text-lg md:text-3xl'}`}>
                        "{project.whatFailed?.wrong || project.hardPart}"
                      </p>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      <h4 className="text-[9px] uppercase text-[#00FFD1] font-black tracking-[0.4em] md:tracking-[0.6em]">SYNTHESIS</h4>
                      <p className="text-base md:text-xl opacity-80 leading-relaxed font-medium max-w-3xl">
                        {project.whatFailed?.lessons || "Iteration is the primary protocol."}
                      </p>
                    </div>
                </section>

                {!focusMode && (
                  <section className="pt-16 md:pt-20 border-t border-white/5 pb-24 space-y-12 px-1">
                      <h2 className="syne text-3xl md:text-4xl uppercase tracking-tighter">Critiques</h2>
                      
                      {user ? (
                          <div className="space-y-6">
                              <textarea 
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Execute technical critique..."
                                  className="w-full bg-white/[0.02] border border-white/10 p-6 md:p-12 text-base md:text-xl outline-none h-40 md:h-64 focus:border-white transition-all resize-none leading-relaxed font-medium rounded-2xl"
                              />
                              <div className="flex justify-end">
                                  <Button size="md" onClick={handleSubmitComment} disabled={!commentText.trim()} variant="hyper" className="!rounded-full !px-10">Deploy</Button>
                              </div>
                          </div>
                      ) : null}

                      <div className="space-y-10 md:space-y-12">
                          {project.comments.map(c => (
                              <div key={c.id} className="border-l border-white/10 pl-6 md:pl-12">
                                  <div className="flex items-center gap-3 mb-3">
                                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">{c.userName}</span>
                                  </div>
                                  <p className="text-white/60 leading-relaxed text-base md:text-xl font-medium">{c.text}</p>
                              </div>
                          ))}
                          {!project.comments.length && <div className="text-center opacity-10 uppercase text-[10px] tracking-widest font-black py-16">No audits recorded.</div>}
                      </div>
                  </section>
                )}
            </div>

            {/* Sidebar Artifacts */}
            {!focusMode && (
              <aside className="lg:col-span-4 space-y-12 md:space-y-16">
                  <div className="border border-white/5 p-8 md:p-10 bg-black/40 backdrop-blur-3xl sticky top-24 md:top-32 space-y-10 rounded-[32px]">
                      <h3 className="text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-white/20 border-b border-white/5 pb-5">SOURCES</h3>
                      <ul className="space-y-6 md:space-y-8">
                          {project.links.map((link, i) => (
                              <li key={i}>
                                  <a href={link} target="_blank" rel="noreferrer" className="block text-sm font-bold truncate hover:text-[#00FFD1] transition-all group overflow-hidden">
                                      <span className="text-[8px] opacity-10 block mb-1 tracking-widest font-mono uppercase">LINK_0{i+1}</span> 
                                      <span className="opacity-60 group-hover:opacity-100">{link.replace('https://', '').replace('www.', '')} ↗</span>
                                  </a>
                              </li>
                          ))}
                      </ul>

                      <div className="pt-5 space-y-6">
                          <Button fullWidth variant="secondary" className="!py-4 !rounded-xl">Audit Request</Button>
                          <p className="text-[8px] opacity-10 uppercase tracking-[0.4em] text-center font-black">SIGNAL_INTEGRITY_SAFE</p>
                      </div>
                  </div>
              </aside>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
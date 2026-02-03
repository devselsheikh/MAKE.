import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Project, User, Comment } from '../types';
import { SignalGauge } from '../components/SignalGauge';
import { calculateSignalScore } from '../utils/signalScore';
import { IconArrowRight } from '../components/Icons';

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
  const [focusMode, setFocusMode] = useState(false);

  if (!project) return <div className="min-h-screen bg-black flex items-center justify-center syne text-step-3 uppercase">Proof Not Found</div>;

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
    <div className={`pt-24 md:pt-40 pb-40 md:pb-64 adaptive-padding bg-black min-h-screen selection:bg-[#00FFD1] transition-all duration-1000 ${focusMode ? 'pt-10' : ''}`}>
      {!focusMode && <Header userId={user?.id} onLogout={onLogout} />}
      
      {/* Remix Modal */}
      {isRemixing && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 backdrop-blur-md animate-reveal">
          <div className="max-w-3xl w-full glass p-12 md:p-24 space-y-12 md:space-y-20 rounded-[3rem]">
            <h2 className="syne text-step-3 md:text-step-5 uppercase tracking-tighter leading-none">Remix Protocol</h2>
            <p className="opacity-40 text-step-1 leading-relaxed font-medium">Define your deviation layer. High signal remixing requires rigorous intent.</p>
            <div className="space-y-4">
              <label className="block text-step--2 uppercase tracking-[0.6em] font-black opacity-30">PIVOT_HYPOTHESIS</label>
              <textarea 
                className="w-full bg-white/5 border border-white/10 p-8 md:p-12 text-step-0 md:text-step-2 outline-none h-48 md:h-80 focus:border-[#00FFD1] transition-all leading-relaxed rounded-3xl"
                placeholder="I re-engineered the logic layer..."
                value={remixReason}
                onChange={e => setRemixReason(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <Button fullWidth size="lg" onClick={handleRemix} disabled={!remixReason.trim()} variant="hyper" className="!rounded-3xl !py-7 md:!py-10">Deploy remix</Button>
              <Button variant="ghost" size="lg" onClick={() => setIsRemixing(false)} className="!rounded-3xl !py-7 md:!py-10 !border-white/10">Abort</Button>
            </div>
          </div>
        </div>
      )}

      <div className={`max-w-[1200px] mx-auto transition-all duration-1000 ${focusMode ? 'max-w-[900px]' : ''}`}>
        
        {/* Project Header */}
        <div className="mb-20 md:mb-40">
            <div className="flex justify-between items-center mb-16 md:mb-24">
              <Link to="/feed" className={`text-step--2 font-black uppercase tracking-[0.5em] opacity-30 hover:opacity-100 flex items-center gap-4 transition-all ${focusMode ? 'invisible translate-x-[-20px]' : 'translate-x-0'}`}>
                  <IconArrowRight className="w-4 h-4 rotate-180" /> ARENA
              </Link>
              <button 
                onClick={() => setFocusMode(!focusMode)}
                className="text-step--2 font-black uppercase tracking-[0.5em] border border-white/10 px-8 md:px-12 py-3.5 md:py-5 hover:bg-white hover:text-black transition-all bg-black rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              >
                {focusMode ? 'EXIT FOCUS' : 'FOCUS MODE'}
              </button>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 md:gap-20">
              <div className="space-y-8 md:space-y-12 flex-1">
                <div className="flex flex-wrap items-center gap-6 md:gap-10">
                  <div className="px-5 py-2 md:py-3 bg-[#00FFD1]/5 border border-[#00FFD1]/20 text-[#00FFD1] text-step--2 font-black uppercase tracking-[0.5em]">
                      {project.userTrack}
                  </div>
                  {!focusMode && (
                    <Link to={`/profile/${project.userId}`} className="text-step--2 font-black uppercase tracking-[0.4em] hover:text-[#00FFD1] transition-all opacity-40 hover:opacity-100">
                      BY {project.userName}
                    </Link>
                  )}
                </div>
                <h1 className="syne text-display-lg md:text-[8rem] tracking-tighter leading-none uppercase break-words">
                    {project.title}
                </h1>
              </div>
              
              {!focusMode && (
                <div className="flex flex-row md:flex-col items-center gap-10 w-full md:w-auto justify-between border-t border-white/5 pt-12 lg:border-none lg:pt-0">
                   <SignalGauge score={signalScore} size="lg" />
                   {user && user.id !== project.userId && (
                     <Button variant="secondary" size="lg" onClick={() => setIsRemixing(true)} className="hover:!bg-[#00FFD1] hover:!text-black !rounded-full !px-12 md:!px-20 !py-6">REMIX</Button>
                   )}
                </div>
              )}
            </div>
        </div>

        {/* Content Flow */}
        <div className={`grid grid-cols-1 gap-20 md:gap-40 ${focusMode ? '' : 'lg:grid-cols-12'}`}>
            
            <div className={`${focusMode ? 'space-y-32 md:space-y-64' : 'lg:col-span-8 space-y-32 md:space-y-64'}`}>
                
                {project.remixReason && (
                  <div className="bg-[#00FFD1]/5 border-l-8 border-[#00FFD1] p-12 md:p-24 space-y-6 md:space-y-8 rounded-r-3xl">
                    <h4 className="text-step--2 uppercase font-black tracking-[0.8em] text-[#00FFD1]">PIVOT_LOGIC</h4>
                    <p className="serif-italic text-step-2 md:text-step-4 leading-tight opacity-95">"{project.remixReason}"</p>
                  </div>
                )}

                <section className="space-y-10 md:space-y-16">
                    <h2 className="text-step--2 uppercase tracking-[1em] opacity-30 font-black border-b border-white/5 pb-6">01_PROBLEM_SPACE</h2>
                    <p className="text-step-2 md:text-step-5 leading-tight text-white/95 font-bold tracking-tighter">{project.problem}</p>
                </section>

                <section className="bg-white/[0.01] p-12 md:p-24 lg:p-32 border border-white/5 space-y-20 md:space-y-40 rounded-[3rem] md:rounded-[4rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-10 md:pb-16">
                       <h2 className="text-step--2 uppercase tracking-[1em] text-[#00FFD1] font-black">02_ARTIFACT_AUTOPSY</h2>
                       <span className="text-step--2 opacity-10 font-black uppercase tracking-[0.8em] hidden md:block">SIGNAL_INTEGRITY_V4</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                      <div className="space-y-6 md:space-y-8">
                        <h4 className="text-step--2 uppercase opacity-20 font-black tracking-[0.6em]">Design Intent</h4>
                        <p className="text-step-0 md:text-step-1 opacity-60 leading-relaxed font-medium">{project.whatFailed?.goal || project.outcomeDescription}</p>
                      </div>
                      <div className="space-y-6 md:space-y-8">
                        <h4 className="text-step--2 uppercase opacity-20 font-black tracking-[0.6em]">Architecture</h4>
                        <p className="text-step-0 md:text-step-1 opacity-60 leading-relaxed font-medium">{project.whatFailed?.approach || "Standard optimized implementation."}</p>
                      </div>
                    </div>

                    <div className="bg-red-500/[0.03] border border-red-500/10 p-10 md:p-20 space-y-8 md:space-y-12 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50 group-hover:w-2 transition-all duration-700" />
                      <h4 className="text-step--2 uppercase text-red-500 font-black tracking-[0.8em]">FAILURE_VECTORS</h4>
                      <p className="serif-italic border-l-4 border-red-500/20 pl-8 md:pl-16 leading-tight opacity-90 text-step-2 md:text-step-4">
                        "{project.whatFailed?.wrong || project.hardPart}"
                      </p>
                    </div>

                    <div className="space-y-8 md:space-y-12">
                      <h4 className="text-step--2 uppercase text-[#00FFD1] font-black tracking-[0.8em]">SYNTHESIS_REPORTS</h4>
                      <p className="text-step-1 md:text-step-2 opacity-80 leading-relaxed font-medium max-w-4xl">
                        {project.whatFailed?.lessons || "Iteration is the core engine of the proof graph."}
                      </p>
                    </div>
                </section>

                {!focusMode && (
                  <section className="pt-24 md:pt-48 border-t border-white/5 space-y-16 md:space-y-24">
                      <h2 className="syne text-step-3 md:text-step-5 uppercase tracking-tighter leading-none">External Audit</h2>
                      
                      {user && (
                          <div className="space-y-10">
                              <textarea 
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Begin technical critique..."
                                  className="w-full bg-white/[0.01] border border-white/10 p-10 md:p-16 text-step-1 md:text-step-2 outline-none h-64 md:h-96 focus:border-white transition-all resize-none leading-relaxed font-medium rounded-[2.5rem] shadow-inner"
                              />
                              <div className="flex justify-end">
                                  <Button size="lg" onClick={handleSubmitComment} disabled={!commentText.trim()} variant="hyper" className="!rounded-full !px-16 !py-6 md:!py-8">Transmit Critique</Button>
                              </div>
                          </div>
                      )}

                      <div className="space-y-16 md:space-y-24">
                          {project.comments.map(c => (
                              <div key={c.id} className="border-l-2 border-white/10 pl-10 md:pl-20 py-4 transition-all hover:border-white/40">
                                  <div className="flex items-center gap-6 mb-6">
                                      <span className="text-step--2 font-black uppercase tracking-[0.5em] text-[#00FFD1]">{c.userName}</span>
                                      <span className="text-step--2 font-black uppercase tracking-[0.5em] opacity-10 tabular-nums">{new Date(c.timestamp).toLocaleDateString()}</span>
                                  </div>
                                  <p className="text-white/70 leading-relaxed text-step-1 md:text-step-2 font-medium">{c.text}</p>
                              </div>
                          ))}
                          {!project.comments.length && <div className="text-center opacity-10 uppercase text-step--1 tracking-[1em] font-black py-48 bg-white/[0.01] rounded-[3rem]">No audits detected.</div>}
                      </div>
                  </section>
                )}
            </div>

            {/* Sidebar Resources */}
            {!focusMode && (
              <aside className="lg:col-span-4 w-full">
                  <div className="glass p-10 md:p-16 sticky top-24 md:top-40 space-y-16 md:space-y-24 rounded-[3rem] shadow-[0_60px_100px_rgba(0,0,0,0.8)]">
                      <div className="space-y-10">
                        <h3 className="text-step--2 font-black uppercase tracking-[0.8em] text-white/20 border-b border-white/5 pb-8">SOURCE_ARTIFACTS</h3>
                        <ul className="space-y-8 md:space-y-12">
                            {project.links.map((link, i) => (
                                <li key={i}>
                                    <a href={link} target="_blank" rel="noreferrer" className="block text-step-0 font-bold truncate hover:text-[#00FFD1] transition-all group">
                                        <span className="text-step--2 opacity-20 block mb-3 tracking-[0.6em] font-mono uppercase">NODE_0{i+1}</span> 
                                        <span className="opacity-60 group-hover:opacity-100 group-hover:translate-x-2 inline-block transition-all">{link.replace('https://', '').replace('www.', '')} ↗</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                      </div>

                      <div className="pt-10 space-y-8">
                          <Button fullWidth variant="secondary" className="!py-6 md:!py-8 !rounded-2xl">Request audit</Button>
                          <p className="text-step--2 opacity-10 uppercase tracking-[0.8em] text-center font-black">CRYPTO_VERIFIED_PROOF</p>
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { TRACKS, SESSION_TIERS } from '../constants';
import { Track, User, WhatFailed } from '../types';
import { db } from '../db';

interface OnboardingProps {
  onComplete: (user: User) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    inviteCode: '',
    name: '',
    track: Track.ENGINEER,
    sessionPrice: 25,
    project: {
      title: '',
      problem: '',
      links: '',
      wrong: '',
      lessons: ''
    }
  });

  const next = () => {
    if (step === 0) {
      if (db.validateInvite(formData.inviteCode)) {
        setError('');
        setStep(1);
      } else {
        setError('Invalid Invite Code');
      }
    } else {
      setStep(s => s + 1);
    }
  };

  const handleFinish = () => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      track: formData.track,
      sessionPrice: formData.sessionPrice,
      microContracts: [],
      sessionsCompleted: 0,
      isVerified: false,
      inviteCode: formData.inviteCode,
      projects: [{
        id: Math.random().toString(36).substr(2, 9),
        userId: 'temp-id',
        userName: formData.name,
        userTrack: formData.track,
        title: formData.project.title,
        problem: formData.project.problem,
        outcomeDescription: 'Project Outcome',
        links: [formData.project.links],
        hardPart: formData.project.wrong,
        whatIdRedo: formData.project.lessons,
        whatFailed: {
          goal: formData.project.title,
          approach: 'Initial approach',
          wrong: formData.project.wrong,
          effect: 'Impact of error',
          lessons: formData.project.lessons,
          redone: 'Future fix'
        } as WhatFailed,
        timestamp: Date.now(),
        comments: [],
        peerReviewRequests: []
      }]
    };
    newUser.projects[0].userId = newUser.id;
    onComplete(newUser);
    navigate('/feed');
  };

  const revealClass = "reveal reveal-active";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center adaptive-padding overflow-y-auto pt-24 pb-12">
      {/* Dynamic Progress Bar */}
      <div className="fixed top-8 left-0 right-0 adaptive-padding z-50">
        <div className="max-w-2xl mx-auto flex gap-2 md:gap-4 h-1 md:h-1.5">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`flex-1 rounded-full transition-all duration-700 ${i <= step ? 'bg-[#00FFD1] shadow-[0_0_15px_rgba(0,255,209,0.2)]' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl">
        {step === 0 && (
          <div className={`text-center space-y-12 md:space-y-16 ${revealClass}`}>
            <h2 className="syne text-display-lg md:text-display-xl leading-none">INVITE.</h2>
            <p className="text-white/40 text-step-0 md:text-step-1 font-medium max-w-sm mx-auto">Access to MADE is restricted to active builders.</p>
            <div className="space-y-6 md:space-y-8 max-w-sm mx-auto">
              <input 
                className={`w-full bg-white/5 border-2 rounded-[2rem] py-6 md:py-10 text-center text-step-2 md:text-step-4 outline-none transition-all syne ${error ? 'border-red-500 text-red-500' : 'border-white/10 focus:border-[#00FFD1]'}`}
                placeholder="AUTH_KEY"
                value={formData.inviteCode}
                autoFocus
                onChange={e => { setFormData({...formData, inviteCode: e.target.value.toUpperCase()}); setError(''); }}
                onKeyPress={e => e.key === 'Enter' && next()}
              />
              {error && <p className="text-red-500 font-black uppercase tracking-[0.2em] text-step--2">{error}</p>}
              <Button onClick={next} fullWidth variant="hyper" size="lg" className="!rounded-full !text-step-0">Authorize Access</Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={`space-y-12 md:space-y-20 ${revealClass}`}>
            <h2 className="syne text-display-lg md:text-display-xl leading-none">IDENTITY.</h2>
            <div className="space-y-10 md:space-y-16">
              <div className="space-y-4">
                <label className="text-step--2 font-black uppercase tracking-[0.3em] text-white/30">Registry Name</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-step-1 md:text-step-2 outline-none focus:border-[#00FFD1] transition-all font-bold"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  autoFocus
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-step--2 font-black uppercase tracking-[0.3em] text-white/30">Core Track</label>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  {TRACKS.map(t => (
                    <button 
                      key={t.value}
                      onClick={() => setFormData({...formData, track: t.value as Track})}
                      className={`p-6 md:p-8 border rounded-2xl text-left transition-all duration-500 ${formData.track === t.value ? 'bg-[#00FFD1]/10 border-[#00FFD1]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                      <p className={`font-black text-step-1 md:text-step-2 tracking-tighter syne ${formData.track === t.value ? 'text-[#00FFD1]' : 'text-white'}`}>{t.label}</p>
                      <p className="text-step--1 md:text-step-0 text-white/40 mt-1 font-medium leading-tight">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={next} fullWidth variant="hyper" size="lg" className="!rounded-full" disabled={!formData.name}>Next Phase</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={`space-y-12 md:space-y-20 ${revealClass}`}>
            <div className="space-y-4">
              <h2 className="syne text-display-lg md:text-display-xl leading-none">PROOF.</h2>
              <p className="text-white/40 text-step-0 md:text-step-1 font-medium max-w-xl">Every entity must transmit at least one real artifact to the graph.</p>
            </div>
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4">
                <label className="text-step--2 font-black uppercase tracking-[0.3em] text-white/30">Artifact Title</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-step-1 md:text-step-2 outline-none focus:border-[#00FFD1] transition-all font-bold"
                  placeholder="EX: Neural Engine V1"
                  value={formData.project.title}
                  onChange={e => setFormData({...formData, project: {...formData.project, title: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-step--2 font-black uppercase tracking-[0.3em] text-white/30">Problem Autopsy</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-step-0 md:text-step-1 h-32 md:h-48 outline-none focus:border-[#00FFD1] transition-all font-medium resize-none leading-relaxed"
                  placeholder="Define the logic problem you solved..."
                  value={formData.project.problem}
                  onChange={e => setFormData({...formData, project: {...formData.project, problem: e.target.value}})}
                />
              </div>
              <div className="space-y-4">
                <label className="text-step--2 font-black uppercase tracking-[0.3em] text-white/30">Source URI</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 text-step-0 md:text-step-1 outline-none focus:border-[#00FFD1] transition-all font-mono"
                  placeholder="https://..."
                  value={formData.project.links}
                  onChange={e => setFormData({...formData, project: {...formData.project, links: e.target.value}})}
                />
              </div>
              <Button 
                onClick={next} 
                fullWidth 
                variant="hyper" 
                size="lg" 
                className="!rounded-full" 
                disabled={!formData.project.title || !formData.project.links}
              >
                Transmit Artifact
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={`text-center space-y-16 md:space-y-24 ${revealClass}`}>
            <div className="space-y-6">
              <h2 className="syne text-display-lg md:text-display-xl leading-none">MARKET.</h2>
              <p className="text-white/40 text-step-0 md:text-step-2 font-medium max-w-xl mx-auto leading-tight">Establish your technical audit rate.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 bg-white/5 p-4 md:p-6 rounded-[2.5rem]">
              {SESSION_TIERS.map(tier => (
                <button
                  key={tier}
                  onClick={() => setFormData({...formData, sessionPrice: tier})}
                  className={`flex-1 py-10 md:py-20 rounded-[2rem] transition-all duration-700 flex flex-row md:flex-col items-center justify-center gap-6 ${formData.sessionPrice === tier ? 'bg-[#00FFD1] text-black shadow-[0_20px_40px_rgba(0,255,209,0.2)]' : 'bg-black text-white/30 hover:bg-white/5'}`}
                >
                  <span className="text-step-3 md:text-step-5 font-black tabular-nums syne leading-none">${tier}</span>
                  <span className="text-step--2 font-black uppercase tracking-[0.3em] opacity-60">30 MIN</span>
                </button>
              ))}
            </div>
            <div className="space-y-8">
              <Button onClick={handleFinish} fullWidth variant="hyper" size="lg" className="!rounded-full !py-8 md:!py-10 !text-step-1 !syne">Initialize Seal</Button>
              <p className="text-step--2 font-black uppercase tracking-[0.5em] text-white/10">PROTOCOL_V1_VERIFIED</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
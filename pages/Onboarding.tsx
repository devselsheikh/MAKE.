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

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 md:p-6">
      <div className="fixed top-8 md:top-12 left-0 right-0 px-6 max-w-xl mx-auto flex gap-2 md:gap-3 h-1 md:h-1.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#00FFD1]' : 'bg-white/10'}`} />
        ))}
      </div>

      <div className="w-full max-w-2xl animate-reveal mobile-pt-24">
        {step === 0 && (
          <div className="text-center space-y-8 md:space-y-12">
            <h2 className="syne text-5xl md:text-8xl">INVITE.</h2>
            <p className="text-white/40 text-sm md:text-lg font-medium px-4">Access to MADE is restricted to active builders.</p>
            <div className="space-y-4 md:space-y-6 max-w-md mx-auto px-4">
              <input 
                className={`w-full bg-white/5 border-2 rounded-2xl py-6 md:py-8 text-center text-3xl md:text-4xl outline-none transition-all syne ${error ? 'border-red-500 text-red-500' : 'border-white/10 focus:border-[#00FFD1]'}`}
                placeholder="KEY"
                value={formData.inviteCode}
                onChange={e => { setFormData({...formData, inviteCode: e.target.value.toUpperCase()}); setError(''); }}
              />
              {error && <p className="text-red-500 font-bold uppercase tracking-widest text-[10px]">{error}</p>}
              <Button onClick={next} fullWidth variant="hyper" size="lg" className="!rounded-full py-6 md:py-8 !text-lg md:!text-xl">Authorize</Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-8 md:space-y-12 px-2">
            <h2 className="syne text-4xl md:text-7xl">IDENTITY.</h2>
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-2 md:space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30">Your Full Name</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 md:p-8 text-xl md:text-2xl outline-none focus:border-[#00FFD1] transition-all font-bold"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30">Your Field</label>
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  {TRACKS.map(t => (
                    <button 
                      key={t.value}
                      onClick={() => setFormData({...formData, track: t.value as Track})}
                      className={`p-4 md:p-6 border rounded-2xl text-left transition-all group ${formData.track === t.value ? 'bg-[#00FFD1]/10 border-[#00FFD1]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                    >
                      <p className={`font-bold text-lg md:text-xl uppercase tracking-tighter syne ${formData.track === t.value ? 'text-[#00FFD1]' : 'text-white'}`}>{t.label}</p>
                      <p className="text-[10px] md:text-sm text-white/40 mt-1 font-medium">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={next} fullWidth variant="hyper" size="lg" className="!rounded-full py-6 md:py-8" disabled={!formData.name}>Next</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 md:space-y-12 px-2">
            <div className="space-y-2 md:space-y-4">
              <h2 className="syne text-4xl md:text-7xl">PROOF.</h2>
              <p className="text-white/40 text-sm md:text-lg font-medium">You must share at least one real project to join.</p>
            </div>
            <div className="space-y-6 md:space-y-10">
              <div className="space-y-2 md:space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30">Project Name</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 text-lg md:text-xl outline-none focus:border-[#00FFD1] transition-all font-bold"
                  placeholder="EX: Neural Engine V1"
                  value={formData.project.title}
                  onChange={e => setFormData({...formData, project: {...formData.project, title: e.target.value}})}
                />
              </div>
              <div className="space-y-2 md:space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30">The Problem You Solved</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 text-sm md:text-lg h-24 md:h-32 outline-none focus:border-[#00FFD1] transition-all font-medium"
                  placeholder="I built this because..."
                  value={formData.project.problem}
                  onChange={e => setFormData({...formData, project: {...formData.project, problem: e.target.value}})}
                />
              </div>
              <div className="space-y-2 md:space-y-4">
                <label className="text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/30">Artifact Link</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 text-sm md:text-xl outline-none focus:border-[#00FFD1] transition-all"
                  placeholder="https://github.com/..."
                  value={formData.project.links}
                  onChange={e => setFormData({...formData, project: {...formData.project, links: e.target.value}})}
                />
              </div>
              <Button 
                onClick={next} 
                fullWidth 
                variant="hyper" 
                size="lg" 
                className="!rounded-full py-6 md:py-8" 
                disabled={!formData.project.title || !formData.project.links}
              >
                Submit Artifact
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-10 md:space-y-16 px-2">
            <div className="space-y-4">
              <h2 className="syne text-4xl md:text-8xl">MARKET.</h2>
              <p className="text-white/40 text-sm md:text-xl font-medium max-w-md mx-auto leading-relaxed">Your 30-minute expert rate?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 bg-white/5 p-2 md:p-4 rounded-3xl">
              {SESSION_TIERS.map(tier => (
                <button
                  key={tier}
                  onClick={() => setFormData({...formData, sessionPrice: tier})}
                  className={`flex-1 py-8 md:py-20 rounded-2xl transition-all flex flex-row md:flex-col items-center justify-center gap-4 ${formData.sessionPrice === tier ? 'bg-[#00FFD1] text-black' : 'bg-black text-white/40 hover:bg-white/5'}`}
                >
                  <span className="text-3xl md:text-6xl font-black tabular-nums syne">${tier}</span>
                  <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-50">30 MIN AUDIT</span>
                </button>
              ))}
            </div>
            <Button onClick={handleFinish} fullWidth variant="hyper" size="lg" className="!rounded-full py-8 md:py-10 !text-xl md:!text-2xl !syne">Initialize Seal</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
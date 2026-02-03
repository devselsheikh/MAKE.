
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import { User, Project, MicroContract, ContractStatus, Conversation, Message } from './types';
import { db } from './db';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('made_active_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [allProjects, setAllProjects] = useState<Project[]>(db.getProjects());
  const [allContracts, setAllContracts] = useState<MicroContract[]>(db.getContracts());
  const [conversations, setConversations] = useState<Conversation[]>(db.getConversations());

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('made_active_session', JSON.stringify(currentUser));
      db.saveUser(currentUser);
    } else {
      localStorage.removeItem('made_active_session');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleOnboardingComplete = (user: User) => {
    setCurrentUser(user);
    if (user.projects.length > 0) {
      db.addProject(user.projects[0]);
      setAllProjects(db.getProjects());
    }
  };

  const handleAddProject = (project: Project) => {
    db.addProject(project);
    setAllProjects(db.getProjects());
  };

  const handleAddComment = (projectId: string, comment: any) => {
    db.addComment(projectId, comment);
    setAllProjects(db.getProjects());
  };

  const handleRequestReview = (projectId: string, reviewer: { id: string, name: string }) => {
    const projects = db.getProjects();
    const pIdx = projects.findIndex(p => p.id === projectId);
    if (pIdx >= 0) {
      const newRequest = { 
        id: Math.random().toString(36).substr(2, 9), 
        reviewerId: reviewer.id, 
        reviewerName: reviewer.name, 
        status: 'pending' as const 
      };
      projects[pIdx].peerReviewRequests = [...(projects[pIdx].peerReviewRequests || []), newRequest];
      // Sync to DB
      const data = JSON.parse(localStorage.getItem('made_vault_v1') || '{}');
      data.projects = projects;
      localStorage.setItem('made_vault_v1', JSON.stringify(data));
      setAllProjects(projects);
    }
  };

  const handleAddMicroContract = (contract: MicroContract) => {
    db.addContract(contract);
    setAllContracts(db.getContracts());
  };

  const handleUpdateContract = (contractId: string, updates: Partial<MicroContract>) => {
    db.updateContract(contractId, updates);
    setAllContracts(db.getContracts());
    
    if (updates.status === ContractStatus.COMPLETED && currentUser) {
      const contract = allContracts.find(c => c.id === contractId);
      if (contract && contract.userId === currentUser.id) {
        setCurrentUser({ ...currentUser, sessionsCompleted: currentUser.sessionsCompleted + 1 });
      }
    }
  };

  const sendMessage = (toUserId: string, text: string) => {
    if (!currentUser) return;
    const participants = [currentUser.id, toUserId].sort();
    const convId = participants.join('-');
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: currentUser.id,
      text,
      timestamp: Date.now()
    };
    db.saveMessage(convId, participants, newMessage);
    setConversations(db.getConversations());
  };

  const allUsersSummary = [
    ...allProjects.map(p => ({ id: p.userId, name: p.userName })),
    ...db.getUsers().map(u => ({ id: u.id, name: u.name })),
    ...(currentUser ? [{ id: currentUser.id, name: currentUser.name }] : [])
  ].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#020202] text-[#F5F5F7] selection:bg-[#00FFD1] selection:text-black transition-all duration-700 ease-in-out">
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/login" element={<Login onLogin={setCurrentUser} />} />
          <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
          <Route 
            path="/feed" 
            element={<Feed projects={allProjects} user={currentUser} onLogout={handleLogout} />} 
          />
          <Route 
            path="/profile/:id" 
            element={<Profile 
              projects={allProjects} 
              contracts={allContracts}
              currentUser={currentUser} 
              onAddMicroContract={handleAddMicroContract}
              onUpdateContract={handleUpdateContract}
              conversations={conversations}
              onSendMessage={sendMessage}
              onLogout={handleLogout}
            />} 
          />
          <Route 
            path="/project/:id" 
            element={<ProjectDetail 
              projects={allProjects} 
              user={currentUser} 
              allUsers={allUsersSummary}
              onAddComment={handleAddComment} 
              onRemix={handleAddProject}
              onRequestReview={handleRequestReview}
              onLogout={handleLogout}
            />} 
          />
          <Route 
            path="/admin" 
            element={<Admin user={currentUser} onLogout={handleLogout} />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;

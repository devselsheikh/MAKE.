
import { User, Project } from '../types';

/**
 * Signal Score = Projects*1 + Sessions*3 + Comments*2 + Remixes*2
 */
export const calculateSignalScore = (user: Partial<User>, allProjects: Project[]): number => {
  const userProjects = allProjects.filter(p => p.userId === user.id);
  const projectsCount = userProjects.length;
  const sessionsCount = user.sessionsCompleted || 0;
  
  // Count comments written by this user across all projects
  const commentsCount = allProjects.reduce((acc, p) => {
    return acc + p.comments.filter(c => c.userId === user.id).length;
  }, 0);

  // Count how many times this user's projects have been remixed
  const remixesReceived = allProjects.reduce((acc, p) => {
    if (p.originalProjectId) {
      const original = allProjects.find(op => op.id === p.originalProjectId);
      if (original && original.userId === user.id) {
        return acc + 1;
      }
    }
    return acc;
  }, 0);

  const rawScore = (projectsCount * 1) + (sessionsCount * 3) + (commentsCount * 2) + (remixesReceived * 2);
  
  // Simple normalization for the sake of the demo (clamping to 0-100)
  return Math.min(100, rawScore);
};

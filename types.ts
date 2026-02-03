
export enum Track {
  ENGINEER = 'Engineer',
  DESIGNER = 'Designer',
  PRODUCT = 'Product',
  OTHER = 'Other'
}

export interface WhatFailed {
  goal: string;
  approach: string;
  wrong: string;
  effect: string;
  lessons: string;
  redone: string;
}

export enum ContractStatus {
  AVAILABLE = 'Available',
  ESCROW = 'In Escrow',
  DELIVERED = 'Delivered',
  COMPLETED = 'Completed'
}

export interface MicroContract {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  status: ContractStatus;
  buyerId?: string;
  buyerName?: string;
  deliveryNote?: string;
}

export interface PeerReviewRequest {
  id: string;
  reviewerId: string;
  reviewerName: string;
  status: 'pending' | 'completed';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string; // Typically "userId1-userId2"
  participants: string[];
  messages: Message[];
}

export interface User {
  id: string;
  name: string;
  university?: string;
  track: Track;
  sessionPrice: number;
  githubUrl?: string;
  figmaUrl?: string;
  profileImage?: string;
  projects: Project[];
  microContracts: MicroContract[];
  sessionsCompleted: number;
  isVerified: boolean;
  inviteCode?: string;
  isAdmin?: boolean;
}

export interface Project {
  id: string;
  userId: string;
  userName: string;
  userTrack: Track;
  title: string;
  problem: string;
  outcomeDescription: string;
  imageUrl?: string;
  links: string[];
  hardPart: string;
  whatIdRedo: string;
  whatFailed: WhatFailed;
  timestamp: number;
  comments: Comment[];
  originalProjectId?: string;
  remixReason?: string;
  peerReviewRequests: PeerReviewRequest[];
  isSpotlight?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

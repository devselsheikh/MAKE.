
import React from 'react';

export const COLORS = {
  black: '#050505',
  white: '#F5F5F7',
  accent: '#00FFD1', 
  secondary: '#7000FF',
  danger: '#FF4D4D',
  success: '#00FF85',
};

export const MANIFESTO_TEXT = {
  headline: "MADE — NOT CLAIMED.",
  intro: "LinkedIn is for talking. MADE is for building.",
  rejection: [
    "Resumes that lie",
    "Generic job titles",
    "Empty networking",
    "Pointless bios",
    "Status games"
  ],
  enforcement: [
    "Real work samples",
    "Honest explanations",
    "Transparent failures",
    "Direct feedback",
    "Earned reputation"
  ],
  closing: "Show us what you made."
};

export interface TrackDefinition {
  value: string;
  label: string;
  description: string;
}

export const TRACKS: TrackDefinition[] = [
  { 
    value: 'Engineer', 
    label: 'Engineering', 
    description: "You build systems, apps, or complex logic. You speak code." 
  },
  { 
    value: 'Designer', 
    label: 'Design', 
    description: "You build interfaces, brands, or visuals. You speak aesthetics." 
  },
  { 
    value: 'Product', 
    label: 'Product', 
    description: "You build strategies, roadmaps, and teams. You ship outcomes." 
  },
  { 
    value: 'Other', 
    label: 'Multidisciplinary', 
    description: "You build things that don't fit in a box. You do it all." 
  }
];

export const SESSION_TIERS = [10, 25, 50];

export const SYSTEM_LOGS = [
  "CONNECTING...",
  "VERIFYING INVITE...",
  "CREATING PROFILE...",
  "SYNCING WORK...",
  "DONE."
];

// Core data models based on specifications

export interface User {
  farcasterId: string;
  walletAddress?: string;
  skills: string[];
  preferences: UserPreferences;
  notificationSettings: NotificationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  location?: string;
  minRate?: number;
  maxRate?: number;
  workType: 'remote' | 'onsite' | 'hybrid' | 'any';
  availability: 'full-time' | 'part-time' | 'contract' | 'any';
}

export interface NotificationSettings {
  emailAlerts: boolean;
  pushNotifications: boolean;
  farcasterNotifications: boolean;
  alertFrequency: 'immediate' | 'daily' | 'weekly';
}

export interface Gig {
  id: string;
  externalId: string;
  title: string;
  description: string;
  platform: 'upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'other';
  skillsRequired: string[];
  url: string;
  postedDate: Date;
  location?: string;
  rate?: {
    min: number;
    max: number;
    type: 'hourly' | 'fixed' | 'monthly';
  };
  matchScore?: number;
}

export interface Application {
  id: string;
  userId: string;
  gigId: string;
  applicationDate: Date;
  status: 'applied' | 'interviewing' | 'rejected' | 'hired' | 'withdrawn';
  notes?: string;
  url?: string;
  followUpDate?: Date;
}

export interface GigMatch {
  gig: Gig;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
}

// Component prop types
export interface GigCardProps {
  gig: Gig;
  variant?: 'default' | 'applied';
  onApply?: (gig: Gig) => void;
  onViewDetails?: (gig: Gig) => void;
  application?: Application;
}

export interface ProfileFormProps {
  user?: Partial<User>;
  variant?: 'edit';
  onSave?: (userData: Partial<User>) => void;
  onCancel?: () => void;
}

export interface NotificationToggleProps {
  enabled: boolean;
  variant?: 'on' | 'off';
  onChange?: (enabled: boolean) => void;
  label?: string;
}

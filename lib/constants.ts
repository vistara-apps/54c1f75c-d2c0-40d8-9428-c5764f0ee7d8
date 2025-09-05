export const PLATFORMS = {
  UPWORK: 'upwork',
  FIVERR: 'fiverr',
  FREELANCER: 'freelancer',
  TOPTAL: 'toptal',
  OTHER: 'other',
} as const;

export const APPLICATION_STATUSES = {
  APPLIED: 'applied',
  INTERVIEWING: 'interviewing',
  REJECTED: 'rejected',
  HIRED: 'hired',
  WITHDRAWN: 'withdrawn',
} as const;

export const WORK_TYPES = {
  REMOTE: 'remote',
  ONSITE: 'onsite',
  HYBRID: 'hybrid',
  ANY: 'any',
} as const;

export const AVAILABILITY_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  ANY: 'any',
} as const;

export const RATE_TYPES = {
  HOURLY: 'hourly',
  FIXED: 'fixed',
  MONTHLY: 'monthly',
} as const;

export const ALERT_FREQUENCIES = {
  IMMEDIATE: 'immediate',
  DAILY: 'daily',
  WEEKLY: 'weekly',
} as const;

export const COMMON_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'PHP',
  'WordPress',
  'Shopify',
  'Figma',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Copywriting',
  'SEO',
  'Digital Marketing',
  'Social Media Marketing',
  'Video Editing',
  'Animation',
  '3D Modeling',
  'Data Analysis',
  'Machine Learning',
  'Mobile App Development',
  'iOS Development',
  'Android Development',
  'Flutter',
  'React Native',
  'DevOps',
  'AWS',
  'Google Cloud',
  'Docker',
  'Kubernetes',
];

export const PLATFORM_COLORS = {
  [PLATFORMS.UPWORK]: 'bg-green-100 text-green-800',
  [PLATFORMS.FIVERR]: 'bg-green-100 text-green-800',
  [PLATFORMS.FREELANCER]: 'bg-blue-100 text-blue-800',
  [PLATFORMS.TOPTAL]: 'bg-purple-100 text-purple-800',
  [PLATFORMS.OTHER]: 'bg-gray-100 text-gray-800',
};

export const STATUS_COLORS = {
  [APPLICATION_STATUSES.APPLIED]: 'bg-blue-100 text-blue-800',
  [APPLICATION_STATUSES.INTERVIEWING]: 'bg-yellow-100 text-yellow-800',
  [APPLICATION_STATUSES.REJECTED]: 'bg-red-100 text-red-800',
  [APPLICATION_STATUSES.HIRED]: 'bg-green-100 text-green-800',
  [APPLICATION_STATUSES.WITHDRAWN]: 'bg-gray-100 text-gray-800',
};

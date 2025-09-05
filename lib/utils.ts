import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

export function calculateMatchScore(userSkills: string[], gigSkills: string[]): number {
  if (gigSkills.length === 0) return 0;
  
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase().trim());
  const normalizedGigSkills = gigSkills.map(skill => skill.toLowerCase().trim());
  
  const matchingSkills = normalizedGigSkills.filter(skill => 
    normalizedUserSkills.some(userSkill => 
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );
  
  return Math.round((matchingSkills.length / normalizedGigSkills.length) * 100);
}

export function getMatchingSkills(userSkills: string[], gigSkills: string[]): string[] {
  const normalizedUserSkills = userSkills.map(skill => skill.toLowerCase().trim());
  const normalizedGigSkills = gigSkills.map(skill => skill.toLowerCase().trim());
  
  return gigSkills.filter(skill => 
    normalizedUserSkills.some(userSkill => 
      userSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(userSkill.toLowerCase())
    )
  );
}

export function getMissingSkills(userSkills: string[], gigSkills: string[]): string[] {
  const matchingSkills = getMatchingSkills(userSkills, gigSkills);
  return gigSkills.filter(skill => !matchingSkills.includes(skill));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

export function formatRate(rate: { min: number; max: number; type: string }): string {
  const { min, max, type } = rate;
  const currency = '$';
  
  if (min === max) {
    return `${currency}${min}/${type === 'hourly' ? 'hr' : type}`;
  }
  
  return `${currency}${min}-${max}/${type === 'hourly' ? 'hr' : type}`;
}

'use client';

import { useState, useEffect } from 'react';
import { Plus, X, Save, User, MapPin, DollarSign } from 'lucide-react';
import { User as UserType, UserPreferences, NotificationSettings } from '@/lib/types';
import { COMMON_SKILLS, WORK_TYPES, AVAILABILITY_TYPES, ALERT_FREQUENCIES } from '@/lib/constants';

interface ProfileFormProps {
  user?: Partial<UserType>;
  variant?: 'edit';
  onSave?: (userData: Partial<UserType>) => void;
  onCancel?: () => void;
}

export function ProfileForm({ user, variant = 'edit', onSave, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState<Partial<UserType>>({
    skills: [],
    preferences: {
      location: '',
      minRate: 0,
      maxRate: 0,
      workType: 'any',
      availability: 'any',
    },
    notificationSettings: {
      emailAlerts: true,
      pushNotifications: true,
      farcasterNotifications: true,
      alertFrequency: 'immediate',
    },
    ...user,
  });

  const [newSkill, setNewSkill] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredSkills = COMMON_SKILLS.filter(skill => 
    skill.toLowerCase().includes(newSkill.toLowerCase()) &&
    !formData.skills?.includes(skill)
  );

  const handleAddSkill = (skill: string) => {
    if (skill && !formData.skills?.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }));
      setNewSkill('');
      setShowSkillSuggestions(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || [],
    }));
  };

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        location: prev.preferences?.location,
        minRate: prev.preferences?.minRate,
        maxRate: prev.preferences?.maxRate,
        workType: prev.preferences?.workType ?? 'any',
        availability: prev.preferences?.availability ?? 'any',
        [key]: value,
      },
    }));
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: any) => {
    setFormData(prev => ({
      ...prev,
      notificationSettings: {
        emailAlerts: prev.notificationSettings?.emailAlerts ?? true,
        pushNotifications: prev.notificationSettings?.pushNotifications ?? true,
        farcasterNotifications: prev.notificationSettings?.farcasterNotifications ?? true,
        alertFrequency: prev.notificationSettings?.alertFrequency ?? 'immediate',
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!onSave || isSaving) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Skills Section */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-textPrimary">Skills & Expertise</h3>
        </div>

        {/* Current Skills */}
        {formData.skills && formData.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-lg"
                >
                  <span className="text-sm font-medium">{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:bg-primary hover:bg-opacity-20 rounded-full p-1 transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add New Skill */}
        <div className="relative">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                setShowSkillSuggestions(e.target.value.length > 0);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(newSkill);
                }
              }}
              placeholder="Add a skill..."
              className="input-field flex-1"
            />
            <button
              onClick={() => handleAddSkill(newSkill)}
              className="btn-primary px-4"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Skill Suggestions */}
          {showSkillSuggestions && filteredSkills.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-gray-200 rounded-lg shadow-hover z-10 max-h-48 overflow-y-auto">
              {filteredSkills.slice(0, 8).map((skill, index) => (
                <button
                  key={index}
                  onClick={() => handleAddSkill(skill)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                >
                  {skill}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preferences Section */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-textPrimary">Work Preferences</h3>
        </div>

        <div className="space-y-4">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Preferred Location
            </label>
            <input
              type="text"
              value={formData.preferences?.location || ''}
              onChange={(e) => handlePreferenceChange('location', e.target.value)}
              placeholder="e.g., Remote, New York, London"
              className="input-field"
            />
          </div>

          {/* Rate Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Min Rate ($/hr)
              </label>
              <input
                type="number"
                value={formData.preferences?.minRate || ''}
                onChange={(e) => handlePreferenceChange('minRate', parseInt(e.target.value) || 0)}
                placeholder="25"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textPrimary mb-2">
                Max Rate ($/hr)
              </label>
              <input
                type="number"
                value={formData.preferences?.maxRate || ''}
                onChange={(e) => handlePreferenceChange('maxRate', parseInt(e.target.value) || 0)}
                placeholder="100"
                className="input-field"
              />
            </div>
          </div>

          {/* Work Type */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Work Type
            </label>
            <select
              value={formData.preferences?.workType || 'any'}
              onChange={(e) => handlePreferenceChange('workType', e.target.value)}
              className="input-field"
            >
              <option value="any">Any</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Availability
            </label>
            <select
              value={formData.preferences?.availability || 'any'}
              onChange={(e) => handlePreferenceChange('availability', e.target.value)}
              className="input-field"
            >
              <option value="any">Any</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-textPrimary">Notification Settings</h3>
        </div>

        <div className="space-y-4">
          {/* Alert Types */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-textPrimary">Email Alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notificationSettings?.emailAlerts || false}
                  onChange={(e) => handleNotificationChange('emailAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-textPrimary">Push Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notificationSettings?.pushNotifications || false}
                  onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-textPrimary">Farcaster Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notificationSettings?.farcasterNotifications || false}
                  onChange={(e) => handleNotificationChange('farcasterNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Alert Frequency */}
          <div>
            <label className="block text-sm font-medium text-textPrimary mb-2">
              Alert Frequency
            </label>
            <select
              value={formData.notificationSettings?.alertFrequency || 'immediate'}
              onChange={(e) => handleNotificationChange('alertFrequency', e.target.value)}
              className="input-field"
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}

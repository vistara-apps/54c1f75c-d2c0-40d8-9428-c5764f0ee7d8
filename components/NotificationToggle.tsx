'use client';

import { Bell, BellOff } from 'lucide-react';

interface NotificationToggleProps {
  enabled: boolean;
  variant?: 'on' | 'off';
  onChange?: (enabled: boolean) => void;
  label?: string;
}

export function NotificationToggle({ 
  enabled, 
  variant, 
  onChange, 
  label = 'Notifications' 
}: NotificationToggleProps) {
  const handleToggle = () => {
    if (onChange) {
      onChange(!enabled);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3">
        {enabled ? (
          <Bell className="w-5 h-5 text-primary" />
        ) : (
          <BellOff className="w-5 h-5 text-textSecondary" />
        )}
        <div>
          <span className="text-sm font-medium text-textPrimary">{label}</span>
          <p className="text-xs text-textSecondary">
            {enabled ? 'You\'ll receive gig alerts' : 'Gig alerts are disabled'}
          </p>
        </div>
      </div>

      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleToggle}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary peer-focus:ring-opacity-25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
  );
}

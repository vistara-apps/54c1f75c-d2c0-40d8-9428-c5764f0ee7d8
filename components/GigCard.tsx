'use client';

import { useState } from 'react';
import { ExternalLink, MapPin, Clock, DollarSign, Star, CheckCircle } from 'lucide-react';
import { Gig, Application } from '@/lib/types';
import { formatRelativeTime, formatRate, truncateText } from '@/lib/utils';
import { PLATFORM_COLORS, STATUS_COLORS } from '@/lib/constants';

interface GigCardProps {
  gig: Gig;
  variant?: 'default' | 'applied';
  onApply?: (gig: Gig) => void;
  onViewDetails?: (gig: Gig) => void;
  application?: Application;
}

export function GigCard({ 
  gig, 
  variant = 'default', 
  onApply, 
  onViewDetails,
  application 
}: GigCardProps) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!onApply || isApplying) return;
    
    setIsApplying(true);
    try {
      await onApply(gig);
    } finally {
      setIsApplying(false);
    }
  };

  const handleViewGig = () => {
    window.open(gig.url, '_blank', 'noopener,noreferrer');
  };

  const isApplied = variant === 'applied' || application;

  return (
    <div className="card hover:shadow-hover transition-all duration-200 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-textPrimary mb-2 leading-tight">
            {gig.title}
          </h3>
          
          {/* Platform Badge */}
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
            PLATFORM_COLORS[gig.platform] || PLATFORM_COLORS.other
          }`}>
            {gig.platform.charAt(0).toUpperCase() + gig.platform.slice(1)}
          </span>
        </div>

        {/* Match Score */}
        {gig.matchScore && (
          <div className="flex items-center space-x-1 bg-accent bg-opacity-20 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              {gig.matchScore}% match
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-base leading-7 text-textSecondary mb-4">
        {truncateText(gig.description, 150)}
      </p>

      {/* Skills */}
      {gig.skillsRequired.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {gig.skillsRequired.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary bg-opacity-10 text-primary"
              >
                {skill}
              </span>
            ))}
            {gig.skillsRequired.length > 4 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-textSecondary">
                +{gig.skillsRequired.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center space-x-4 text-sm text-textSecondary mb-4">
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{formatRelativeTime(gig.postedDate)}</span>
        </div>
        
        {gig.location && (
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{gig.location}</span>
          </div>
        )}
        
        {gig.rate && (
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>{formatRate(gig.rate)}</span>
          </div>
        )}
      </div>

      {/* Application Status */}
      {application && (
        <div className="mb-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-textPrimary">Applied</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                STATUS_COLORS[application.status]
              }`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>
            <span className="text-xs text-textSecondary">
              {formatRelativeTime(application.applicationDate)}
            </span>
          </div>
          
          {application.notes && (
            <p className="text-sm text-textSecondary mt-2 italic">
              "{application.notes}"
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={handleViewGig}
          className="flex-1 flex items-center justify-center space-x-2 btn-secondary"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Gig</span>
        </button>
        
        {!isApplied && onApply && (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? 'Applying...' : 'Apply Now'}
          </button>
        )}
        
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(gig)}
            className="px-4 py-2 text-primary hover:bg-primary hover:bg-opacity-10 rounded-lg transition-colors duration-200"
          >
            Details
          </button>
        )}
      </div>
    </div>
  );
}

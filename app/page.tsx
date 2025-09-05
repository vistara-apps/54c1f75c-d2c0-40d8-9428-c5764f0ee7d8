'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/AppShell';
import { GigCard } from '@/components/GigCard';
import { ProfileForm } from '@/components/ProfileForm';
import { NotificationToggle } from '@/components/NotificationToggle';
import { Gig, User, Application } from '@/lib/types';
import { calculateMatchScore } from '@/lib/utils';
import { Search, Filter, Plus, TrendingUp, Clock, CheckCircle } from 'lucide-react';

// Mock data for demonstration
const mockGigs: Gig[] = [
  {
    id: '1',
    externalId: 'upwork-123',
    title: 'React Developer for E-commerce Platform',
    description: 'We are looking for an experienced React developer to help build a modern e-commerce platform. You will work with our team to create responsive, user-friendly interfaces using React, TypeScript, and Tailwind CSS. Experience with Next.js and payment integrations is a plus.',
    platform: 'upwork',
    skillsRequired: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
    url: 'https://upwork.com/job/123',
    postedDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    location: 'Remote',
    rate: { min: 40, max: 60, type: 'hourly' },
  },
  {
    id: '2',
    externalId: 'fiverr-456',
    title: 'UI/UX Designer for Mobile App',
    description: 'Looking for a talented UI/UX designer to create beautiful, intuitive designs for our mobile application. You should have experience with Figma, user research, and mobile design patterns. Portfolio review required.',
    platform: 'fiverr',
    skillsRequired: ['UI/UX Design', 'Figma', 'Mobile Design', 'User Research'],
    url: 'https://fiverr.com/gig/456',
    postedDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    location: 'Remote',
    rate: { min: 500, max: 1500, type: 'fixed' },
  },
  {
    id: '3',
    externalId: 'freelancer-789',
    title: 'Content Writer for Tech Blog',
    description: 'We need a skilled content writer to create engaging articles for our technology blog. Topics include web development, AI, blockchain, and startup culture. SEO knowledge and technical writing experience preferred.',
    platform: 'freelancer',
    skillsRequired: ['Content Writing', 'SEO', 'Technical Writing', 'Copywriting'],
    url: 'https://freelancer.com/project/789',
    postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    location: 'Remote',
    rate: { min: 25, max: 40, type: 'hourly' },
  },
];

const mockUser: Partial<User> = {
  farcasterId: 'user123',
  skills: ['React', 'TypeScript', 'Node.js', 'UI/UX Design'],
  preferences: {
    location: 'Remote',
    minRate: 30,
    maxRate: 80,
    workType: 'remote',
    availability: 'part-time',
  },
  notificationSettings: {
    emailAlerts: true,
    pushNotifications: true,
    farcasterNotifications: true,
    alertFrequency: 'immediate',
  },
};

const mockApplications: Application[] = [
  {
    id: 'app1',
    userId: 'user123',
    gigId: '2',
    applicationDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    status: 'applied',
    notes: 'Excited to work on this mobile app design project!',
  },
];

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [currentView, setCurrentView] = useState<'gigs' | 'profile' | 'applications'>('gigs');
  const [user, setUser] = useState<Partial<User>>(mockUser);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setFrameReady();
    
    // Simulate loading and calculate match scores
    setTimeout(() => {
      const gigsWithScores = mockGigs.map(gig => ({
        ...gig,
        matchScore: calculateMatchScore(user.skills || [], gig.skillsRequired),
      })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      setGigs(gigsWithScores);
      setIsLoading(false);
    }, 1000);
  }, [setFrameReady, user.skills]);

  const handleApplyToGig = async (gig: Gig) => {
    // Simulate application process
    const newApplication: Application = {
      id: `app_${Date.now()}`,
      userId: user.farcasterId || 'user123',
      gigId: gig.id,
      applicationDate: new Date(),
      status: 'applied',
      notes: `Applied to ${gig.title}`,
    };

    setApplications(prev => [...prev, newApplication]);
    
    // Show success message (in a real app, this would be a toast notification)
    alert('Application submitted successfully!');
  };

  const handleSaveProfile = async (userData: Partial<User>) => {
    setUser(userData);
    setCurrentView('gigs');
    
    // Recalculate match scores with new skills
    const updatedGigs = gigs.map(gig => ({
      ...gig,
      matchScore: calculateMatchScore(userData.skills || [], gig.skillsRequired),
    })).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
    setGigs(updatedGigs);
  };

  const filteredGigs = gigs.filter(gig =>
    gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gig.skillsRequired.some(skill => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const appliedGigs = gigs.filter(gig => 
    applications.some(app => app.gigId === gig.id)
  );

  const stats = {
    totalGigs: gigs.length,
    matchingGigs: gigs.filter(gig => (gig.matchScore || 0) > 50).length,
    appliedGigs: applications.length,
    responseRate: applications.length > 0 ? Math.round((applications.filter(app => app.status !== 'applied').length / applications.length) * 100) : 0,
  };

  if (currentView === 'profile') {
    return (
      <AppShell 
        title="Profile Settings" 
        showBack 
        onBack={() => setCurrentView('gigs')}
      >
        <ProfileForm
          user={user}
          onSave={handleSaveProfile}
          onCancel={() => setCurrentView('gigs')}
        />
      </AppShell>
    );
  }

  if (currentView === 'applications') {
    return (
      <AppShell 
        title="My Applications" 
        showBack 
        onBack={() => setCurrentView('gigs')}
      >
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card text-center">
              <div className="text-2xl font-bold text-primary">{applications.length}</div>
              <div className="text-sm text-textSecondary">Total Applied</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-accent">{stats.responseRate}%</div>
              <div className="text-sm text-textSecondary">Response Rate</div>
            </div>
          </div>

          {/* Applied Gigs */}
          <div className="space-y-4">
            {appliedGigs.length > 0 ? (
              appliedGigs.map(gig => {
                const application = applications.find(app => app.gigId === gig.id);
                return (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    variant="applied"
                    application={application}
                  />
                );
              })
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-textSecondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-textPrimary mb-2">No Applications Yet</h3>
                <p className="text-textSecondary mb-4">Start applying to gigs to track your progress here.</p>
                <button
                  onClick={() => setCurrentView('gigs')}
                  className="btn-primary"
                >
                  Browse Gigs
                </button>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell 
      title="GigFlow"
      actions={
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentView('profile')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Plus className="w-5 h-5 text-textSecondary" />
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-semibold text-textPrimary mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-textSecondary mb-4">
            {stats.matchingGigs} new gigs match your skills
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-primary">{stats.totalGigs}</div>
              <div className="text-xs text-textSecondary">Available</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{stats.matchingGigs}</div>
              <div className="text-xs text-textSecondary">Matching</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{stats.appliedGigs}</div>
              <div className="text-xs text-textSecondary">Applied</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setCurrentView('applications')}
            className="card hover:shadow-hover transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-textPrimary">Applications</div>
                <div className="text-sm text-textSecondary">{applications.length} active</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setCurrentView('profile')}
            className="card hover:shadow-hover transition-all duration-200 text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent bg-opacity-10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="font-semibold text-textPrimary">Profile</div>
                <div className="text-sm text-textSecondary">{user.skills?.length || 0} skills</div>
              </div>
            </div>
          </button>
        </div>

        {/* Notifications Toggle */}
        <NotificationToggle
          enabled={user.notificationSettings?.farcasterNotifications || false}
          label="Gig Alerts"
          onChange={(enabled) => {
            setUser(prev => ({
              ...prev,
              notificationSettings: {
                emailAlerts: prev.notificationSettings?.emailAlerts ?? true,
                pushNotifications: prev.notificationSettings?.pushNotifications ?? true,
                alertFrequency: prev.notificationSettings?.alertFrequency ?? 'immediate',
                farcasterNotifications: enabled,
              },
            }));
          }}
        />

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-textSecondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gigs..."
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary px-4 ${showFilters ? 'bg-primary text-white' : ''}`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {showFilters && (
            <div className="card animate-slide-up">
              <h4 className="font-semibold text-textPrimary mb-3">Filters</h4>
              <div className="grid grid-cols-2 gap-4">
                <select className="input-field">
                  <option>All Platforms</option>
                  <option>Upwork</option>
                  <option>Fiverr</option>
                  <option>Freelancer</option>
                </select>
                <select className="input-field">
                  <option>All Rates</option>
                  <option>$0-25/hr</option>
                  <option>$25-50/hr</option>
                  <option>$50+/hr</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Gigs List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-textPrimary">
              Recommended Gigs ({filteredGigs.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="card animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex space-x-3">
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGigs.length > 0 ? (
            <div className="space-y-4">
              {filteredGigs.map(gig => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  onApply={handleApplyToGig}
                  application={applications.find(app => app.gigId === gig.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-textSecondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-textPrimary mb-2">No Gigs Found</h3>
              <p className="text-textSecondary mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new opportunities'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

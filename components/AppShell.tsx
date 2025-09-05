'use client';

import { ReactNode } from 'react';
import { ArrowLeft, Bell, Settings2, User } from 'lucide-react';
import { ConnectWallet, Wallet } from '@coinbase/onchainkit/wallet';
import { Name, Avatar } from '@coinbase/onchainkit/identity';

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: ReactNode;
}

export function AppShell({ 
  children, 
  title = 'GigFlow', 
  showBack = false, 
  onBack,
  actions 
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              {showBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-textSecondary" />
                </button>
              )}
              <h1 className="text-2xl font-semibold text-textPrimary">{title}</h1>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {actions}
              
              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 relative">
                <Bell className="w-5 h-5 text-textSecondary" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></span>
              </button>

              {/* Wallet Connection */}
              <Wallet>
                <ConnectWallet>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                    <Avatar className="w-6 h-6" />
                    <Name className="font-medium" />
                  </div>
                </ConnectWallet>
              </Wallet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <button className="flex flex-col items-center space-y-1 p-2 text-primary">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="text-xs font-medium">Gigs</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 p-2 text-textSecondary hover:text-primary transition-colors duration-200">
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 p-2 text-textSecondary hover:text-primary transition-colors duration-200">
            <Settings2 className="w-6 h-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
}

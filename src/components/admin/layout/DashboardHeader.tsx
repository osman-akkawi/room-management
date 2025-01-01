import React from 'react';
import { useAuth } from '../../../lib/auth';
import { UserProfile } from './header/UserProfile';

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 z-30">
      <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-end">
        <UserProfile user={user} />
      </div>
    </header>
  );
};
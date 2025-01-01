import React from 'react';
import { User } from '@supabase/supabase-js';

interface UserProfileProps {
  user: User | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
          {user.email?.[0].toUpperCase()}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">{user.email}</span>
        <span className="text-xs text-gray-500">Administrator</span>
      </div>
    </div>
  );
};
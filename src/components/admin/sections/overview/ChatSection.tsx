import React from 'react';
import { ChatBot } from '../../chat/ChatBot';

export const ChatSection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Assistant</h2>
        <p className="text-sm text-gray-500">Get help with managing rooms and schedules</p>
      </div>
      <ChatBot />
    </div>
  );
};
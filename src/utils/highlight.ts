import React from 'react';

export const highlightText = (text: string, searchQuery: string): React.ReactNode => {
  if (!searchQuery || !text) return text;
  
  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
  
  return parts.map((part, index) => 
    part.toLowerCase() === searchQuery.toLowerCase() ? (
      React.createElement('span', {
        key: index,
        className: 'bg-red-200 text-red-900 px-1 rounded'
      }, part)
    ) : part
  );
};
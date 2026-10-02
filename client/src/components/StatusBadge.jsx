import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s) {
      case 'New':
        return 'badge-new';
      case 'Contacted':
        return 'badge-contacted';
      case 'Converted':
        return 'badge-converted';
      default:
        return 'badge-new';
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {status || 'New'}
    </span>
  );
};

import React from 'react';

interface BadgeProps {
  text: string;
  color: 'red' | 'amber' | 'green' | 'blue' | 'gray';
}

const Badge: React.FC<BadgeProps> = ({ text, color }) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-800',
    amber: 'bg-amber-100 text-amber-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {text}
    </span>
  );
};

export default Badge;
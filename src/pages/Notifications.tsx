import React from 'react';
import NotificationList from '../components/notifications/NotificationList';

const Notifications: React.FC = () => {
  return (
    <div className="h-full bg-white rounded-lg shadow overflow-hidden">
      <NotificationList />
    </div>
  );
};

export default Notifications;
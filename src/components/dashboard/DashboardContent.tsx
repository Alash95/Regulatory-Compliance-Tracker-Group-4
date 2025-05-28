import React from 'react';
import UpdateList from '../updates/UpdateList';
import NotificationList from '../notifications/NotificationList';

const DashboardContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <UpdateList />
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <NotificationList />
      </div>
    </div>
  );
};

export default DashboardContent;
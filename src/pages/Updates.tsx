import React from 'react';
import UpdateList from '../components/updates/UpdateList';

const Updates: React.FC = () => {
  return (
    <div className="h-full bg-white rounded-lg shadow overflow-hidden">
      <UpdateList />
    </div>
  );
};

export default Updates;
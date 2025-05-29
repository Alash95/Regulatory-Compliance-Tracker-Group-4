import React from 'react';
import UpdateCard from './UpdateCard';
import { mockUpdates } from '../../data/mockData';

const UpdateList: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 p-4 bg-white">
        <h2 className="text-lg font-medium text-gray-900">Recent Regulatory Updates</h2>
        <p className="mt-1 text-sm text-gray-500">
          Stay informed about the latest changes in regulations
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockUpdates.map((update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </div>
    </div>
  );
};

export default UpdateList;
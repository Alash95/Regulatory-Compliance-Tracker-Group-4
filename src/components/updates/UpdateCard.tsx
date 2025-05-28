import React from 'react';
import { Calendar } from 'lucide-react';
import { RegulationUpdate } from '../../types';
import Badge from '../ui/Badge';

interface UpdateCardProps {
  update: RegulationUpdate;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{update.title}</h3>
          <Badge 
            text={update.urgency} 
            color={update.urgency === 'High' ? 'red' : 'amber'}
          />
        </div>
        
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{update.summary}</p>
        
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
          <span>{update.date}</span>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-150"
        >
          View full update &rarr;
        </a>
      </div>
    </div>
  );
};

export default UpdateCard;
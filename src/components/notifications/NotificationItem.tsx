import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Flag, FileText } from 'lucide-react';
import { Notification } from '../../types';
import Badge from '../ui/Badge';

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'flagged_account':
        return <Flag className="h-5 w-5 text-red-500" />;
      case 'policy_change':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'deadline':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'risk_alert':
        return <AlertTriangle className="h-5 w-5 text-purple-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getRiskColor = (risk: string): 'red' | 'amber' | 'green' => {
    switch (risk) {
      case 'High':
        return 'red';
      case 'Medium':
        return 'amber';
      case 'Low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <li className={`relative hover:bg-gray-50 transition-colors duration-150 ease-in-out ${
      notification.isRead ? 'opacity-75' : ''
    }`}>
      <div className="px-4 py-4 sm:px-6 cursor-pointer">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {notification.title}
              </p>
              <div className="flex items-center space-x-2">
                <Badge 
                  text={notification.riskLevel} 
                  color={getRiskColor(notification.riskLevel)}
                />
                <span className="text-sm text-gray-400">{notification.time}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge text={notification.domain} color="blue" />
              {notification.affectedTeams.map(team => (
                <Badge key={team} text={team} color="gray" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
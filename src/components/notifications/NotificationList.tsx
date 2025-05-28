import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { mockNotifications } from '../../data/mockData';
import { NotificationType, RiskLevel, Domain, Team } from '../../types';

const NotificationList: React.FC = () => {
  const [selectedType, setSelectedType] = useState<NotificationType | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'all'>('all');
  const [selectedTeam, setSelectedTeam] = useState<Team | 'all'>('all');

  const filteredNotifications = mockNotifications.filter(notification => {
    if (selectedType !== 'all' && notification.type !== selectedType) return false;
    if (selectedRisk !== 'all' && notification.riskLevel !== selectedRisk) return false;
    if (selectedDomain !== 'all' && notification.domain !== selectedDomain) return false;
    if (selectedTeam !== 'all' && !notification.affectedTeams.includes(selectedTeam)) return false;
    return true;
  });

  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const key = notification.type;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(notification);
    return groups;
  }, {} as Record<NotificationType, typeof mockNotifications>);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            <p className="mt-1 text-sm text-gray-500">
              Important alerts regarding your compliance status
            </p>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Filter className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as NotificationType | 'all')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full"
          >
            <option value="all">All Types</option>
            <option value="flagged_account">Flagged Accounts</option>
            <option value="policy_change">Policy Changes</option>
            <option value="deadline">Deadlines</option>
            <option value="risk_alert">Risk Alerts</option>
          </select>

          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value as RiskLevel | 'all')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full"
          >
            <option value="all">All Risks</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value as Domain | 'all')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full"
          >
            <option value="all">All Domains</option>
            <option value="KYC">KYC</option>
            <option value="AML">AML</option>
            <option value="Data_Protection">Data Protection</option>
            <option value="Licensing">Licensing</option>
            <option value="General">General</option>
          </select>

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value as Team | 'all')}
            className="px-3 py-1 text-sm border border-gray-300 rounded-full"
          >
            <option value="all">All Teams</option>
            <option value="Legal">Legal</option>
            <option value="Finance">Finance</option>
            <option value="Product">Product</option>
            <option value="Compliance">Compliance</option>
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedNotifications).map(([type, notifications]) => (
          <div key={type} className="border-b border-gray-200">
            <div className="bg-gray-50 px-4 py-2">
              <h3 className="text-sm font-medium text-gray-700">
                {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <NotificationItem 
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
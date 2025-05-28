import React from 'react';
import { Bell, Lock, User, Globe, Clock } from 'lucide-react';

const Settings: React.FC = () => {
  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: <User className="h-5 w-5" />,
      settings: [
        { name: 'Update Profile Information', description: 'Change your name, email, and other details' },
        { name: 'Change Password', description: 'Update your account password' },
      ],
    },
    {
      title: 'Notification Preferences',
      icon: <Bell className="h-5 w-5" />,
      settings: [
        { name: 'Email Notifications', description: 'Configure email alert settings' },
        { name: 'Push Notifications', description: 'Manage desktop notifications' },
      ],
    },
    {
      title: 'Security Settings',
      icon: <Lock className="h-5 w-5" />,
      settings: [
        { name: 'Two-Factor Authentication', description: 'Enable additional security measures' },
        { name: 'Session Management', description: 'View and manage active sessions' },
      ],
    },
    {
      title: 'Regional Settings',
      icon: <Globe className="h-5 w-5" />,
      settings: [
        { name: 'Language', description: 'Choose your preferred language' },
        { name: 'Time Zone', description: 'Set your local time zone' },
      ],
    },
    {
      title: 'Compliance Settings',
      icon: <Clock className="h-5 w-5" />,
      settings: [
        { name: 'Update Frequency', description: 'Set how often you receive regulatory updates' },
        { name: 'Risk Threshold', description: 'Configure risk assessment parameters' },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h1 className="text-lg font-medium text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account preferences and system settings
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {settingsSections.map((section) => (
            <div key={section.title} className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <span className="text-gray-500 mr-2">{section.icon}</span>
                <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.settings.map((setting) => (
                  <div
                    key={setting.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{setting.name}</h3>
                      <p className="text-sm text-gray-500">{setting.description}</p>
                    </div>
                    <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                      Configure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
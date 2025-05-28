import React from 'react';
import { Home, FileText, Bell, MessageSquare, Settings, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  closeSidebar?: () => void;
}

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ closeSidebar }) => {
  const location = useLocation();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', icon: <Home className="h-6 w-6" />, path: '/' },
    { name: 'Updates', icon: <FileText className="h-6 w-6" />, path: '/updates' },
    { name: 'Notifications', icon: <Bell className="h-6 w-6" />, path: '/notifications' },
    { name: 'Chatbot', icon: <MessageSquare className="h-6 w-6" />, path: '/chatbot' },
    { name: 'Settings', icon: <Settings className="h-6 w-6" />, path: '/settings' },
  ];

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 md:justify-center">
        <span className="text-xl font-bold text-blue-600">RCT</span>
        {closeSidebar && (
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-600"
            onClick={closeSidebar}
          >
            <span className="sr-only">Close sidebar</span>
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      <div className="mt-5 flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }
                `}
              >
                <div className={`
                  mr-3 flex-shrink-0 transition-colors duration-150 ease-in-out
                  ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'}
                `}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ChatInput from '../chatbot/ChatInput';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } transition-opacity duration-300 ease-in-out`}
      >
        <div 
          className={`absolute inset-0 bg-gray-600 bg-opacity-75 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 ease-in-out`} 
          onClick={toggleSidebar}
        />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}>
          <Sidebar closeSidebar={toggleSidebar} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none p-4 md:p-6">
          {children}
        </main>
        
        <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-4">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Layout;
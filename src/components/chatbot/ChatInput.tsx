import React, { useState } from 'react';
import { Send } from 'lucide-react';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('What are the latest regulatory changes?');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sending the message
    console.log('Sending message:', message);
    // Reset input
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are the latest regulatory changes?"
          className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-150 ease-in-out"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </button>
    </form>
  );
};

export default ChatInput;
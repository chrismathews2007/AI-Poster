
import React, { useState } from 'react';
import { SendIcon } from './icons';

interface RefinementChatProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const RefinementChat: React.FC<RefinementChatProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? "Generate a poster first..." : "e.g., 'Change background to a futuristic city'"}
          disabled={disabled}
          className="flex-grow bg-gray-800 border border-gray-600 rounded-lg py-2 px-4 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300"
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center h-10 w-10"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default RefinementChat;

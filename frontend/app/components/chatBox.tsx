// components/ChatBox.tsx
import React, { useState } from 'react';

interface ChatBoxProps {
  gameId?: string;
  playerId?: string;
}

const ChatBox: React.FC<ChatBoxProps> = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setNewMessage('');
    }
  };
  const isDarkMode = true

  return (
    <div className={`flex flex-col h-full p-4 border-l ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            {message}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={`flex-1 border p-2 rounded-l ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
        <button
          onClick={sendMessage}
          className={`p-2 rounded-r ${isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

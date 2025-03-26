import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: 'Hello! How can I help you today?', 
          sender: 'ai' 
        }]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {!isChatOpen ? (
        <button 
          onClick={() => setIsChatOpen(true)}
          className="bg-orange-500 p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        >
          <MessageCircle className="text-white" />
        </button>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl w-96 h-[500px] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold">AI Assistant</h3>
            <button onClick={() => setIsChatOpen(false)}>
              <X className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`
                  max-w-[80%] p-3 rounded-lg 
                  ${msg.sender === 'user' 
                    ? 'bg-orange-500 text-white self-end ml-auto' 
                    : 'bg-gray-100 text-black self-start'}
                `}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex p-4 border-t">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-l-lg"
            />
            <button 
              onClick={handleSendMessage}
              className="bg-orange-500 text-white p-2 rounded-r-lg hover:bg-orange-600"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
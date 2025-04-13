import { useState, useRef, useEffect } from 'react';

function ChatApp() {
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Bitch', status: '<3' },
    { id: 2, name: 'Tanisha', status: 'Hihihihihi' },
    { id: 3, name: 'Ishita', status: 'Bitchhhh Ishitaaaa' },
    { id: 4, name: 'Unnati', status: 'Blehhhhh' },
    { id: 5, name: 'Shaurya', status: 'Bitchhhh' },
  ]);
  
  const [activeChat, setActiveChat] = useState({
    id: 0,
    name: 'Saksham Bitch',
    messages: [
      { sender: 'user', text: 'Hello, how are you doing?', time: '08:15 AM' },
      { sender: 'friend', text: 'I\'m doing well, thank you! How can I help you today?', time: '08:15 AM' },
      { sender: 'user', text: 'hii', time: '08:16 AM' },
      { sender: 'friend', text: 'heellllluuuu yayyii hiiii', time: '08:16 AM' },
      { sender: 'user', text: '...', time: '08:17 AM' },
    ]
  });
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [activeChat.messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setActiveChat(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        { sender: 'user', text: newMessage, time: timeString }
      ]
    }));
    
    setNewMessage('');
    
    // Simulate response (you would replace this with actual logic)
    setTimeout(() => {
      setActiveChat(prev => ({
        ...prev,
        messages: [
          ...prev.messages,
          { sender: 'friend', text: 'I got your message!', time: timeString }
        ]
      }));
    }, 1000);
  };
  
  return (
    <div className="flex h-screen bg-stone-300">
      {/* Sidebar */}
      <div className="w-1/3 bg-stone-300 border-r border-stone-400">
        <div className="p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-stone-400 rounded-full"></div>
          </div>
          <div className="text-2xl font-bold text-stone-800">Friends</div>
        </div>
        
        {/* Search bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <input 
              type="text" 
              className="w-full bg-stone-200/70 rounded-full py-2 pl-10 pr-4 focus:outline-none"
              placeholder="Search..."
            />
            <div className="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Contact list */}
        <div className="overflow-y-auto h-[calc(100%-8rem)]">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-stone-200"
              onClick={() => setActiveChat({...activeChat, name: conv.name})}
            >
              <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mr-3">
                <div className="w-8 h-8 bg-stone-400 rounded-full"></div>
              </div>
              <div>
                <div className="font-bold text-stone-800">{conv.name}</div>
                <div className="text-sm text-stone-600">{conv.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-stone-200">
        {/* Chat header */}
        <div className="p-4 flex items-center border-b border-stone-300 bg-stone-200">
          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mr-3">
            <div className="w-8 h-8 bg-stone-400 rounded-full"></div>
          </div>
          <div className="text-xl font-bold text-stone-800">{activeChat.name}</div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {activeChat.messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              {msg.sender === 'friend' && (
                <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center mr-2">
                  <div className="w-6 h-6 bg-stone-400 rounded-full"></div>
                </div>
              )}
              <div className="max-w-xs">
                {msg.sender === 'friend' && (
                  <div className="text-xs text-stone-500 mb-1 ml-1">{activeChat.name.split(' ')[0]}</div>
                )}
                <div 
                  className={`rounded-lg px-4 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-stone-700 text-white' 
                      : 'bg-stone-600 text-white'
                  }`}
                >
                  {msg.text}
                </div>
                <div 
                  className={`text-xs text-stone-500 mt-1 ${
                    msg.sender === 'user' ? 'text-right mr-1' : 'ml-1'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-300">
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 bg-stone-300 rounded-full py-2 px-4 focus:outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="ml-2 bg-stone-700 text-white p-2 rounded-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatApp;
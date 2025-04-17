// ChatApp.jsx
import { useState, useEffect, useRef } from 'react';

function ChatApp({ firebaseApp, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentChat, setCurrentChat] = useState('Saksham');
  
  const messagesEndRef = useRef(null);
  
  const contacts = [
    { id: 1, name: 'Saksham', isOnline: true },
    { id: 2, name: 'Tanisha', isOnline: false },
    { id: 3, name: 'Ishita', isOnline: false },
    { id: 4, name: 'Unnati', isOnline: false },
    { id: 5, name: 'Shaurya', isOnline: false },
  ];

  // Load messages from localStorage on component mount and when current chat changes
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_${currentChat}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initialize with a welcome message
      const initialMessage = {
        id: Date.now(),
        sender: currentChat,
        text: `Hi there! This is ${currentChat}. How can I help you today?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialMessage]);
      localStorage.setItem(`chat_${currentChat}`, JSON.stringify([initialMessage]));
    }
  }, [currentChat]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${currentChat}`, JSON.stringify(messages));
    }
  }, [messages, currentChat]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const userMessage = {
      id: Date.now(),
      sender: 'You',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    
    // Simulate a reply after a short delay
    setTimeout(() => {
      const replyMessage = {
        id: Date.now() + 1,
        sender: currentChat,
        text: getRandomReply(newMessage),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prevMessages => [...prevMessages, replyMessage]);
    }, 1000 + Math.random() * 1000);
  };
  
  const getRandomReply = (userMessage) => {
    // Basic context-aware replies
    const lowercaseMessage = userMessage.toLowerCase();
    
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi') || lowercaseMessage.includes('hey')) {
      return `Hey there! How's it going?`;
    }
    
    if (lowercaseMessage.includes('how are you') || lowercaseMessage.includes('how r u')) {
      return "I'm doing great, thanks for asking! How about you?";
    }
    
    if (lowercaseMessage.includes('bye') || lowercaseMessage.includes('goodbye') || lowercaseMessage.includes('see you')) {
      return "Goodbye! Hope to chat again soon!";
    }
    
    if (lowercaseMessage.includes('thank')) {
      return "You're welcome! Anything else I can help with?";
    }
    
    if (lowercaseMessage.includes('?')) {
      return "That's an interesting question! Let me think about it...";
    }
    
    // Default random replies if no context matches
    const replies = [
      "That's interesting! Tell me more.",
      "I see what you mean!",
      "Haha, that's funny!",
      "Hmm, I'm not sure I understand. Could you elaborate?",
      "Cool! What else is new?",
      "I'm glad you reached out!",
      "Let's talk more about this later!",
      "I appreciate you sharing that with me.",
      "Awesome! How's your day going?",
      "Really? That's amazing!",
      "I've been thinking about that too!",
      "Oh wow, I didn't know that!"
    ];
    
    return replies[Math.floor(Math.random() * replies.length)];
  };
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Change the current chat
  const handleChatChange = (contactName) => {
    setCurrentChat(contactName);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-[#BAA587] border-r flex flex-col">
        <div className="p-4">
          <h1 className="text-3xl font-slackey font-bold text-[#3A220E]">Friends</h1>
        </div>
        
        {/* Search Bar */}
        <div className="p-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-amber-800 bg-[#CAB699] rounded-md focus:outline-none focus:bg-white"
              placeholder="Search contacts..."
            />
          </div>
        </div>
        
        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div 
              key={contact.id} 
              className={`flex items-center p-3 cursor-pointer hover:bg-[#857051] transition-colors ${currentChat === contact.name ? 'bg-[#CAB699]' : ''}`}
              onClick={() => handleChatChange(contact.name)}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
                  <span className="text-xl text-amber-800">
                    {contact.name.charAt(0)}
                  </span>
                </div>
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-amber-200"></div>
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="font-mono font-semibold text-black">{contact.name}</div>
                <div className="text-sm text-black truncate">{contact.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#E2D6C3]">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center">
          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center mr-3">
            <span className="text-xl text-amber-800">
              {currentChat.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-serif text-black">{currentChat}</h2>
            <div className="text-sm text-gray-600">
              {contacts.find(c => c.name === currentChat)?.isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}>
                {message.sender !== 'You' && (
                  <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-2">
                    <span className="text-sm text-amber-800">
                      {currentChat.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="max-w-xs">
                  {message.sender !== 'You' && (
                    <div className="text-xs text-black mb-1">{currentChat}</div>
                  )}
                  <div className={`p-3 rounded-lg ${message.sender === 'You' ? 'bg-[#624C37] text-white' : 'bg-[#624C37] text-white'}`}>
                    {message.text}
                  </div>
                  <div className={`text-xs mt-1 ${message.sender === 'You' ? 'text-right' : ''} text-gray-500`}>
                    {message.time}
                  </div>
                </div>
                {message.sender === 'You' && (
                  <div className="ml-2 text-xs text-black self-end">{message.sender}</div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message Input */}
        <div className="p-4">
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 py-2 px-4 bg-[#BAA587] rounded-l-full focus:outline-none focus:ring-1 focus:ring-amber-900"
              placeholder="Type a message..."
            />
            <button
              type="submit"
              className="bg-amber-900 text-white rounded-r-full px-4 hover:bg-amber-800 focus:outline-none focus:ring-1 focus:ring-amber-900"
              disabled={newMessage.trim() === ''}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatApp;
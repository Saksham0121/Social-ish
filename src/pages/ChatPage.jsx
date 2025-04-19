// ChatApp.jsx
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentChat, setCurrentChat] = useState('Saksham');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState('You'); // Default username
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Saksham', isOnline: false },
    { id: 2, name: 'Tanisha', isOnline: false },
    { id: 3, name: 'Ishita', isOnline: false },
    { id: 4, name: 'Unnati', isOnline: false },
    { id: 5, name: 'Shaurya', isOnline: false },
  ]);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // Connect to your WebSocket server
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Handle connection errors
    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    // Clean up the socket connection when component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Register user with the server
    socket.emit('registerUser', { username });
    
    // Set up event listeners
    socket.on('usersOnline', (users) => {
      setContacts(prevContacts => 
        prevContacts.map(contact => ({
          ...contact,
          isOnline: users.includes(contact.name)
        }))
      );
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages(prevMessages => [...prevMessages, {
        id: Date.now() + Math.random(),
        sender: message.sender,
        text: message.text,
        time: message.time
      }]);
    });

    // Listen for typing indicators
    socket.on('userTyping', ({ user, isTyping: typing }) => {
      if (user !== username && user === currentChat) {
        setIsTyping(typing);
        
        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // If they're typing, set a backup timeout to clear the indicator
        // in case the "stopped typing" event gets lost
        if (typing) {
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      }
    });

    // Join the current chat room
    socket.emit('joinChat', { sender: username, receiver: currentChat });

    return () => {
      socket.off('usersOnline');
      socket.off('receiveMessage');
      socket.off('userTyping');
      
      // Clear any existing typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, username, currentChat]);

  // Handle chat room changes
  useEffect(() => {
    if (!socket) return;
    
    // Leave previous room before joining new one
    socket.emit('leaveChat', { sender: username, receiver: currentChat });
    socket.emit('joinChat', { sender: username, receiver: currentChat });
    
    // Load messages for this conversation
    const conversationKey = [username, currentChat].sort().join('_');
    const savedMessages = localStorage.getItem(`chat_conversation_${conversationKey}`);
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([]);
    }
    
    // Reset typing indicator
    setIsTyping(false);
    
    // Clear typing timeout if it exists
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [currentChat, socket, username]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      const conversationKey = [username, currentChat].sort().join('_');
      localStorage.setItem(`chat_conversation_${conversationKey}`, JSON.stringify(messages));
    }
  }, [messages, currentChat, username]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !socket) return;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Create message object
    const messageObj = {
      id: Date.now(),
      sender: username,
      text: newMessage,
      time: time
    };
    
    // Add to local messages
    setMessages(prevMessages => [...prevMessages, messageObj]);
    
    // Send to server
    socket.emit('sendMessage', {
      sender: username,
      receiver: currentChat,
      text: newMessage,
      time: time
    });
    
    // Stop typing indicator
    socket.emit('typing', {
      sender: username, 
      receiver: currentChat,
      isTyping: false
    });
    
    setNewMessage('');
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Emit typing event
    if (socket) {
      socket.emit('typing', {
        sender: username, 
        receiver: currentChat,
        isTyping: e.target.value.trim() !== ''
      });
    }
  };
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    contact.name !== username // Don't show yourself in contacts list
  );
  
  // Change the current chat
  const handleChatChange = (contactName) => {
    setCurrentChat(contactName);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-[#BAA587] border-r flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-3xl font-slackey font-bold text-[#3A220E]">Friends</h1>
          <div className="flex items-center">
            <span className="text-sm mr-2 text-[#3A220E]">{username}</span>
          </div>
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
                <div className="text-sm text-black truncate">
                  {contact.isOnline ? 'Online' : 'Offline'}
                </div>
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
              <div key={message.id} className={`flex ${message.sender === username ? 'justify-end' : 'justify-start'}`}>
                {message.sender !== username && (
                  <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-2">
                    <span className="text-sm text-amber-800">
                      {message.sender.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="max-w-xs">
                  {message.sender !== username && (
                    <div className="text-xs text-black mb-1">{message.sender}</div>
                  )}
                  <div className={`p-3 rounded-lg ${message.sender === username ? 'bg-[#624C37] text-white' : 'bg-[#624C37] text-white'}`}>
                    {message.text}
                  </div>
                  <div className={`text-xs mt-1 ${message.sender === username ? 'text-right' : ''} text-gray-500`}>
                    {message.time}
                  </div>
                </div>
                {message.sender === username && (
                  <div className="ml-2 text-xs text-black self-end">You</div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-2">
                  <span className="text-sm text-amber-800">
                    {currentChat.charAt(0)}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#624C37] text-white">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message Input */}
        <div className="p-4">
          <form onSubmit={sendMessage} className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
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
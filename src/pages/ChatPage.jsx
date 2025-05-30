import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Search, Send } from 'lucide-react';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentChat, setCurrentChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const auth = getAuth();

  // Initialize socket connection on component mount
  useEffect(() => {
    const newSocket = io('http://localhost:3002'); // Replace with your socket server URL
    setSocket(newSocket);

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  // Fetch current user data and contacts from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        setUserId(user.uid);
        
        // Fetch current user's data
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || 'You');
          
          // Fetch friends/connections
          await fetchFriends(userData.connections || []);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [auth]);

  // Fetch friends/connections from Firebase
  const fetchFriends = async (connectionIds) => {
    try {
      const friendsData = [];
      
      for (const friendId of connectionIds) {
        const friendDoc = await getDoc(doc(db, 'users', friendId));
        if (friendDoc.exists()) {
          const friendData = friendDoc.data();
          friendsData.push({
            id: friendId,
            name: friendData.username,
            profilePictureIndex: friendData.profilePictureIndex || 0,
            isOnline: false // Default to offline, will be updated by socket
          });
        }
      }
      
      setContacts(friendsData);
      // If we have friends, set the first one as current chat
      if (friendsData.length > 0 && !currentChat) {
        setCurrentChat(friendsData[0]);
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
    }
  };

  // Set up socket event listeners
  useEffect(() => {
    if (!socket || !userId || !username) return;

    // Register user with socket server
    socket.emit('registerUser', { userId, username });
    
    // Listen for online users
    socket.on('usersOnline', (onlineUsers) => {
      setContacts(prevContacts => 
        prevContacts.map(contact => ({
          ...contact,
          isOnline: onlineUsers.some(user => user.userId === contact.id)
        }))
      );
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      if (message.sender === currentChat?.id || message.receiver === currentChat?.id) {
        setMessages(prevMessages => {
          const alreadyExists = prevMessages.some(m => m.id === message.id);
          if (!alreadyExists) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      }
    });
    

    // Listen for typing indicators
    socket.on('userTyping', ({ user, isTyping: typing }) => {
      if (user === currentChat?.id) {
        setIsTyping(typing);
        
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        if (typing) {
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      }
    });

    return () => {
      socket.off('usersOnline');
      socket.off('receiveMessage');
      socket.off('userTyping');
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, userId, username, currentChat]);

  // Handle chat room changes
  useEffect(() => {
    if (!socket || !currentChat || !userId) return;
    
    // Join chat room
    socket.emit('joinChat', { 
      sender: userId, 
      receiver: currentChat.id 
    });
    
    // Load messages for this conversation
    const conversationKey = [userId, currentChat.id].sort().join('_');
    const savedMessages = localStorage.getItem(`chat_conversation_${conversationKey}`);
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([]);
    }
    
    // Reset typing indicator
    setIsTyping(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    return () => {
      // Leave chat room when changing
      socket.emit('leaveChat', { 
        sender: userId, 
        receiver: currentChat.id 
      });
    };
  }, [currentChat, socket, userId]);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0 && currentChat) {
      const conversationKey = [userId, currentChat.id].sort().join('_');
      localStorage.setItem(`chat_conversation_${conversationKey}`, JSON.stringify(messages));
    }
  }, [messages, currentChat, userId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const sendMessage = (e) => {
    e.preventDefault();
  
    if (newMessage.trim() === '' || !socket || !currentChat) return;
  
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    // Create unique ID
    const messageId = `${Date.now()}_${userId}`;
  
    // Create message object
    const messageObj = {
      id: messageId,
      sender: userId,
      receiver: currentChat.id,
      text: newMessage,
      time: time
    };
  
    // Send to server
    socket.emit('sendMessage', messageObj);
  
    // Stop typing indicator
    socket.emit('typing', {
      sender: userId,
      receiver: currentChat.id,
      isTyping: false
    });
  
    setNewMessage('');
  };
    

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Emit typing event
    if (socket && currentChat) {
      socket.emit('typing', {
        sender: userId, 
        receiver: currentChat.id,
        isTyping: e.target.value.trim() !== ''
      });
    }
  };
  
  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Change current chat
  const handleChatChange = (contact) => {
    setCurrentChat(contact);
  };

  // Profile picture options - matching with FriendsPage
  const profileOptions = [
    "src/Assets/blue.jpeg",
    "src/Assets/brown.jpeg",
    "/src/Assets/pink.jpeg",
    "src/Assets/green.jpeg"
  ];
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-[#BAA587] border-r flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-3xl font-slackey text-[#3A220E]">Friends</h1>
          <div className="flex items-center">
            <span className="text-sm mr-2 text-[#3A220E]">{username}</span>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="p-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Search className="w-5 h-5 text-white" />
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
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                className={`flex items-center p-3 cursor-pointer hover:bg-[#857051] transition-colors ${currentChat?.id === contact.id ? 'bg-[#CAB699]' : ''}`}
                onClick={() => handleChatChange(contact)}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center overflow-hidden">
                    {contact.profilePictureIndex !== undefined ? (
                      <img 
                        src={profileOptions[contact.profilePictureIndex]} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl text-amber-800">
                        {contact.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-amber-200"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-semibold text-black">{contact.name}</div>
                  <div className="text-sm text-black truncate">
                    {contact.isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-600">
              <p>No contacts found.</p>
              <p className="mt-2">Add friends to start chatting!</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#E2D6C3]">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center mr-3 overflow-hidden">
                {currentChat.profilePictureIndex !== undefined ? (
                  <img 
                    src={profileOptions[currentChat.profilePictureIndex]} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl text-amber-800">
                    {currentChat.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif text-black">{currentChat.name}</h2>
                <div className="text-sm text-gray-600">
                  {currentChat.isOnline ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === userId ? 'justify-end' : 'justify-start'}`}>
                    {message.sender !== userId && (
                      <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-2 overflow-hidden">
                        {currentChat.profilePictureIndex !== undefined ? (
                          <img 
                            src={profileOptions[currentChat.profilePictureIndex]} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-amber-800">
                            {currentChat.name.charAt(0)}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="max-w-xs">
                      {message.sender !== userId && (
                        <div className="text-xs text-black mb-1">{currentChat.name}</div>
                      )}
                      <div className={`p-3 rounded-lg ${message.sender === userId ? 'bg-[#624C37] text-white' : 'bg-[#624C37] text-white'}`}>
                        {message.text}
                      </div>
                      <div className={`text-xs mt-1 ${message.sender === userId ? 'text-right' : ''} text-gray-500`}>
                        {message.time}
                      </div>
                    </div>
                    {message.sender === userId && (
                      <div className="ml-2 text-xs text-black self-end">You</div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center mr-2 overflow-hidden">
                      {currentChat.profilePictureIndex !== undefined ? (
                        <img 
                          src={profileOptions[currentChat.profilePictureIndex]} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm text-amber-800">
                          {currentChat.name.charAt(0)}
                        </span>
                      )}
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
                  <Send className="w-6 h-6" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-2xl font-serif mb-4 text-amber-900">Select a contact to start chatting</h2>
              {contacts.length === 0 && (
                <p className="text-gray-600">
                  You don't have any contacts yet. Add friends to start chatting!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatComponent;
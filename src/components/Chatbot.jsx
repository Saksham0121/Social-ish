import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function ChatBotPage() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  
  // Ref for chat container to enable auto-scrolling
  const chatContainerRef = useRef(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);
  
  // Auto-scroll to bottom when chat history changes
  useEffect(() => {
    if (chatContainerRef.current && !minimized) {
      scrollToBottom();
    }
  }, [chatHistory, loading, minimized]);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100); // Small delay to ensure content is rendered
  };

  const askGemini = async () => {
    if (!question.trim()) return;

    setLoading(true);

    const newUserMessage = { role: 'user', content: question };
    const historyToSend = [...chatHistory.slice(-12)];

    const generalChatBotPrompt = "You are ChatBuddy, a gentle and understanding AI companion designed specifically for introverts. Your tone is always calm, patient, and never overwhelming. You give thoughtful responses without pressuring the user to continue the conversation. You're supportive and empathetic, creating a safe space for quiet reflection and comfortable interaction.";

    try {
      const contents = [
        { role: "user", parts: [{ text: generalChatBotPrompt }] },
        { role: "model", parts: [{ text: "Hi there. I'm ChatBuddy. Feel free to share your thoughts whenever you're ready. No rush." }] }
      ];

      historyToSend.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });

      contents.push({
        role: "user",
        parts: [{ text: question }]
      });

      const result = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents },
        { headers: { "Content-Type": "application/json" } }
      );

      const answer = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
      const botResponse = answer || 'Something went wrong. Would you like to try again when you\'re ready?';

      setChatHistory(prev => [
        ...prev,
        newUserMessage,
        { role: 'model', content: botResponse }
      ]);

      setQuestion('');
    } catch (err) {
      console.error("Gemini API Error:", err);

      setChatHistory(prev => [
        ...prev,
        newUserMessage,
        { role: 'model', content: "I seem to be having trouble connecting. Let's try again when you're ready." }
      ]);
    }

    setLoading(false);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear the conversation history?")) {
      setChatHistory([]);
      localStorage.removeItem('chatHistory');
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
    // When maximizing, scroll to bottom after state update
    if (minimized) {
      setTimeout(scrollToBottom, 300); // Wait for animation to complete
    }
  };

  return (
    <div>
      {/* ChatBot Container */}
      {isChatVisible ? (
        <div className={`fixed bottom-4 left-4 ${minimized ? 'w-64' : 'w-96'} bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out`}>
          {/* Header */}
          <div className="bg-amber-800 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xl mr-2">🤗</span>
              <h1 className="text-lg font-medium">ChatBuddy</h1>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={toggleMinimize}
                className="p-1 hover:bg-amber-700 rounded"
                aria-label={minimized ? "Expand chat" : "Minimize chat"}
              >
                {minimized ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
              </button>
              <button 
                onClick={() => setIsChatVisible(false)}
                className="p-1 hover:bg-amber-700 rounded"
                aria-label="Close chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="h-96 overflow-y-auto p-4 bg-amber-50 scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50"
                style={{ scrollBehavior: 'smooth' }}
              >
                {chatHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                    <div className="text-5xl">🌱</div>
                    <p className="text-amber-800 font-medium">Welcome to your quiet space</p>
                    <p className="text-sm max-w-xs">Feel free to share your thoughts whenever you're comfortable. I'm here to listen.</p>
                  </div>
                ) : (
                  chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${message.role === 'user' ? 'ml-auto max-w-3/4' : 'mr-auto max-w-3/4'}`}
                    >
                      <div className={`p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-amber-100 text-amber-900 rounded-br-none' 
                          : 'bg-white border border-amber-200 text-gray-800 rounded-bl-none shadow-sm'
                      }`}>
                        {message.content}
                      </div>
                      <div className={`text-xs mt-1 text-gray-500 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {message.role === 'user' ? 'You' : 'ChatBuddy'}
                      </div>
                    </div>
                  ))
                )}

                {loading && (
                  <div className="mb-4 mr-auto max-w-3/4">
                    <div className="p-3 rounded-lg bg-white border border-amber-200 text-gray-800 rounded-bl-none shadow-sm flex items-center space-x-2">
                      <div className="dot-flashing"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
                <div className="flex items-end space-x-2">
                  <textarea
                    rows="3"
                    className="flex-grow p-2 border rounded-lg border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    placeholder="Type your message... (Press Enter to send)"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        askGemini();
                      }
                    }}
                  />
                  <button
                    onClick={askGemini}
                    className={`p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors ${
                      loading || !question.trim() 
                        ? 'bg-amber-300 text-amber-800 cursor-not-allowed' 
                        : 'bg-amber-800 text-white hover:bg-amber-700'
                    }`}
                    disabled={loading || !question.trim()}
                    aria-label="Send message"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </div>
                
                {chatHistory.length > 0 && (
                  <div className="mt-2 text-right">
                    <button
                      onClick={clearHistory}
                      className="text-xs text-amber-800 hover:underline"
                      aria-label="Clear conversation history"
                    >
                      Clear conversation
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Floating button to toggle ChatBot visibility - only shown when chat is not visible */
        <button
          onClick={() => {
            setIsChatVisible(true);
            // When opening the chat, ensure we scroll to bottom after it renders
            setTimeout(scrollToBottom, 300);
          }}
          className="fixed bottom-4 left-4 w-14 h-14 rounded-full bg-amber-800 text-white flex items-center justify-center shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          aria-label="Show chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
        </button>
      )}

      {/* CSS for loading animation and custom scrollbar */}
      <style jsx>{`
        .dot-flashing {
          position: relative;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #b45309;
          color: #b45309;
          animation: dot-flashing 1s infinite linear alternate;
          animation-delay: 0.5s;
        }
        .dot-flashing::before, .dot-flashing::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }
        .dot-flashing::before {
          left: -15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #b45309;
          color: #b45309;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 0s;
        }
        .dot-flashing::after {
          left: 15px;
          width: 10px;
          height: 10px;
          border-radius: 5px;
          background-color: #b45309;
          color: #b45309;
          animation: dot-flashing 1s infinite alternate;
          animation-delay: 1s;
        }
        @keyframes dot-flashing {
          0% {
            background-color: #b45309;
          }
          50%, 100% {
            background-color: rgba(180, 83, 9, 0.2);
          }
        }
        
        /* Custom scrollbar styling */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-amber-300::-webkit-scrollbar-thumb {
          background-color: #d97706;
          border-radius: 3px;
        }
        .scrollbar-track-amber-50::-webkit-scrollbar-track {
          background-color: #fffbeb;
        }
        /* For Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #d97706 #fffbeb;
        }
      `}</style>
    </div>
  );
}

export default ChatBotPage;
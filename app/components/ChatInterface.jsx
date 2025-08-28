'use client';
import { useState, useEffect, useRef } from 'react';

const ChatInterface = ({ onCrisisDetected }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emotion, setEmotion] = useState('neutral');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const emotionColors = {
    happy: 'bg-emerald-100 border-emerald-200',
    sad: 'bg-blue-100 border-blue-200',
    anxious: 'bg-amber-100 border-amber-200',
    angry: 'bg-red-100 border-red-200',
    neutral: 'bg-gray-100 border-gray-200',
    excited: 'bg-pink-100 border-pink-200',
    scared: 'bg-purple-100 border-purple-200',
    crisis: 'bg-red-500 text-white'
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      if (data.isCrisis) {
        onCrisisDetected();
        setEmotion('crisis');
        setMessages(prev => [...prev, { 
          text: data.response.message, 
          isUser: false, 
          isCrisis: true,
          resources: data.response.resources 
        }]);
      } else {
        setEmotion(data.emotion);
        setMessages(prev => [...prev, { text: data.response, isUser: false }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting right now. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMemoryRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: "remind me what I said earlier?" }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Error requesting memory:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble accessing memory right now.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h2 className="font-semibold">Aura AI Companion</h2>
            <p className="text-sm opacity-80">I'm here to listen and support you</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p>Hello! I'm here to listen without judgment.</p>
            <p className="text-sm mt-2">What's on your mind today?</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : message.isCrisis
                      ? emotionColors.crisis
                      : emotionColors[emotion] || emotionColors.neutral
                  }`}
                >
                  <p className="break-words">{message.text}</p>
                  
                  {message.resources && (
                    <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                      <h4 className="font-semibold mb-2">Immediate Help:</h4>
                      {message.resources.map((resource, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <p className="text-sm font-medium">{resource.name}</p>
                          <p className="text-sm">{resource.contact}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none"
            rows="1"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="text-sm text-gray-500">
            Emotion: <span className="capitalize">{emotion}</span>
          </div>
          
          <button
            onClick={handleMemoryRequest}
            disabled={isLoading}
            className="text-sm text-blue-500 hover:text-blue-700 disabled:opacity-50"
          >
            What did I say earlier?
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
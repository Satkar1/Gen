'use client';
import { useState, useEffect } from 'react';

const RolePlay = () => {
  const [persona, setPersona] = useState('');
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const personas = [
    {
      id: 'therapist',
      name: 'Therapist',
      description: 'Practice what you might say in a therapy session',
      prompt: 'You are a compassionate, professional therapist. Respond with empathy and evidence-based techniques. Keep responses under 3 sentences.'
    },
    {
      id: 'friend',
      name: 'Supportive Friend',
      description: 'Talk to a understanding, non-judgmental friend',
      prompt: 'You are a supportive, empathetic friend. Listen actively and offer comfort without judgment. Keep responses casual and under 3 sentences.'
    },
    {
      id: 'teacher',
      name: 'Understanding Teacher',
      description: 'Practice talking to a trusted teacher or mentor',
      prompt: 'You are a caring, understanding teacher. Offer guidance and support while maintaining appropriate boundaries. Keep responses professional but warm, under 3 sentences.'
    }
  ];

  useEffect(() => {
    // Load previous conversations from session storage
    const savedConversations = JSON.parse(sessionStorage.getItem('roleplay_conversations') || '[]');
    setConversation(savedConversations);
  }, []);

  const handlePersonaSelect = (selectedPersona) => {
    setPersona(selectedPersona);
    setConversation([]);
  };

  const handleSend = async () => {
    if (!userInput.trim() || !persona || isLoading) return;

    const userMessage = { role: 'user', content: userInput };
    const updatedConversation = [...conversation, userMessage];
    setConversation(updatedConversation);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/role-play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userInput,
          persona: personas.find(p => p.id === persona)?.prompt,
          history: updatedConversation.slice(-4) // Keep last 4 messages for context
        }),
      });

      const data = await response.json();
      if (data.response) {
        const aiMessage = { role: 'assistant', content: data.response };
        setConversation(prev => [...prev, aiMessage]);
        
        // Save to session storage (last 3 conversations)
        const allConversations = JSON.parse(sessionStorage.getItem('roleplay_conversations') || '[]');
        const newConversations = [...allConversations, userMessage, aiMessage].slice(-6); // Keep last 3 exchanges
        sessionStorage.setItem('roleplay_conversations', JSON.stringify(newConversations));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: "I'm having trouble connecting right now. Please try again." 
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetConversation = () => {
    setConversation([]);
    setUserInput('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Role-Play Helper</h2>
      
      {!persona ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose who you'd like to practice talking with:</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {personas.map((p) => (
              <button
                key={p.id}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                onClick={() => handlePersonaSelect(p.id)}
              >
                <h4 className="font-semibold mb-2">{p.name}</h4>
                <p className="text-sm text-gray-600">{p.description}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Talking with: {personas.find(p => p.id === persona)?.name}
            </h3>
            <button
              onClick={() => setPersona('')}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Change Persona
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
            {conversation.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Start the conversation. What would you like to say to {personas.find(p => p.id === persona)?.name}?
              </p>
            ) : (
              conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${msg.role === 'user' ? 'text-right' : ''}`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg max-w-xs md:max-w-md ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="text-left mb-3">
                <div className="inline-block p-3 rounded-lg bg-white border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message here..."
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !userInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
            >
              Send
            </button>
            <button
              onClick={resetConversation}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Remember:</strong> This is practice for real conversations. The responses are AI-generated and not from a real {personas.find(p => p.id === persona)?.name.toLowerCase()}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePlay;
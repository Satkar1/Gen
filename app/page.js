'use client';
import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import Pathfinder from '@/components/Pathfinder';
import RolePlay from '@/components/RolePlay';
import Journal from '@/components/Journal';
import Sanctuary from '@/components/Sanctuary';
import CommunityWall from '@/components/CommunityWall';
import CrisisProtocol from '@/components/CrisisProtocol';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');
  const [crisisActive, setCrisisActive] = useState(false);

  const tabs = [
    { id: 'chat', name: 'Chat', icon: '💬' },
    { id: 'pathfinder', name: 'Pathfinder', icon: '🧭' },
    { id: 'roleplay', name: 'Role-Play', icon: '🎭' },
    { id: 'journal', name: 'Journal', icon: '📔' },
    { id: 'sanctuary', name: 'Sanctuary', icon: '🌿' },
    { id: 'community', name: 'Community', icon: '👥' },
  ];

  const handleCrisisDetected = () => {
    setCrisisActive(true);
  };

  const handleCrisisClose = () => {
    setCrisisActive(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface onCrisisDetected={handleCrisisDetected} />;
      case 'pathfinder':
        return <Pathfinder />;
      case 'roleplay':
        return <RolePlay />;
      case 'journal':
        return <Journal />;
      case 'sanctuary':
        return <Sanctuary />;
      case 'community':
        return <CommunityWall />;
      default:
        return <ChatInterface onCrisisDetected={handleCrisisDetected} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✨</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Aura AI</h1>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              Anonymous • Secure
            </div>
          </div>
        </div>
      </header>

      {/* Disclaimer Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <p className="text-yellow-800 text-sm text-center">
            <strong>Disclaimer:</strong> Aura AI is not a licensed therapist or medical service. 
            If you're in crisis, please use the crisis resources provided.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p>© {new Date().getFullYear()} Aura AI - A mental wellness companion</p>
            <p className="mt-2">
              If you're experiencing a mental health emergency, please call 988 or your local emergency number.
            </p>
          </div>
        </div>
      </footer>

      {/* Crisis Protocol Overlay */}
      <CrisisProtocol isActive={crisisActive} onClose={handleCrisisClose} />
    </div>
  );
}
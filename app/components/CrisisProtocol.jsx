'use client';
import { useState, useEffect } from 'react';

const CrisisProtocol = ({ isActive, onClose }) => {
  const [showResources, setShowResources] = useState(false);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    if (isActive) {
      // Play calming sound
      const audio = new Audio('/audio/calming-tone.mp3');
      audio.loop = true;
      audio.play();
      
      // Auto-show resources after 2 seconds
      const timer = setTimeout(() => {
        setShowResources(true);
      }, 2000);
      
      return () => {
        audio.pause();
        clearTimeout(timer);
      };
    }
  }, [isActive]);

  const copyToClipboard = async (text, resourceName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(resourceName);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resources = [
    {
      name: "988 Suicide & Crisis Lifeline",
      contact: "Call or text 988",
      copyText: "988",
      description: "Free, confidential support available 24/7"
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      copyText: "HOME to 741741",
      description: "Free, 24/7 support via text"
    },
    {
      name: "International WhatsApp Support",
      contact: "+1-585-301-5657",
      copyText: "+1-585-301-5657",
      description: "Global support via WhatsApp",
      link: "https://wa.me/15853015657"
    }
  ];

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-red-500 bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl animate-pulse">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">We're Here For You</h2>
          <p className="text-gray-600">
            You're not alone. Please reach out to these resources for immediate support.
          </p>
        </div>

        {showResources && (
          <div className="space-y-4">
            {resources.map((resource, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-1">{resource.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{resource.contact}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(resource.copyText, resource.name)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                    >
                      {copied === resource.name ? 'Copied!' : 'Copy'}
                    </button>
                    {resource.link && (
                      <a
                        href={resource.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
                      >
                        Open
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h4 className="font-semibold mb-2">Remember:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Your feelings are valid and temporary</li>
                <li>• Reaching out is a sign of strength</li>
                <li>• Professional help can make a difference</li>
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          I understand
        </button>
      </div>
    </div>
  );
};

export default CrisisProtocol;
'use client';
import { useState } from 'react';

const Sanctuary = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [tips, setTips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);

  const topics = [
    {
      id: 'anxiety',
      name: 'Anxiety',
      icon: '🌪️',
      videoId: 'WOoJ2CFJmA0', // Breathing exercise video
      color: 'bg-purple-100'
    },
    {
      id: 'sleep',
      name: 'Sleep',
      icon: '🌙',
      videoId: 'aEqlQvczMJQ', // Sleep meditation video
      color: 'bg-blue-100'
    },
    {
      id: 'school-pressure',
      name: 'School Pressure',
      icon: '📚',
      videoId: 'z6X5oEIg6Ak', // Study stress relief video
      color: 'bg-green-100'
    },
    {
      id: 'relationships',
      name: 'Relationships',
      icon: '💞',
      videoId: 'vTHdpiZ6a2E', // Healthy relationships video
      color: 'bg-pink-100'
    },
    {
      id: 'self-esteem',
      name: 'Self-Esteem',
      icon: '✨',
      videoId: 'cYkiLg4rke4', // Self-love meditation video
      color: 'bg-yellow-100'
    }
  ];

  const breathingExercises = [
    {
      id: 'box-breathing',
      name: 'Box Breathing',
      description: '4-second intervals for calm focus',
      steps: ['Breathe in for 4 seconds', 'Hold for 4 seconds', 'Exhale for 4 seconds', 'Hold for 4 seconds'],
      duration: 2 // minutes
    },
    {
      id: '4-7-8',
      name: '4-7-8 Breathing',
      description: 'Calming technique for anxiety',
      steps: ['Breathe in for 4 seconds', 'Hold for 7 seconds', 'Exhale slowly for 8 seconds'],
      duration: 2
    },
    {
      id: 'deep-breathing',
      name: 'Deep Belly Breathing',
      description: 'Activate relaxation response',
      steps: ['Place hand on belly', 'Breathe deeply through nose', 'Feel belly expand', 'Exhale slowly through mouth'],
      duration: 3
    }
  ];

  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    
    try {
      // Fetch AI-generated tips
      const response = await fetch('/api/sanctuary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      
      const data = await response.json();
      if (data.tips) {
        setTips(data.tips);
      }
      
      // Select a random breathing exercise
      const randomExercise = breathingExercises[
        Math.floor(Math.random() * breathingExercises.length)
      ];
      setCurrentExercise(randomExercise);
    } catch (error) {
      console.error('Error fetching tips:', error);
      setTips([
        "Practice deep breathing for 2 minutes",
        "Take a short walk outside",
        "Write down three things you're grateful for"
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Sanctuary Hub</h2>
      <p className="text-gray-600 mb-8">Find resources and practices for specific challenges</p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleTopicSelect(topic.id)}
            className={`p-4 rounded-lg text-center transition-all ${
              selectedTopic === topic.id 
                ? 'ring-2 ring-blue-500 transform scale-105' 
                : 'bg-white border border-gray-200 hover:shadow-md'
            } ${topic.color}`}
          >
            <span className="text-2xl block mb-2">{topic.icon}</span>
            <span className="text-sm font-medium">{topic.name}</span>
          </button>
        ))}
      </div>
      
      {selectedTopic && (
        <div className="space-y-8">
          {/* YouTube Video */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Helpful Video</h3>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${topics.find(t => t.id === selectedTopic)?.videoId}`}
                title="Sanctuary Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-64 md:h-96"
              />
            </div>
          </div>
          
          {/* AI-Generated Tips */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Actionable Tips</h3>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-3">
                {tips.map((tip, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-3">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Breathing Exercise */}
          {currentExercise && (
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Breathing Exercise</h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{currentExercise.name}</h4>
                  <p className="text-gray-600 mb-4">{currentExercise.description}</p>
                  <ul className="space-y-2 mb-4">
                    {currentExercise.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-gray-500">Duration: ~{currentExercise.duration} minutes</p>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full border-4 border-blue-300 flex items-center justify-center">
                    <div className="animate-pulse text-4xl">🌬️</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sanctuary;
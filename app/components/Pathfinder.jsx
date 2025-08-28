'use client';
import { useState } from 'react';

const Pathfinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState('');
  const [streak, setStreak] = useState(0);
  const [earnedBadge, setEarnedBadge] = useState(false);

  const moods = [
    { emoji: '😔', label: 'Sad' },
    { emoji: '😰', label: 'Anxious' },
    { emoji: '😴', label: 'Tired' },
    { emoji: '😠', label: 'Frustrated' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😊', label: 'Good' }
  ];

  const groundingSteps = [
    { number: 5, sense: 'sight', prompt: 'Find 5 things you can see' },
    { number: 4, sense: 'touch', prompt: 'Notice 4 things you can feel' },
    { number: 3, sense: 'hearing', prompt: 'Listen for 3 things you can hear' },
    { number: 2, sense: 'smell', prompt: 'Identify 2 things you can smell' },
    { number: 1, sense: 'taste', prompt: 'Focus on 1 thing you can taste' }
  ];

  const steps = [
    {
      title: "Name It",
      content: (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">How are you feeling today?</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {moods.map((mood, index) => (
              <button
                key={index}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMood === mood.label 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setSelectedMood(mood.label)}
              >
                <span className="text-2xl block mb-2">{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Your streak: {streak} days</p>
            <div className="flex justify-center mt-2">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full mx-1 ${
                    i < streak ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Understand It",
      content: (
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Understanding your feelings</h3>
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-blue-800">
              "It's okay to feel {selectedMood.toLowerCase()}. Many people experience this, 
              and it doesn't define who you are."
            </p>
            <p className="text-sm text-blue-600 mt-2">- From someone who's been there</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-700">
              Remember: emotions are temporary visitors. Acknowledging them is the first step 
              toward understanding and managing them.
            </p>
          </div>
        </div>
      )
    },
    // Additional steps would be implemented here
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Pathfinder</h2>
          <span className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        {steps[currentStep].content}
      </div>

      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(prev => prev - 1)}
        >
          Back
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(prev => prev + 1);
            } else {
              // Complete the journey
              setStreak(prev => prev + 1);
              setEarnedBadge(true);
            }
          }}
        >
          {currentStep === steps.length - 1 ? 'Complete Journey' : 'Next'}
        </button>
      </div>

      {earnedBadge && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
          <span className="text-2xl">🎉</span>
          <h4 className="font-semibold text-yellow-800">Congratulations!</h4>
          <p className="text-yellow-600">You've earned the Grounding Expert badge!</p>
        </div>
      )}
    </div>
  );
};

export default Pathfinder;
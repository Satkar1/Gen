'use client';
import { useState, useEffect } from 'react';

const CommunityWall = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Static demo data - in a real app, this would come from a database
  const demoPosts = [
    {
      id: 1,
      content: "Finally asked for help today after using the role-play feature to practice. Feeling nervous but proud!",
      timestamp: "2 hours ago",
      emoji: "🎉"
    },
    {
      id: 2,
      content: "Completed my 7-day journaling streak! Seeing my mood patterns has been eye-opening.",
      timestamp: "5 hours ago",
      emoji: "📊"
    },
    {
      id: 3,
      content: "The grounding exercise saved me during a panic attack at school. Thank you for this tool.",
      timestamp: "1 day ago",
      emoji: "🌿"
    },
    {
      id: 4,
      content: "Had my first therapy session today. It was scary but I'm glad I took the first step.",
      timestamp: "2 days ago",
      emoji: "💪"
    },
    {
      id: 5,
      content: "Shared the breathing exercises with my friends during exam week. We all felt calmer!",
      timestamp: "3 days ago",
      emoji: "📚"
    }
  ];

  useEffect(() => {
    // Simulate loading from an API
    const timer = setTimeout(() => {
      setPosts(demoPosts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addPost = (content) => {
    const newPost = {
      id: posts.length + 1,
      content,
      timestamp: "Just now",
      emoji: "✨"
    };
    setPosts([newPost, ...posts]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">Community Wall</h2>
        <p className="text-gray-600 mb-4">
          Share your victories and read encouraging stories from others. All posts are anonymous.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            <strong>Remember:</strong> This is a supportive space. Be kind to yourself and others.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <div className="flex items-start mb-2">
                <span className="text-2xl mr-3">{post.emoji}</span>
                <p className="text-gray-800 flex-1">{post.content}</p>
              </div>
              <div className="text-sm text-gray-500 flex justify-between items-center">
                <span>Anonymous</span>
                <span>{post.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => {
            const userMessage = prompt("Share something positive or encouraging (anonymous):");
            if (userMessage && userMessage.trim()) {
              addPost(userMessage.trim());
            }
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all"
        >
          <span className="text-xl">+</span>
        </button>
      </div>
    </div>
  );
};

export default CommunityWall;
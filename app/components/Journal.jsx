'use client';
import { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [todayEntry, setTodayEntry] = useState('');
  const [chart, setChart] = useState(null);

  useEffect(() => {
    // Load past entries from session storage
    const savedEntries = JSON.parse(sessionStorage.getItem('journal_entries') || '[]');
    setEntries(savedEntries);
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      renderChart();
    }
  }, [entries]);

  const renderChart = () => {
    const ctx = document.getElementById('moodChart');
    if (ctx) {
      if (chart) {
        chart.destroy();
      }
      
      const last7Entries = entries.slice(-7);
      const newChart = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: last7Entries.map((_, i) => `Day ${i + 1}`),
          datasets: [
            {
              label: 'Energy Level',
              data: last7Entries.map(entry => entry.energy || 5),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
              label: 'Mood Level',
              data: last7Entries.map(entry => entry.mood || 5),
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
            }
          ]
        },
        options: {
          scales: {
            r: {
              min: 0,
              max: 10,
              ticks: {
                stepSize: 2
              }
            }
          }
        }
      });
      setChart(newChart);
    }
  };

  const analyzeEntry = async (text) => {
    // This would call your API route to analyze with Gemini
    // For demo purposes, returning mock data
    return {
      emotion: 'thoughtful',
      energy: 6,
      suggestion: 'Take a short walk outside to clear your mind'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todayEntry.trim()) return;

    const analysis = await analyzeEntry(todayEntry);
    const newEntry = {
      date: new Date().toISOString(),
      text: todayEntry,
      ...analysis
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    sessionStorage.setItem('journal_entries', JSON.stringify(updatedEntries));
    setTodayEntry('');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Vibe Check Journal</h2>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={todayEntry}
          onChange={(e) => setTodayEntry(e.target.value)}
          placeholder="How are you feeling today? What's on your mind?"
          className="w-full p-4 border border-gray-300 rounded-lg h-32 resize-none"
        />
        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Entry
        </button>
      </form>

      {entries.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Mood Trends</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            <canvas id="moodChart" width="400" height="200"></canvas>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {entries.slice().reverse().map((entry, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm text-gray-500">
                {new Date(entry.date).toLocaleDateString()}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Energy: {entry.energy}/10
              </span>
            </div>
            <p className="mb-2">{entry.text}</p>
            {entry.suggestion && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-800">
                  <strong>Suggestion:</strong> {entry.suggestion}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Journal;
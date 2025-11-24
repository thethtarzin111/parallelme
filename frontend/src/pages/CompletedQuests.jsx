import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questService from '../services/questService';
import Navbar from '../components/Navbar';

const CompletedQuests = () => {
  const navigate = useNavigate();
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Social', 'Academic', 'Personal', 'Creative', 'Career', 'Health'];

  useEffect(() => {
    fetchCompletedQuests();
  }, []);

  const fetchCompletedQuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questService.getCompletedQuests();
      setQuests(data.quests || []);
    } catch (err) {
      console.error('Error fetching completed quests:', err);
      setError(err.response?.data?.message || 'Failed to load completed quests');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuests = selectedCategory === 'All'
    ? quests
    : quests.filter(q => q.category === selectedCategory);

  const getCategoryColor = (category) => {
    const colors = {
      Social: 'bg-blue-100 text-blue-800',
      Academic: 'bg-purple-100 text-purple-800',
      Personal: 'bg-green-100 text-green-800',
      Creative: 'bg-pink-100 text-pink-800',
      Career: 'bg-yellow-100 text-yellow-800',
      Health: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your completed quests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 mt-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-5xl mb-4">😞</div>
            <p className="font-semibold text-red-800 text-lg mb-2">Error loading completed quests</p>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchCompletedQuests}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/quests')}
            className="mb-4 text-purple-600 hover:text-purple-700 flex items-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Quests
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-4xl font-bold text-gray-800">
              Completed Quests
            </h2>
            <span className="text-3xl">🏆</span>
          </div>
          
          <p className="text-gray-600">
            {quests.length} quest{quests.length !== 1 ? 's' : ''} completed
            <span className="mx-2">•</span>
            <span className="font-semibold text-yellow-600">
                {quests.reduce((total, quest) => total + quest.points, 0)} ⭐ points
            </span>
          </p>
        </div>

        {/* Category Filters */}
        {quests.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {quests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No completed quests yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start completing quests to see them here!
            </p>
            <button
              onClick={() => navigate('/quests')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Browse Quests
            </button>
          </div>
        ) : filteredQuests.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No {selectedCategory} quests completed
            </h3>
            <p className="text-gray-600">
              Try selecting a different category
            </p>
          </div>
        ) : (
          /* Completed Quests Grid */
          <div className="space-y-6">
            {filteredQuests.map((quest) => (
              <div 
                key={quest._id}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(quest.category)}`}>
                        {quest.category}
                      </span>
                      <span className="text-2xl">✓</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {quest.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Completed on {formatDate(quest.completedAt)}
                    </p>
                  </div>
                  
                  {/* Points Badge */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg">
                      <span className="text-2xl">⭐</span>
                      <span className="font-bold text-yellow-700">{quest.points}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      Batch {quest.batchNumber}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">
                  {quest.description}
                </p>

                {/* Reflection */}
                <div className="bg-purple-50 rounded-lg p-4 border-l-2 border-purple-300">
                  <p className="text-xs font-semibold text-purple-700 mb-2">
                    YOUR REFLECTION:
                  </p>
                  <p className="text-gray-700 italic">
                    "{quest.reflection}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedQuests;
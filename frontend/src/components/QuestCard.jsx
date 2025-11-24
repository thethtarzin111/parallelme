import React from 'react';

const QuestCard = ({ quest, onStart, onComplete, isLoading }) => {
  // Determine category color
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

  // Determine difficulty badge
  const getDifficultyBadge = (level) => {
    if (level <= 3) return { text: 'Easy', color: 'bg-green-500' };
    if (level <= 6) return { text: 'Medium', color: 'bg-yellow-500' };
    return { text: 'Hard', color: 'bg-red-500' };
  };

  const difficulty = getDifficultyBadge(quest.difficultyLevel);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200">
      {/* Header with category and difficulty */}
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(quest.category)}`}>
          {quest.category}
        </span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${difficulty.color}`}></span>
          <span className="text-xs text-gray-600">{difficulty.text}</span>
        </div>
      </div>

      {/* Quest Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {quest.title}
      </h3>

      {/* Quest Description */}
      <p className="text-gray-600 mb-4 line-clamp-3">
        {quest.description}
      </p>

      {/* Footer with points and action button */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-sm font-semibold text-gray-700">
            {quest.points} points
          </span>
        </div>

        {/* Available - Start Button */}
        {quest.status === 'available' && (
          <button
            onClick={() => onStart(quest._id)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
                     font-medium text-sm"
          >
            {isLoading ? 'Starting...' : 'Start Quest'}
          </button>
        )}

        {/* Active - Complete Button */}
        {quest.status === 'active' && (
          <button
            onClick={() => onComplete(quest)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-medium text-sm"
          >
            Complete Quest ✓
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestCard;
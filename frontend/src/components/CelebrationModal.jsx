import React from 'react';

const CelebrationModal = ({ quest, batchCompleted, newBatchNumber, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Celebration Icon */}
        <div className="text-6xl mb-4 animate-bounce">
          {batchCompleted ? '🎊' : '🎉'}
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          {batchCompleted ? 'Batch Complete!' : 'Quest Complete!'}
        </h2>

        <p className="text-gray-600 mb-6">
          {batchCompleted 
            ? `Amazing work! You completed all quests in this batch. ${newBatchNumber ? `Batch ${newBatchNumber} is now unlocked! 🔓` : 'You finished all 30 quests! 🏆'}`
            : `You earned ${quest.points} points! Keep going! 💪`
          }
        </p>

        {/* Quest Title */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-1">Completed:</p>
          <p className="font-bold text-gray-800">{quest.title}</p>
        </div>

        {/* Points Earned */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-3xl">⭐</span>
          <span className="text-2xl font-bold text-purple-600">+{quest.points} points</span>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
        >
          {batchCompleted && newBatchNumber ? 'View New Quests 🚀' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default CelebrationModal;
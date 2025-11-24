import React, { useState } from 'react';

const QuestCompletionModal = ({ quest, onClose, onComplete }) => {
    const [reflection, setReflection] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // Validate if user has written a reflection
        if (!reflection.trim()) {
            setError('Please write a reflection before completing the quest');
            return;
        }

        if (reflection.length > 500) {
            setError('Reflection must be 500 characters or less');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');
            await onComplete(quest._id, reflection);
            onClose();
        } catch(e) {
            setError(e.response?.data?.message || 'Failed to complete quest');
            setIsSubmitting(false);
        } 
    };

    const remainingChars = 500 - reflection.length;
    const charCount = reflection.length;

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Complete Quest</h2>
              <p className="text-purple-100 text-sm">Share your experience and reflection</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quest Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-lg text-gray-800 mb-2">{quest.title}</h3>
            <p className="text-gray-600 text-sm">{quest.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="text-sm font-semibold text-gray-700">{quest.points} points</span>
            </div>
          </div>

          {/* Reflection Prompt */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              How did it go? What did you learn? 💭
            </label>
            <p className="text-sm text-gray-600 mb-4">
              Take a moment to reflect on your experience. What did you feel? What surprised you? How did you grow?
            </p>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="I did it! Today I..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 text-gray-900 focus:outline-none resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${remainingChars < 50 ? 'text-red-500' : 'text-gray-500'}`}>
                {remainingChars} characters remaining
              </span>
              <span className="text-xs text-gray-400">
                {charCount} / 500
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !reflection.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Completing...' : 'Complete Quest 🎉'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default QuestCompletionModal;
import React, { useState, useEffect } from 'react';

const StoryModal = ({ story, questTitle, onClose }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isTyping, setIsTyping] = useState(true);

    // Split story into words
    const words = story.split(' ');

    useEffect(() => {
        if (!isTyping) return;

        if (currentIndex < words.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 100); // Speed: 100ms per word (adjust for faster/slower)

            return () => clearTimeout(timer);
        } else {
            setIsComplete(true);
            setIsTyping(false);
        }
    }, [currentIndex, words, isTyping]);

    // Handle click or Enter to speed up / complete
    const handleInteraction = () => {
        if (!isComplete) {
            // Show all remaining text immediately
            setDisplayedText(story);
            setCurrentIndex(words.length);
            setIsComplete(true);
            setIsTyping(false);
        } else {
            // Close modal if already complete
            onClose();
        }
    };

    // Handle keyboard events
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleInteraction();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isComplete]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={handleInteraction}
        >
            <div 
                className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-slideUp"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4 animate-bounce">📖</div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Your Journey Continues...
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Quest: <span className="font-semibold">{questTitle}</span>
                    </p>
                </div>

                {/* Story Content */}
                <div className="mb-8">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 min-h-[200px]">
                        <p className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                            {displayedText}
                            {isTyping && <span className="animate-pulse">▌</span>}
                        </p>
                    </div>
                </div>

                {/* Instruction hint */}
                <div className="text-center mb-4">
                    {!isComplete ? (
                        <p className="text-sm text-gray-500 animate-pulse">
                            Click anywhere or press Enter to continue...
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Click the button below to continue
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center">
                    <button
                        onClick={handleInteraction}
                        className={`px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 ${
                            !isComplete ? 'opacity-50' : 'opacity-100'
                        }`}
                    >
                        {isComplete ? 'Continue Your Journey ✨' : 'Skip Animation →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryModal;
import React, { useState, useEffect } from 'react';

const BatchChapterModal = ({ chapter, batchNumber, onClose }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [isTyping, setIsTyping] = useState(true);

    // Split chapter into words
    const words = chapter.split(' ');

    useEffect(() => {
        if (!isTyping) return;

        if (currentIndex < words.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 80); // Slightly faster for longer content

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
            setDisplayedText(chapter);
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
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={handleInteraction}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl animate-slideUp mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Responsive padding */}
                <div className="text-center px-6 md:px-10 pt-6 md:pt-10 pb-4 md:pb-6 flex-shrink-0">
                    <div className="text-5xl md:text-7xl mb-3 md:mb-4 animate-bounce">🏆</div>
                    <div className="inline-block px-4 md:px-6 py-1.5 md:py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-3 md:mb-4">
                        <p className="text-white font-bold text-xs md:text-sm uppercase tracking-wider">
                            Chapter {batchNumber} Complete
                        </p>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2 md:mb-3">
                        A New Chapter in Your Story
                    </h2>
                    <p className="text-sm md:text-base text-gray-600">
                        You've completed all quests in Batch {batchNumber}. Here's how your journey unfolded...
                    </p>
                </div>

                {/* Chapter Content - SCROLLABLE with custom scrollbar */}
                <div className="flex-1 overflow-y-auto px-10 pb-6 scrollbar-thin">
                    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-xl p-6 md:p-8 border-2 border-purple-200 shadow-inner">
                        <div className="prose prose-base md:prose-lg max-w-none">
                            <p className="text-gray-800 leading-relaxed text-base md:text-xl whitespace-pre-wrap font-serif">
                                {displayedText}
                                {isTyping && <span className="animate-pulse">▌</span>}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer - Responsive */}
                <div className="px-6 md:px-10 pb-6 md:pb-10 pt-3 md:pt-4 flex-shrink-0 bg-white border-t border-gray-100">
                    <div className="text-center mb-3 md:mb-4">
                        {!isComplete ? (
                            <p className="text-xs md:text-sm text-gray-500 animate-pulse">
                                Click anywhere or press Enter to continue...
                            </p>
                        ) : (
                            <p className="text-xs md:text-sm text-gray-500">
                                Ready to continue your journey
                            </p>
                        )}
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleInteraction}
                            className={`px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl font-bold text-base md:text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 ${
                                !isComplete ? 'opacity-50' : 'opacity-100'
                            }`}
                        >
                            {isComplete ? 'Continue to Next Batch ✨' : 'Skip Animation →'}
                        </button>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 left-4 text-2xl md:text-4xl opacity-20">✨</div>
                <div className="absolute top-4 right-4 text-2xl md:text-4xl opacity-20">✨</div>
            </div>
        </div>
    );
};

export default BatchChapterModal;
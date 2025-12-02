import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Typewriter component with delay support
const TypewriterText = ({ text, delay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [started, setStarted] = useState(false);
    
    const words = text.split(' ');
    
    // Wait for delay before starting
    useEffect(() => {
        const startTimer = setTimeout(() => {
            setStarted(true);
        }, delay);
        
        return () => clearTimeout(startTimer);
    }, [delay]);
    
    // Type words one by one
    useEffect(() => {
        if (!started) return;
        
        if (currentIndex < words.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + (prev ? ' ' : '') + words[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 60);
            
            return () => clearTimeout(timer);
        } else if (onComplete) {
            // Notify parent when done
            onComplete();
        }
    }, [currentIndex, words, started]);
    
    return (
        <>
            {displayedText}
            {started && currentIndex < words.length && <span className="animate-pulse">▌</span>}
        </>
    );
};

const GrandFinaleModal = ({ persona, onClose, onRestartJourney }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Celebration, 2: Message, 3: Options
    const [showConfetti, setShowConfetti] = useState(true);

    // Confetti disappears after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        }
    };

    const handleViewJourney = () => {
        navigate('/journey');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: '-10%',
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`
                            }}
                        >
                            {['🎉', '✨', '🌟', '💜', '💖', '🏆', '👑'][Math.floor(Math.random() * 7)]}
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                
                {/* Step 1: Epic Celebration */}
                {step === 1 && (
                    <div className="p-12 text-center">
                        <div className="text-8xl mb-6 animate-bounce">👑</div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            You Did It.
                        </h1>
                        <p className="text-2xl text-gray-700 mb-8">
                            All <span className="font-bold text-purple-600">30 quests</span> complete.
                        </p>
                        
                        <div className="max-w-xl mx-auto mb-8">
                            <div className="grid grid-cols-10 gap-2">
                                {[...Array(10)].map((_, i) => (
                                    <div 
                                        key={i}
                                        className="h-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-3">10 Batches • 30 Quests • 100% Complete</p>
                        </div>

                        <button
                            onClick={handleNext}
                            className="px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* Step 2: The Message */}
                {step === 2 && (
                    <div className="p-12">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4 animate-fadeIn">✨</div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-fadeIn">
                                You've Become That Person
                            </h2>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 rounded-2xl p-8 mb-8 border-2 border-purple-200">
                            {/* Paragraph 1 - Fade in first */}
                            <p 
                                className="text-gray-800 text-lg leading-relaxed mb-6 font-serif opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                            >
                                Remember when you first imagined your alternate self? That confident, fearless version of you who seemed so far away?
                            </p>
                            
                            <p 
                                className="text-gray-800 text-lg leading-relaxed mb-6 font-serif opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '3s', animationFillMode: 'forwards' }}
                            >
                                <span className="font-bold text-purple-600">You're no longer imagining.</span> Through 30 acts of courage, 30 moments of choosing growth over comfort, you've transformed that vision into reality. The person you dreamed of becoming? You're living as them right now.
                            </p>

                            {/* Persona Box - Fade in */}
                            {persona?.aiGeneratedDescription && (
                                <div 
                                    className="bg-white rounded-xl p-6 mb-6 border-l-4 border-purple-500 opacity-0 animate-fadeInUp"
                                    style={{ animationDelay: '3s', animationFillMode: 'forwards' }}
                                >
                                    <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                                        Your Vision
                                    </p>
                                    <p className="text-gray-700 italic leading-relaxed">
                                        {persona.aiGeneratedDescription}
                                    </p>
                                </div>
                            )}

                            {/* Paragraph 2 - Fade in */}
                            <p 
                                className="text-gray-800 text-lg leading-relaxed mb-6 font-serif opacity-0 animate-fadeInUp"
                                style={{ animationDelay: persona?.aiGeneratedDescription ? '5s' : '4s', animationFillMode: 'forwards' }}
                            >
                                You may have reached the end of this program, but not the end of the person you are learning to love. Every challenge you met, every small victory you claimed—they have shaped a stronger you.
                            </p>

                            {/* Final Message - Fade in last */}
                            <p 
                                className="text-gray-800 text-xl leading-relaxed font-bold text-center text-purple-600 opacity-0 animate-fadeInUp"
                                style={{ animationDelay: persona?.aiGeneratedDescription ? '7s' : '6s', animationFillMode: 'forwards' }}
                            >
                                Thank you for walking this journey. Keep tending to your growth—your future self is already grateful and very proud of you.
                            </p>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={handleNext}
                                className="px-10 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all opacity-0 animate-fadeInUp"
                                style={{ animationDelay: persona?.aiGeneratedDescription ? '3.8s' : '3s', animationFillMode: 'forwards' }}
                            >
                                What's Next? →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Options */}
                {step === 3 && (
                    <div className="p-12">
                        <div className="text-center mb-10">
                            <div className="text-6xl mb-4">🌟</div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                Your Next Chapter Awaits
                            </h2>
                            <p className="text-gray-600">
                                What would you like to do?
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* View Journey */}
                            <button
                                onClick={handleViewJourney}
                                className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all text-left group hover:shadow-xl"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📖</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    Relive Your Journey
                                </h3>
                                <p className="text-gray-600">
                                    Read all your story chapters and see how far you've come
                                </p>
                            </button>

                            {/* Start New Journey */}
                            <button
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to start a new journey? This will create a new persona and fresh quests.')) {
                                        onRestartJourney();
                                    }
                                }}
                                className="p-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl text-white hover:shadow-2xl transition-all text-left group transform hover:scale-105"
                            >
                                <div className="text-4xl mb-4">🚀</div>
                                <h3 className="text-xl font-bold mb-2">
                                    Begin a New Journey
                                </h3>
                                <p className="text-purple-100">
                                    Create a new alternate self and start fresh with 30 new quests
                                </p>
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GrandFinaleModal;
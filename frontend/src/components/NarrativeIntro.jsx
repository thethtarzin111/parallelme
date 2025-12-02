import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NarrativeIntro = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Opening, 2: Instructions, 3: Ready

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            // Mark as seen and go to persona creation
            localStorage.setItem('introSeen', 'true');
            navigate('/persona/create');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black" style={{ width: '100vw', overflowX: 'hidden' }}>
                
                {/* Step 1: Opening Narrative */}
                {step === 1 && (
                    <div className="w-full text-center space-y-8 animate-fadeIn pt-20">
                        {/* Glowing orb animation */}
                        <div className="relative mx-auto w-32 h-32 mb-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
                            <div className="absolute inset-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full animate-pulse"></div>
                            <div className="absolute inset-8 bg-white rounded-full"></div>
                        </div>

                        {/* Narrative text */}
                        <div className="space-y-6 text-purple-100">
                            <p 
                                className="text-xl leading-relaxed opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                            >
                                The air hums. A soft light curls around your chest.
                            </p>
                            
                            <p 
                                className="text-xl leading-relaxed opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
                            >
                                You've been summoned — not by a sorcerer, not by a hero —<br/>
                                but by the strength inside you that has slept too long.
                            </p>
                            
                            <p 
                                className="text-xl leading-relaxed opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '3s', animationFillMode: 'forwards' }}
                            >
                                It forms a figure before you: familiar eyes, familiar smile… but <span className="text-pink-300 font-semibold">shining</span>.
                            </p>
                            
                            <p 
                                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '4s', animationFillMode: 'forwards' }}
                            >
                                Your other self.
                            </p>
                            
                            <p 
                                className="text-xl italic opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '5s', animationFillMode: 'forwards' }}
                            >
                                "Walk with me," they say. "There is a story only we can write."
                            </p>
                        </div>

                        <button
                            onClick={handleNext}
                            className="mt-12 px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all opacity-0 animate-fadeInUp"
                            style={{ animationDelay: '6s', animationFillMode: 'forwards' }}
                        >
                            Continue →
                        </button>
                    </div>
                )}

                {/* Step 2: Instructions */}
                {step === 2 && (
                    <div className="min-w space-y-8 animate-fadeIn pt-12">
                        {/* Header */}
                        <div className="text-center space-y-4 mb-12">
                            <div className="text-6xl mb-4 opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '0s', animationFillMode: 'forwards' }}
                            >
                                ✨
                            </div>
                            <p>

                            </p>
                            <p 
                                className="text-purple-200 text-lg opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                            >
                                The light around you steadies.
                            </p>
                            <p 
                                className="text-purple-200 text-lg opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
                            >
                                The presence before you — your other self — watches with a knowing calm.
                            </p>
                            <p 
                                className="text-purple-100 text-xl italic opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
                            >
                                "Before we begin," they say, "you must understand the rules of this world.<br/>
                                Every step you take here shapes me… and shapes you."
                            </p>
                        </div>

                        {/* Rules */}
                        <div className="space-y-6 max-w-3xl mx-auto px-4">
                            {[
                                {
                                    icon: '✦',
                                    title: 'Answer with Truth',
                                    desc: 'The path responds only to honesty. When questions rise before you, speak as you are — so you may grow into who you are meant to become.',
                                    delay: '1.5s'
                                },
                                {
                                    icon: '✦',
                                    title: 'Complete the Quests',
                                    desc: 'Each quest is a test, a lesson, a fragment of your story. With every one you finish, the world reveals a new glimpse of the self waiting on the other side.',
                                    delay: '2s'
                                },
                                {
                                    icon: '✦',
                                    title: 'Chapters Await',
                                    desc: 'Three quests form a cycle. Finish a cycle, and the veil parts wider — offering you a deeper chapter of the tale you\'re weaving together.',
                                    delay: '2.5s'
                                },
                                {
                                    icon: '✦',
                                    title: 'Watch Yourself Rise',
                                    desc: 'With each step, your parallel self shifts — standing taller, shining brighter, reflecting the strength you reclaim.',
                                    delay: '3s'
                                },
                                {
                                    icon: '✦',
                                    title: 'Walk the Whole Journey',
                                    desc: 'At the end lies not a final battle, but a revelation — a truth about who you are, and who you have always been.',
                                    delay: '3.5s'
                                }
                            ].map((rule, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl p-6 opacity-0 animate-fadeInUp"
                                    style={{ animationDelay: rule.delay, animationFillMode: 'forwards' }}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="text-3xl text-pink-300">{rule.icon}</span>
                                        <div>
                                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-500 mb-2">
                                                {rule.title}
                                            </h3>
                                            <p className="text-purple-100 leading-relaxed">
                                                {rule.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="text-center space-y-6 pt-8 pb-8">
                            <p 
                                className="text-purple-100 text-lg italic opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '4s', animationFillMode: 'forwards' }}
                            >
                                Your parallel self turns to you, the markings fading into stardust.
                            </p>
                            <p 
                                className="text-xl text-pink-300 opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '4.5s', animationFillMode: 'forwards' }}
                            >
                                "If you're ready," they whisper,<br/>
                                "the first step awaits."
                            </p>
                            
                            <button
                                onClick={() => {
                                navigate('/persona/create');
                                
                                }}
                                className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all opacity-0 animate-fadeInUp"
                                style={{ animationDelay: '5s', animationFillMode: 'forwards' }}
                            >
                                Begin Your Journey ✨
                            </button>
                        </div>
                    </div>
                )}
            </div>
    );
};

export default NarrativeIntro;
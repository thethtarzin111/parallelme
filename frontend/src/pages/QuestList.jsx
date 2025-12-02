import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import questService from '../services/questService';
import Navbar from '../components/Navbar';
import QuestCard from '../components/QuestCard';
import QuestCompletionModal from '../components/QuestCompletionModal';
import CelebrationModal from '../components/CelebrationModal';
import Toast from '../components/Toast';
import storyService from '../services/storyService';
import StoryModal from '../components/StoryModal';
import BatchChapterModal from '../components/BatchChapterModal';
import GrandFinaleModal from '../components/GrandFinaleModal';
import personaService from '../services/personaService';

const QuestList = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [startingQuestId, setStartingQuestId] = useState(null);
    const [currentBatch, setCurrentBatch] = useState(0);

    // States for quest story generation
    const [storyData, setStoryData] = useState(null);
    const [generatingStory, setGeneratingStory] = useState(false);

    // States for batch chapter story generation
    const [batchChapterData, setBatchChapterData] = useState(null);
    const [pendingBatchChapter, setPendingBatchChapter] = useState(null);
    const [generatingBatchChapter, setGeneratingBatchChapter] = useState(false);

    // New state for quest completion modals
    const [completingQuest, setCompletingQuest] = useState(null);
    const [celebrationData, setCelebrationData] = useState(null);

    // State for grand finale
    const [showGrandFinale, setShowGrandFinale] = useState(false);
    const [userPersona, setUserPersona] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    const categories = ['All', 'Social', 'Academic', 'Personal', 'Creative', 'Career', 'Health'];

    // Fetch quests on component mount
    useEffect(() => {
        fetchQuests();
    }, []);

    const fetchQuests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await questService.getQuests();
            setQuests(data.quests || []);
            setCurrentBatch(data.currentBatch || 0);
        } catch (err) {
            console.error('Error fetching quests:', err);
            setError(err.response?.data?.message || 'Failed to load quests');
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuest = async (questId) => {
        try {
            setStartingQuestId(questId);
            await questService.startQuest(questId);
            
            // Refresh quests to show updated status
            await fetchQuests();
            
            // Show success message
            setToast({ 
                message: 'Quest started! You got this! 💪', 
                type: 'success',
                duration: 5000 });
        } catch (err) {
            console.error('Error starting quest:', err);
            setToast({ 
                message: err.response?.data?.message || 'Failed to start quest', 
                type: 'error' 
            });
        } finally {
            setStartingQuestId(null);
        }
    };

    // Function to handle completing quest
    const handleCompleteQuest = async (questId, reflection) => {
        try {
            const response = await questService.completeQuest(questId, reflection);
            
            console.log('=== QUEST COMPLETION RESPONSE ===');
            console.log('batchCompleted:', response.batchCompleted);
            console.log('batchNumber:', response.quest.batchNumber);
            
            // Check if this is the FINAL quest (Batch 10 complete)
            if (response.batchCompleted && response.quest.batchNumber === 10) {
                console.log('🎉 FINAL BATCH COMPLETE! Preparing grand finale...');
                // Grand finale will be shown AFTER batch chapter
            }
            
            // Store batch info if this completed a batch
            if (response.batchCompleted) {
                setPendingBatchChapter({
                    batchNumber: response.quest.batchNumber,
                    questTitle: response.quest.title,
                    isFinalBatch: response.quest.batchNumber === 10  // Track if it's final batch
                });
                console.log('Batch completed! Saved for chapter generation');
            }
            
            // Show celebration
            setCelebrationData({
                quest: response.quest,
                batchCompleted: response.batchCompleted,
                newBatchNumber: response.newBatchNumber,
                questId: questId
            });
            
            // Refresh quests
            await fetchQuests();
        } catch (err) {
            console.error('Error completing quest:', err);
            throw err;
        }
    };

    // Filter quests by category
    const filteredQuests = selectedCategory === 'All'
        ? quests
        : quests.filter(q => q.category === selectedCategory);
        
    // Function to generate story after celebration
    const handleGenerateStory = async (questId, questTitle) => {
        try {
            setGeneratingStory(true);
            const story = await storyService.generateQuestSnippet(questId);
            
            setStoryData({
                content: story.content,
                questTitle: questTitle
            });
        } catch (err) {
            console.error('Error generating story:', err);
            setToast({
                message: 'Could not generate story snippet',
                type: 'error'
            });
        } finally {
            setGeneratingStory(false);
        }
    };

    // Function to generate batch chapter after completing all quests in a batch
    const handleGenerateBatchChapter = async (batchNumber) => {
        try {
            setGeneratingBatchChapter(true);
            const chapter = await storyService.generateBatchChapter(batchNumber);
            
            setBatchChapterData({
                content: chapter.content,
                batchNumber: batchNumber
            });
        } catch (err) {
            console.error('Error generating batch chapter:', err);
            setToast({
                message: 'Could not generate batch chapter',
                type: 'error'
            });
        } finally {
            setGeneratingBatchChapter(false);
        }
    };

    // loading check and screen
    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your quests...</p>
                </div>
            </div>
        );
    }

    // Error check
    if (error) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-white">
                <Navbar />
                <div className="max-w-4xl mx-auto p-6 mt-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <div className="text-5xl mb-4">😞</div>
                        <p className="font-semibold text-red-800 text-lg mb-2">Error loading quests</p>
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                        <button 
                            onClick={fetchQuests}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main content
    return (
        <div className="w-screen h-screen bg-gray-50">
            <Navbar />
            
            <div className="w-full px-8 py-6">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        Your Quests
                    </h2>
                    <p className="text-gray-600">
                        {currentBatch > 0 ? `Batch ${currentBatch} of 10` : 'Get started on your journey!'}
                    </p>
                </div>

                {/* TESTING BUTTON - REMOVE COMMENT TO TEST
                <button 
                    onClick={() => setShowGrandFinale(true)}
                    className="fixed bottom-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg z-50"
                >
                    Test Finale
                </button>
                */}

                {/* Category Filters */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                selectedCategory === category
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Quest Count */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing {filteredQuests.length} quest{filteredQuests.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Quest Grid - Full width with responsive columns */}
                {filteredQuests.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            No quests available
                        </h3>
                        <p className="text-gray-600">
                            {selectedCategory === 'All' 
                                ? "Complete your current quests to unlock more!"
                                : `No ${selectedCategory} quests available right now.`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {filteredQuests.map(quest => (
                            <QuestCard
                                key={quest._id}
                                quest={quest}
                                onStart={handleStartQuest}
                                onComplete={(quest) => setCompletingQuest(quest)}
                                isLoading={startingQuestId === quest._id}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Completion Modal */}
            {completingQuest && (
                <QuestCompletionModal
                    quest={completingQuest}
                    onClose={() => setCompletingQuest(null)}
                    onComplete={handleCompleteQuest}
                />
            )}

            {/* Celebration Modal */}
            {celebrationData && (
                <CelebrationModal
                    quest={celebrationData.quest}
                    batchCompleted={celebrationData.batchCompleted}
                    newBatchNumber={celebrationData.newBatchNumber}
                    onClose={() => {
                        setCelebrationData(null);
                        // ⭐ Generate story after closing celebration
                        if (celebrationData.questId && celebrationData.quest) {
                            handleGenerateStory(celebrationData.questId, celebrationData.quest.title);
                        }
                        fetchQuests(); // Refresh to show new quests if batch unlocked
                    }}
                />
            )}

            {/* Story Modal */}
            {storyData && (
                <StoryModal
                    story={storyData.content}
                    questTitle={storyData.questTitle}
                    onClose={() => {
                        console.log('=== STORY MODAL CLOSING ===');
                        console.log('pendingBatchChapter:', pendingBatchChapter);
                        
                        setStoryData(null);
                        
                        // Check if we need to generate batch chapter
                        if (pendingBatchChapter) {
                            console.log('✅ TRIGGERING BATCH CHAPTER GENERATION');
                            console.log('Batch number:', pendingBatchChapter.batchNumber);
                            
                            // Store if it's final BEFORE clearing
                            const isFinal = pendingBatchChapter.isFinalBatch;
                            
                            handleGenerateBatchChapter(pendingBatchChapter.batchNumber);
                            setPendingBatchChapter(null);
                        } else {
                            console.log('No pending batch chapter');
                        }
                    }}
                />
            )}

            {/* Batch Chapter Modal */}
            {batchChapterData && (
                <BatchChapterModal
                    chapter={batchChapterData.content}
                    batchNumber={batchChapterData.batchNumber}
                    onClose={async () => {
                        const wasFinalBatch = batchChapterData.batchNumber === 10;
                        setBatchChapterData(null);
                        
                        if (wasFinalBatch) {
                            try {
                                const personaData = await personaService.getMyPersona();
                                setUserPersona(personaData);
                            } catch (err) {
                                console.error('Error fetching persona:', err);
                            }
                            setShowGrandFinale(true);
                        }
                    }}
                />
            )}

            {/* Grand Finale Modal */}
            {showGrandFinale && (
                <GrandFinaleModal
                    persona={userPersona}
                    onClose={() => setShowGrandFinale(false)}
                    onRestartJourney={() => {
                    setShowGrandFinale(false);
                    navigate('/persona/create');
                }}
                />
            )}

            {/* Loading overlay for batch chapter generation */}
            {generatingBatchChapter && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-10 text-center max-w-md">
                        <div className="text-6xl mb-4 animate-bounce">📖</div>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-xl font-bold text-gray-800 mb-2">
                            Writing Your Chapter...
                        </p>
                        <p className="text-sm text-gray-600">
                            ✨ Crafting your transformation story
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            This may take a moment...
                        </p>
                    </div>
                </div>
            )}

            {/* Loading overlay for story generation */}
            {generatingStory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 text-center max-w-md">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                        <p className="text-lg font-semibold text-gray-800 mb-2">
                            Creating your story...
                        </p>
                        <p className="text-sm text-gray-600">
                            ✨ Imagining your alternate reality
                        </p>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default QuestList;
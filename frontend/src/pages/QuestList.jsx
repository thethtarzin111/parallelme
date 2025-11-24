import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import questService from '../services/questService';
import Navbar from '../components/Navbar';
import QuestCard from '../components/QuestCard';
import QuestCompletionModal from '../components/QuestCompletionModal';
import CelebrationModal from '../components/CelebrationModal';

const QuestList = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [startingQuestId, setStartingQuestId] = useState(null);
    const [currentBatch, setCurrentBatch] = useState(0);

    // New state for completion modals
    const [completingQuest, setCompletingQuest] = useState(null);
    const [celebrationData, setCelebrationData] = useState(null);

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
            alert('Quest started! You got this! 💪');
        } catch (err) {
            console.error('Error starting quest:', err);
            alert(err.response?.data?.message || 'Failed to start quest');
        } finally {
            setStartingQuestId(null);
        }
    };

    // Function to handle completing quest
    const handleCompleteQuest = async (questId, reflection) => {
        try {
            const response = await questService.completeQuest(questId, reflection);
            
            // Show celebration
            setCelebrationData({
                quest: response.quest,
                batchCompleted: response.batchCompleted,
                newBatchNumber: response.newBatchNumber
            });
            
            // Refresh quests
            await fetchQuests();
        } catch (err) {
            console.error('Error completing quest:', err);
            throw err; // Re-throw to be caught by modal
        }
    };

    // Filter quests by category
    const filteredQuests = selectedCategory === 'All'
        ? quests
        : quests.filter(q => q.category === selectedCategory);

    // ✅ Single loading check
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your quests...</p>
                </div>
            </div>
        );
    }

    // ✅ Single error check
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
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

    // ✅ Main content
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        Your Quests
                    </h2>
                    <p className="text-gray-600">
                        {currentBatch > 0 ? `Batch ${currentBatch} of 10` : 'Get started on your journey!'}
                    </p>
                </div>

                {/* Category Filters */}
                <div className="mb-6 flex gap-2 flex-wrap">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                selectedCategory === category
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

                {/* Quest Grid */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        fetchQuests(); // Refresh to show new quests if batch unlocked
                    }}
                />
            )}
        </div>
    );
};

export default QuestList;
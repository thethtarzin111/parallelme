import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import storyService from '../services/storyService';
import Navbar from '../components/Navbar';

const Journey = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Quest Snippets, Batch Chapters

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const data = await storyService.getAllStories();
            setStories(data);
        } catch (err) {
            console.error('Error fetching stories:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter stories
    const filteredStories = filter === 'All' 
        ? stories 
        : stories.filter(s => {
            if (filter === 'Quest Snippets') return s.storyType === 'quest_snippet';
            if (filter === 'Batch Chapters') return s.storyType === 'batch_chapter';
            return true;
        });

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your journey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" style={{ width: '100vw', overflowX: 'hidden' }}>
            <Navbar />
            
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '100vw' }}>
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                Your Journey
                            </h1>
                            <p className="text-gray-600">
                                The story of your transformation, one quest at a time
                            </p>
                        </div>
                        
                        {/* Link to Dashboard */}
                        <Link 
                            to="/dashboard"
                            className="px-6 py-3 bg-white border-2 border-purple-200 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center gap-2"
                        >
                         
                            View Stats
                        </Link>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-3 flex-wrap">
                        {['All', 'Quest Snippets', 'Batch Chapters'].map(option => (
                            <button
                                key={option}
                                onClick={() => setFilter(option)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    filter === option
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                        : 'bg-white text-purple-800 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    <p className="text-sm text-gray-500 mt-3">
                        {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'}
                    </p>
                </div>

                {/* Empty State */}
                {filteredStories.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">🌱</div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                            Your Story Begins Here
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Complete quests to unlock chapters of your transformation
                        </p>

                        <button
                            onClick={() => {
                                navigate('/quests');
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition"
                        >
                            Start Your First Quest
                        </button>

                    </div>
                ) : (
                    /* Timeline */
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-purple-300"></div>

                        {/* Story Cards */}
                        <div className="space-y-8">
                            {filteredStories.map((story, index) => (
                                <div 
                                    key={story._id} 
                                    className="relative pl-20 animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Timeline dot */}
                                    <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white shadow-lg ${
                                        story.storyType === 'batch_chapter'
                                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                            : 'bg-gradient-to-br from-purple-400 to-pink-400'
                                    }`}>
                                    </div>

                                    {/* Story Card */}
                                    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 border-l-4 ${
                                        story.storyType === 'batch_chapter'
                                            ? 'border-purple-500'
                                            : 'border-pink-400'
                                    }`}>
                                        {/* Card Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                {/* Badge */}
                                                <div className="inline-block mb-2">
                                                    {story.storyType === 'batch_chapter' ? (
                                                        <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-bold uppercase">
                                                            🏆 Chapter {story.batchNumber}
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold">
                                                            ✨ Quest Story
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                    {story.questTitle || `Batch ${story.batchNumber} Complete`}
                                                </h3>

                                                {/* Date */}
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(story.generatedAt)}
                                                </p>
                                            </div>

                                            {/* Icon */}
                                            <div className="text-3xl">
                                                {story.storyType === 'batch_chapter' ? '🏆' : '📖'}
                                            </div>
                                        </div>

                                        {/* Story Content */}
                                        <div className={`p-4 rounded-lg ${
                                            story.storyType === 'batch_chapter'
                                                ? 'bg-gradient-to-br from-purple-50 to-pink-50'
                                                : 'bg-purple-50'
                                        }`}>
                                            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                                {story.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Journey;
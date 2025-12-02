import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import questService from '../services/questService';
import Navbar from '../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questService.getQuestStats();
      setStats(data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Colors for pie chart
  const COLORS = {
    Social: '#3B82F6',      // Blue
    Academic: '#A855F7',    // Purple
    Personal: '#10B981',    // Green
    Creative: '#EC4899',    // Pink
    Career: '#F59E0B',      // Yellow
    Health: '#EF4444'       // Red
  };

  // Get motivational message based on progress
  const getMotivationalMessage = () => {
    if (!stats) return '';
    
    const { completed, confidenceScore } = stats;
    
    if (completed === 0) {
      return "Ready to start your journey? Take on your first quest! 🚀";
    } else if (completed < 5) {
      return "Great start! Keep building momentum! 💪";
    } else if (completed < 10) {
      return "You're making real progress! Keep going! 🌟";
    } else if (completed < 20) {
      return "Incredible growth! You're unstoppable! 🔥";
    } else if (completed >= 30) {
      return "You completed all 30 quests! You're amazing! 🏆";
    } else {
      return "You're doing fantastic! Keep pushing forward! ⭐";
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 mt-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-5xl mb-4">😞</div>
            <p className="font-semibold text-red-800 text-lg mb-2">Error loading dashboard</p>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchStats}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Prepare category data for pie chart (only categories with quests)
  const categoryData = Object.entries(stats.categoryBreakdown)
    .filter(([_, data]) => data.completed > 0)
    .map(([category, data]) => ({
      name: category,
      value: data.completed,
      color: COLORS[category]
    }));

  return (
    <div className="min-h-screen bg-gray-50" style={{ width: '100vw', overflowX: 'hidden' }}>
        <Navbar />
        
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6" style={{ maxWidth: '100vw' }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Dashboard</h1>
          <p className="text-gray-600">{getMotivationalMessage()}</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Completed */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Quests Completed</p>
                <p className="text-4xl font-bold text-gray-800">{stats.completed}</p>
                <p className="text-xs text-gray-500 mt-1">of {stats.totalQuests} total</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Current Streak</p>
                <p className="text-4xl font-bold text-gray-800">{stats.streak}</p>
                <p className="text-xs text-gray-500 mt-1">day{stats.streak !== 1 ? 's' : ''}</p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Confidence Score</p>
                <p className="text-4xl font-bold text-gray-800">{stats.confidenceScore}</p>
                <p className="text-xs text-gray-500 mt-1">out of 100</p>
              </div>
              <div className="text-4xl">💪</div>
            </div>
          </div>

          {/* Total Points */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Points</p>
                <p className="text-4xl font-bold text-gray-800">{stats.totalPoints}</p>
                <p className="text-xs text-gray-500 mt-1">points earned</p>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quests by Category</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-gray-400">
                <div className="text-center">
                  <div className="text-5xl mb-2"></div>
                  <p className="text-sm">Complete quests to see breakdown</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Batch Progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Batch Progress</h3>
            <span className="text-sm text-gray-600">
              Batch {stats.batchProgress.currentBatch} of {stats.batchProgress.totalBatches}
            </span>
          </div>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block text-purple-600">
                  {stats.batchProgress.percentage}% Complete
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-purple-100">
              <div 
                style={{ width: `${stats.batchProgress.percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{activity.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.category === 'Social' ? 'bg-blue-100 text-blue-800' :
                        activity.category === 'Academic' ? 'bg-purple-100 text-purple-800' :
                        activity.category === 'Personal' ? 'bg-green-100 text-green-800' :
                        activity.category === 'Creative' ? 'bg-pink-100 text-pink-800' :
                        activity.category === 'Career' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.completedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⭐</span>
                    <span className="font-bold text-yellow-600">{activity.points}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-5xl mb-2">🎯</div>
              <p className="text-sm">No activity yet. Complete your first quest!</p>
            </div>
          )}
        </div>
      </div>

      {/* Link to Journey */}
      <div className="mt-8 text-center">

        <button
          onClick={() => {
            navigate('/journey');
          }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
          
        >
          <span>Relive Your Journey</span>
          <span>→</span>
        </button>

        <p className="text-sm text-gray-500 mt-2">
          Read the story of your transformation
        </p>

      </div>

      <hr className="my-2" />

    
    </div>
  );
};

export default Dashboard;
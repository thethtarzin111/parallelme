import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { personaAPI } from './services/api';
import Login from './pages/Login';
import Register from './pages/Register';
import PersonaCreation from './pages/PersonaCreation';
import QuestList from './pages/QuestList';
import CompletedQuests from './pages/CompletedQuests';
import Dashboard from './pages/Dashboard';
import Journey from './pages/Journey';
import NarrativeIntro from './components/NarrativeIntro';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Home component with persona check
const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hasPersona, setHasPersona] = useState(false);
  const [checkingPersona, setCheckingPersona] = useState(true);

  useEffect(() => {
    checkForPersona();
  }, []);

  const checkForPersona = async () => {
    try {
      setCheckingPersona(true);
      const data = await personaAPI.getMyPersona();
      
      if (data.persona) {
        setHasPersona(true);
        // Automatically redirect to quests if persona exists
        navigate('/quests');
      } else {
        setHasPersona(false);
      }
    } catch (error) {
      // 404 means no persona exists - that's fine
      if (error.response?.status === 404) {
        setHasPersona(false);
      } else {
        console.error('Error checking persona:', error);
      }
    } finally {
      setCheckingPersona(false);
    }
  };

  if (checkingPersona) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">👋</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600 mb-6">{user?.email}</p>
        
        <div className="space-y-3">
          {!hasPersona ? (
            <button
              onClick={() => navigate('/persona/create')}
              className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition">
              Create Your Persona ✨
            </button>
          ) : (
            <button
              onClick={() => navigate('/quests')}
              className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition">
              View Your Quests 🎯
            </button>
          )}
          
          <button
            onClick={logout}
            className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/intro" element={<NarrativeIntro />} />
          <Route path="/journey" element={<Journey />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/persona/create"
            element={
              <ProtectedRoute>
                <PersonaCreation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quests"
            element={
              <ProtectedRoute>
                <QuestList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quests/completed"
            element={
              <ProtectedRoute>
                <CompletedQuests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
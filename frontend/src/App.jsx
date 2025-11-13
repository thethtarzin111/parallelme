import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PersonaCreation from './pages/PersonaCreation';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Temporary Home component
const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          <button
            onClick={() => navigate('/persona/create')}
            className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition">
          
            Create Your Persona ✨
          </button>
          <button
            onClick={logout}
            className="w-full py-3 border-2 border-gray-300 text-white-700 rounded-lg font-semibold hover:bg-gray-50 transition"
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
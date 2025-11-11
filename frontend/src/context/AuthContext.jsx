import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async() => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await authAPI.getCurrentUser();
                    setUser(data.user);
                } catch (e) {
                    console.error('Auth check failed:', e);
                    localStorage.removeItem('token');
                }
            }

            setLoading(false);
        };

        checkAuth();
    }, []);

    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);
            const data = await authAPI.register(userData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (e) {
            const message = e.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);
            const data = await authAPI.login(credentials);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            return { success: true };
        } catch (e) {
            const message = e.response?.daata?.message || 'Invalid Email or Password';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) { // Can also use if (!context)
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;

};
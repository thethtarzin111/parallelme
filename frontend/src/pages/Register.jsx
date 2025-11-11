import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmedPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({...prev, [name]: ''}));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirmed password validation
        if (!formData.confirmedPassword) {
            newErrors.confirmedPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmedPassword) {
            newErrors.confirmedPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) return;

        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
        });

        if (result.success) {
            navigate('/');
        } else {
            setApiError(result.error);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-white">


            <div className = "max-w-md w-full bg-white rounded-2xl shadow-xl p-8">

                <div className="text-center mb-8">

                    <h1 className = "text-3xl font-bold text-gray-800 mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-600">
                        Start your journey with ParallelMe
                    </p>
                </div>

                {apiError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <label htmlFor = "name" className = "block text-sm font-medium text-gray-700 mb-1">
                        Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className= {`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>
                    

                    {/* Email Field */}
                    <div>
                        <label htmlFor = "email" className = "block text-sm font-medium text-gray-700 mb-1">
                        Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                        </div>  

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div> 

                        {/* Confirmed Password Field */}
                        <div>
                            <label htmlFor="confirmedPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmedPassword"
                                name="confirmedPassword"
                                value={formData.confirmedPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 ${
                                    errors.confirmedPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmedPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmedPassword}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${
                            loading
                                ? 'bg-purple-400 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                </form>

                {/* Login Link */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>


    </div>

    );
};

export default Register;
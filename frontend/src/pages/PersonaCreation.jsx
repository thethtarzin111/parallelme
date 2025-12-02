import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { personaAPI } from '../services/api';


const PersonaCreation = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fears: '',
        inspirations: '',
        traits: ''
    });

    const [generatedPersona, setGeneratedPersona] = useState(null);

    const totalSteps = 4;

    // Check if persona already exists on mount
    useEffect(() => {
        const checkExistingPersona = async () => {
            try {
                const existing = await personaAPI.get();
                if (existing) {
                    // Persona exists, redirect to quests
                    navigate('/quests');
                }
            } catch (err) {
                // No persona found, continue with creation
                console.log('No existing persona, proceeding with creation');
            }
        };
        
        checkExistingPersona();
    }, [navigate]);

    // Handle input changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    // Validate current step
    const validateStep = () => {
        if (currentStep === 1 && !formData.fears.trim()) {
            setError('Please share at least one fear.');
            return false;
        }
        if (currentStep === 2 && !formData.inspirations.trim()) {
            setError('Please share at least one inspiration.');
            return false;
        }
        if (currentStep === 3 && !formData.traits.trim()) {
            setError('Please share at least one personality trait.');
            return false;
        }
        return true;
    };

    // Navigate to next step
    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => prev + 1);
        }
    };

    // Navigate to previous step
    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
        setError('');
    }

    // Submit and generate persona
    const handleSubmit = async () => {
        if (!validateStep()) return;
        setLoading(true);
        setError('');

        try {
            // Convert comma-separated strings to arrays
            const personaData = {
                fears: formData.fears.split(',').map(item=>item.trim()).filter(Boolean),
                inspirations: formData.inspirations.split(',').map(item=>item.trim()).filter(Boolean),
                traits: formData.traits.split(',').map(item=>item.trim()).filter(Boolean)
            };

            console.log('Submitting persona data:', personaData);

            const response = await personaAPI.create(personaData);
            console.log('Persona created:', response);

            setGeneratedPersona(response.persona);
            setCurrentStep(5); // Move to final step
        } catch (e) {
            console.error('Error creating persona:', e)
            setError(e.response?.data?.message || 'Failed to create persona. Please try again');
        } finally {
            setLoading(false);
        }
    };

    // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">What are your fears?</h2>
            <p className="text-gray-600">
              Share the things that hold you back. What makes you anxious or afraid?
            </p>
            <textarea
              value={formData.fears}
              onChange={(e) => handleChange('fears', e.target.value)}
              placeholder="e.g., public speaking, rejection, failure, being judged..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-gray-700"
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              Tip: Separate multiple fears with commas
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Who inspires you?</h2>
            <p className="text-gray-600">
              Think of people (real or fictional) who embody qualities you admire.
            </p>
            <textarea
              value={formData.inspirations}
              onChange={(e) => handleChange('inspirations', e.target.value)}
              placeholder="e.g., Michelle Obama, my grandmother, Hermione Granger, a teacher who believed in me..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-gray-700"
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              Tip: They can be real people, fictional characters, or even qualities embodied by someone you know
            </p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">What traits do you wish you had?</h2>
            <p className="text-gray-600">
              Imagine your best self. What qualities would define you?
            </p>
            <textarea
              value={formData.traits}
              onChange={(e) => handleChange('traits', e.target.value)}
              placeholder="e.g., confident, articulate, creative, brave, empathetic, decisive..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none text-gray-700"
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              Tip: Think about the person you aspire to become
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Review Your Answers</h2>
            <p className="text-gray-600">
              Take a moment to review what you've shared. You can go back to edit anything.
            </p>

            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">Your Fears:</h3>
                <p className="text-gray-700">{formData.fears}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Your Inspirations:</h3>
                <p className="text-gray-700">{formData.inspirations}</p>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="font-semibold text-pink-900 mb-2">Desired Traits:</h3>
                <p className="text-gray-700">{formData.traits}</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
          </div>
        );

      case 5:
        return (
            <div className="space-y-6">
                <div className="text-center mb-8">
                    <div 
                        className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 opacity-0 animate-fadeInUp"
                        style={{ animationDelay: '0s', animationFillMode: 'forwards' }}
                    >
                        <span className="text-4xl">✨</span>
                    </div>
                    <h2 
                        className="text-3xl font-bold text-gray-800 mb-2 opacity-0 animate-fadeInUp"
                        style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
                    >
                        Meet Your Alternate Self
                    </h2>
                    <p 
                        className="text-gray-600 opacity-0 animate-fadeInUp"
                        style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
                    >
                        This is who you can become
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
                  {generatedPersona?.aiGeneratedDescription.split('\n\n').map((paragraph, i) => (
                      <p 
                          key={i}
                          className="prose prose-lg text-gray-700 mb-4 last:mb-0 opacity-0 animate-fadeInUp"
                          style={{ animationDelay: `${2 + (i * 1)}s`, animationFillMode: 'forwards' }}
                      >
                          {paragraph}
                      </p>
                  ))}
              </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/quests')}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 opacity-0 animate-fadeInUp"
                        style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}
                    >
                        Continue to Quests →
                    </button>
                    
                    <div 
                        className="flex gap-3 opacity-0 animate-fadeInUp"
                        style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
                    >
                        {/* Edit Button */}
                        <button
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    console.log('🗑️ Deleting persona...');
                                    await personaAPI.delete();
                                    console.log('✅ Persona deleted');
                                    
                                    setCurrentStep(4);
                                    setGeneratedPersona(null);
                                    setError('');
                                } catch (e) {
                                    console.error('❌ Error deleting persona:', e);
                                    setError('Failed to delete persona. Please try again.');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="flex-1 py-3 border-2 border-purple-300 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition disabled:opacity-50"
                        >
                            {loading ? '⏳' : '←'} Edit My Answers
                        </button>
                        
                        {/* Start Over Button */}
                        <button
                            onClick={async () => {
                                const confirmed = window.confirm(
                                    'Are you sure? This will delete your current persona and start fresh.'
                                );
                                
                                if (confirmed) {
                                    try {
                                        setLoading(true);
                                        console.log('🗑️ Deleting persona...');
                                        await personaAPI.delete();
                                        console.log('✅ Persona deleted');
                                        
                                        setCurrentStep(1);
                                        setFormData({ fears: '', inspirations: '', traits: '' });
                                        setGeneratedPersona(null);
                                        setError('');
                                    } catch (e) {
                                        console.error('❌ Error deleting persona:', e);
                                        setError('Failed to delete persona. Please try again.');
                                    } finally {
                                        setLoading(false);
                                    }
                                }
                            }}
                            disabled={loading}
                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            {loading ? '⏳' : '🔄'} Start Over
                        </button>
                    </div>
                </div>
                
                {/* Show error if delete fails */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg opacity-0 animate-fadeInUp"
                        style={{ animationDelay: '1.8s', animationFillMode: 'forwards' }}
                    >
                        {error}
                    </div>
                )}
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        {currentStep <= 4 && (
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-purple-600">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStepContent()}

          {/* Error Message */}
          {error && currentStep !== 4 && currentStep !== 5 && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          {currentStep <= 4 && (
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && currentStep < 5 && (
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1 py-3 border-2 bg-purple-100 border-gray-700 text-black rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                >
                  ← Back
                </button>
              )}

              {currentStep < 4 && (
                <button
                  onClick={handleNext}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50"
                >
                  Next →
                </button>
              )}

              {currentStep === 4 && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating your alternate self...
                    </>
                  ) : (
                    'Create My Persona ✨'
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonaCreation;
        
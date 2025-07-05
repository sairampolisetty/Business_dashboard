import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
    const [businessName, setBusinessName] = useState('');
    const [location, setLocation] = useState('');
    
    const [submittedDetails, setSubmittedDetails] = useState(null);
    const [businessData, setBusinessData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!businessName || !location) {
            setError('Please fill out both business name and location.');
            return;
        }
        setIsLoading(true);
        setError('');
        setBusinessData(null);
        setSubmittedDetails({ name: businessName, location: location });

        try {
            const response = await fetch(`${API_URL}/business-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: businessName, location: location }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong');
            setBusinessData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegenerate = async () => {
        if (!submittedDetails) return;
        setIsRegenerating(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/regenerate-headline?name=${submittedDetails.name}&location=${submittedDetails.location}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong');
            setBusinessData(prevData => ({ ...prevData, headline: data.headline }));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsRegenerating(false);
        }
    };

    
    return (
        
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-800 text-center">Mini Local Business Dashboard</h1>
                    <p className="text-center text-gray-500 mt-2 text-base">Simulating SEO data for local businesses</p>
                    
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                            <input
                                type="text"
                                id="businessName"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-100 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="e.g., cake & co"
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="mt-1 block w-full px-4 py-3 bg-gray-100 border-gray-100 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="e.g., Guntur, Andhra Pradesh"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading} 
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? 'Loading...' : 'Get Business Data'}
                        </button>
                    </form>

                    {error && <p className="mt-4 text-center text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</p>}
                    
                    {businessData && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center mb-6">
                                <div>
                                    <p className="text-sm text-gray-500">Simulated Rating</p>
                                    <p className="text-3xl font-bold text-gray-800 flex items-center justify-center mt-1">
                                        <span className="text-yellow-400 text-4xl mr-1">★</span>
                                        {businessData.rating}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Simulated Reviews</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-1">{businessData.reviews}</p>
                                </div>
                            </div>
                            <div className="text-center bg-gray-50 p-6 rounded-lg">
                                <p className="text-sm text-gray-500 mb-2 font-medium">Latest AI-Generated SEO Headline</p>
                                <p className="text-xl font-semibold text-gray-800 italic">"{businessData.headline}"</p>
                            </div>
                            <button 
                                onClick={handleRegenerate} 
                                disabled={isRegenerating}
                                className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                {isRegenerating ? 'Regenerating...' : 'Regenerate Headline'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;

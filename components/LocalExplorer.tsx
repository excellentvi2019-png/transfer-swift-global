
import React, { useState, useEffect, useCallback } from 'react';
import { localExplore } from '../services/geminiService';
import { GroundingSource } from '../types';
import Spinner from './Spinner';

const LocalExplorer: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<{text: string; sources: GroundingSource[]} | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationError(null);
        },
        (error) => {
          setLocationError(`Error getting location: ${error.message}. Please grant permission and refresh.`);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!prompt || !location) {
      setError('Please provide a prompt and allow location access.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResponse(null);
    try {
      const result = await localExplore(prompt, location);
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, location]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-gray-100">Local Explorer</h2>
      <p className="text-gray-400">Ask questions about your surroundings. Try "What are some good cafes near me?" or "Show me historical landmarks in this area."</p>
      
      {!location && !locationError && (
        <div className="flex items-center justify-center p-4 bg-gray-800 rounded-lg">
            <Spinner />
            <p className="ml-2">Getting your location...</p>
        </div>
      )}

      {locationError && <div className="p-4 bg-red-900/50 text-red-300 rounded-lg">{locationError}</div>}

      {location && (
        <>
            <div className="flex-grow space-y-4">
                <label htmlFor="local-prompt" className="block text-sm font-medium text-gray-300">Your question</label>
                <textarea
                    id="local-prompt"
                    rows={3}
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., Any good parks for a walk nearby?"
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isLoading ? <Spinner /> : 'Explore'}
                </button>
            </div>
            
            <div className="flex-shrink-0">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Results</h3>
                <div className="w-full min-h-[16rem] bg-gray-800 rounded-lg p-4 border border-gray-700">
                    {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
                    {error && <p className="text-red-400 text-center">{error}</p>}
                    {response && (
                        <div className="space-y-4">
                            <p className="whitespace-pre-wrap">{response.text}</p>
                            {response.sources.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-300">Sources from Google Maps:</h4>
                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                        {response.sources.map((source, index) => (
                                            <li key={index}>
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                                    {source.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    {!isLoading && !error && !response && <p className="text-gray-500 text-center pt-16">Your results will appear here</p>}
                </div>
            </div>
        </>
      )}
    </div>
  );
};

export default LocalExplorer;

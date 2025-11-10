
import React, { useState, useCallback } from 'react';
import { complexAnalysis } from '../services/geminiService';
import Spinner from './Spinner';

const ComplexAnalysis: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copyText, setCopyText] = useState<string>('Copy');

  const handleSubmit = useCallback(async () => {
    if (!prompt) {
      setError('Please provide a prompt for analysis.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResponse('');
    setCopyText('Copy');
    try {
      const result = await complexAnalysis(prompt);
      setResponse(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt]);

  const handleCopy = useCallback(() => {
    if (!response || !navigator.clipboard) return;
    navigator.clipboard.writeText(response).then(() => {
        setCopyText('Copied!');
        setTimeout(() => setCopyText('Copy'), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        setCopyText('Error');
        setTimeout(() => setCopyText('Copy'), 2000);
    });
  }, [response]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-gray-100">Complex Analysis</h2>
      <p className="text-gray-400">Use the power of Gemini 2.5 Pro for complex reasoning, code generation, or in-depth content analysis. Paste your text or detailed request below.</p>
      
      <div className="flex-grow flex flex-col space-y-4">
        <label htmlFor="complex-prompt" className="block text-sm font-medium text-gray-300">Your Prompt / Content</label>
        <textarea
          id="complex-prompt"
          rows={8}
          className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 flex-grow"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Explain the theory of relativity in simple terms, or write a python script to parse a CSV file."
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? <Spinner /> : 'Analyze'}
        </button>
      </div>

      <div className="flex-shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium text-gray-300">Analysis Result</h3>
          {response && !isLoading && (
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-colors duration-200"
            >
              {copyText}
            </button>
          )}
        </div>
        <div className="w-full min-h-[16rem] bg-gray-800 rounded-lg p-4 border border-gray-700 overflow-y-auto">
          {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}
          {error && <p className="text-red-400 text-center">{error}</p>}
          {response && <p className="whitespace-pre-wrap">{response}</p>}
          {!isLoading && !error && !response && <p className="text-gray-500 text-center pt-16">The analysis will appear here</p>}
        </div>
      </div>
    </div>
  );
};

export default ComplexAnalysis;

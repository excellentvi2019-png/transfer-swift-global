
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './Spinner';

const aspectRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!prompt) {
      setError('Please provide a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await generateImage(prompt, aspectRatio);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-gray-100">AI Image Generator</h2>
      <p className="text-gray-400">Describe the image you want to create. The more descriptive you are, the better the result.</p>

      <div className="flex-grow space-y-4">
        <div>
          <label htmlFor="prompt-gen" className="block text-sm font-medium text-gray-300">Prompt</label>
          <textarea
            id="prompt-gen"
            rows={3}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 mt-1"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A photorealistic image of a cat wearing a tiny astronaut helmet"
          />
        </div>
        <div>
          <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300">Aspect Ratio</label>
          <select
            id="aspect-ratio"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-800 border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
          >
            {aspectRatios.map(ratio => <option key={ratio}>{ratio}</option>)}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !prompt}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLoading ? <Spinner /> : 'Generate Image'}
        </button>
      </div>

      <div className="flex-shrink-0">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Result</h3>
        <div className="w-full h-80 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
          {isLoading && <div className="text-center"><Spinner /><p className="mt-2">Generating your image...</p></div>}
          {error && <p className="text-red-400 text-center px-4">{error}</p>}
          {generatedImage && <img src={generatedImage} alt="Generated" className="rounded-lg object-contain max-h-full max-w-full" />}
          {!isLoading && !error && !generatedImage && <p className="text-gray-500">Your generated image will appear here</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;

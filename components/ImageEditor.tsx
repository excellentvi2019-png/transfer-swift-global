
import React, { useState, useCallback } from 'react';
import { editImage, fileToBase64 } from '../services/geminiService';
import Spinner from './Spinner';

const ImageEditor: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [originalImage, setOriginalImage] = useState<{ file: File; url: string } | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFile = (file: File | undefined) => {
    if (file && file.type.startsWith('image/')) {
      setOriginalImage({ file, url: URL.createObjectURL(file) });
      setEditedImage(null);
      setError(null);
    } else if (file) {
      setError("Please upload a valid image file (PNG, JPG, etc.).");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = useCallback(async () => {
    if (!prompt || !originalImage) {
      setError('Please provide an image and a prompt.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    try {
      const base64Image = await fileToBase64(originalImage.file);
      const result = await editImage(prompt, base64Image, originalImage.file.type);
      setEditedImage(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, originalImage]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-gray-100">AI Image Editor</h2>
      <p className="text-gray-400">Upload an image and describe the changes you want to make. Try "Add a retro filter" or "Make the sky look like a sunset".</p>
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="space-y-4">
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300">1. Upload Image</label>
          <div 
            className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md bg-gray-800 transition-colors ${isDragging ? 'border-indigo-500 bg-gray-700' : ''}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8L36 16" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /><path d="M20 32h16a4 4 0 004-4V16L28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
              <div className="flex text-sm text-gray-400">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          {originalImage && <img src={originalImage.url} alt="Original" className="mt-4 rounded-lg object-contain max-h-60 mx-auto" />}
        </div>

        <div className="space-y-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">2. Describe Your Edit</label>
          <textarea
            id="prompt"
            rows={3}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add sunglasses to the person"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !prompt || !originalImage}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? <Spinner /> : 'Generate Edit'}
          </button>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Result</h3>
        <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600">
          {isLoading && <div className="text-center"><Spinner /><p className="mt-2">Editing in progress...</p></div>}
          {error && <p className="text-red-400 text-center px-4">{error}</p>}
          {editedImage && <img src={editedImage} alt="Edited" className="rounded-lg object-contain max-h-full max-w-full" />}
          {!isLoading && !error && !editedImage && <p className="text-gray-500">Your edited image will appear here</p>}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { quickChat } from '../services/geminiService';
import Spinner from './Spinner';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const QuickChat: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await quickChat(input);
      const botMessage: Message = { sender: 'bot', text: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-3xl font-bold text-gray-100 mb-4">Quick Chat</h2>
      <p className="text-gray-400 mb-4">Powered by Gemini 2.5 Flash Lite for rapid responses. Ask anything!</p>
      
      <div className="flex-grow bg-gray-800 rounded-lg p-4 overflow-y-auto mb-4 border border-gray-700">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
              {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div>}
              <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md whitespace-pre-wrap ${
                msg.sender === 'user' ? 'bg-indigo-600' : 'bg-gray-700'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div>
              <div className="px-4 py-2 rounded-lg bg-gray-700">
                <Spinner />
              </div>
            </div>
          )}
          {error && <p className="text-red-400 text-center">{error}</p>}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default QuickChat;

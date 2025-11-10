
import React from 'react';
import { Tool } from '../types';
import { TOOLS } from '../constants';

interface SidebarProps {
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  return (
    <aside className="w-64 bg-gray-800 p-4 flex flex-col space-y-2">
       <div className="flex items-center space-x-3 mb-6 px-2">
            <svg className="h-8 w-auto text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.75 2.75a.75.75 0 0 0-1.5 0v5.5a.75.75 0 0 0 1.5 0v-5.5Z"/><path fillRule="evenodd" d="M12 21.25a9.25 9.25 0 1 0 0-18.5 9.25 9.25 0 0 0 0 18.5ZM9.25 12a2.75 2.75 0 1 1 5.5 0 2.75 2.75 0 0 1-5.5 0Z" clipRule="evenodd" /></svg>
            <h1 className="text-xl font-bold text-white">Gemini Suite</h1>
        </div>
      {TOOLS.map((tool) => (
        <button
          key={tool.key}
          onClick={() => setActiveTool(tool.key)}
          className={`flex items-center space-x-3 w-full text-left px-3 py-2.5 rounded-lg transition-colors duration-200 ${
            activeTool === tool.key
              ? 'bg-indigo-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {tool.icon}
          <span className="font-medium">{tool.name}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;

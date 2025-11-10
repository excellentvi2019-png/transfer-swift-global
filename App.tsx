
import React, { useState } from 'react';
import { Tool } from './types';
import Sidebar from './components/Sidebar';
import ImageEditor from './components/ImageEditor';
import ImageGenerator from './components/ImageGenerator';
import QuickChat from './components/QuickChat';
import LocalExplorer from './components/LocalExplorer';
import ComplexAnalysis from './components/ComplexAnalysis';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.IMAGE_EDIT);

  const renderActiveTool = () => {
    switch (activeTool) {
      case Tool.IMAGE_EDIT:
        return <ImageEditor />;
      case Tool.IMAGE_GEN:
        return <ImageGenerator />;
      case Tool.QUICK_CHAT:
        return <QuickChat />;
      case Tool.LOCAL_EXPLORER:
        return <LocalExplorer />;
      case Tool.COMPLEX_ANALYSIS:
        return <ComplexAnalysis />;
      default:
        return <ImageEditor />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto h-full">
            {renderActiveTool()}
        </div>
      </main>
    </div>
  );
};

export default App;

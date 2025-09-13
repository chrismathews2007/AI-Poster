
import React from 'react';
import { SparklesIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-cyan-500/20 p-4 sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            AI POSTER DESIGNER
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;

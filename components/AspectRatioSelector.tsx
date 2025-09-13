
import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onRatioChange: (ratio: AspectRatio) => void;
}

const ratios: AspectRatio[] = ["9:16", "1:1", "16:9", "3:4", "4:3"];

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onRatioChange }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 mb-2">Aspect Ratio</h3>
      <div className="grid grid-cols-5 gap-2">
        {ratios.map((ratio) => (
          <button
            key={ratio}
            onClick={() => onRatioChange(ratio)}
            className={`px-3 py-2 text-xs font-mono rounded-md transition-all duration-300 transform
              ${selectedRatio === ratio 
                ? 'bg-cyan-500 text-gray-900 shadow-lg shadow-cyan-500/30 scale-105' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioSelector;

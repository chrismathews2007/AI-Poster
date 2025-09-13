
import React from 'react';
import { DownloadIcon } from './icons';

interface PosterCanvasProps {
  posterData: string | null;
  isLoading: boolean;
  onDragStart: (e: React.DragEvent<HTMLImageElement>) => void;
}

const PosterCanvas: React.FC<PosterCanvasProps> = ({ posterData, isLoading, onDragStart }) => {
    
  const handleDownload = () => {
    if (!posterData) return;
    const link = document.createElement('a');
    link.href = posterData;
    link.download = `ai-poster-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full bg-gray-800/50 rounded-lg p-4 flex flex-col items-center justify-center relative border-2 border-dashed border-gray-700">
      {posterData ? (
        <>
          <img
            src={posterData}
            alt="Generated Poster"
            className="max-w-full max-h-full object-contain rounded-md shadow-2xl cursor-grab"
            draggable="true"
            onDragStart={onDragStart}
          />
          <button
            onClick={handleDownload}
            className="absolute top-4 right-4 bg-cyan-600/80 hover:bg-cyan-500 text-white font-bold p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Download Poster"
            >
            <DownloadIcon className="w-6 h-6" />
          </button>
        </>
      ) : (
        <div className="text-center text-gray-500">
          <p className="text-lg">Your generated poster will appear here.</p>
          <p className="text-sm">Configure the options on the left and click "Generate".</p>
        </div>
      )}
    </div>
  );
};

export default PosterCanvas;


import React from 'react';
import type { Poster } from '../types';
import { DownloadIcon, TrashIcon } from './icons';

interface PosterGalleryProps {
  posters: Poster[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onRemovePoster: (id: string) => void;
}

const PosterGallery: React.FC<PosterGalleryProps> = ({ posters, onDrop, onDragOver, onRemovePoster }) => {

    const handleDownload = (posterData: string) => {
        const link = document.createElement('a');
        link.href = posterData;
        link.download = `final-poster-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="h-full bg-gray-800/50 rounded-lg p-4 flex flex-col border-2 border-dashed border-gray-700 overflow-y-auto"
        >
        <h2 className="text-lg font-bold text-center mb-4 text-cyan-400 border-b border-cyan-500/20 pb-2">Final Posters</h2>
        {posters.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-center text-gray-500">
            <p>Drag and drop your favorite posters here to save them.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 gap-4">
            {posters.map((poster) => (
                <div key={poster.id} className="relative group">
                <img
                    src={poster.imageData}
                    alt="Saved Poster"
                    className="w-full h-auto object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                    <button onClick={() => handleDownload(poster.imageData)} className="p-2 bg-blue-600 rounded-full hover:bg-blue-500">
                        <DownloadIcon className="w-5 h-5 text-white"/>
                    </button>
                    <button onClick={() => onRemovePoster(poster.id)} className="p-2 bg-red-600 rounded-full hover:bg-red-500">
                        <TrashIcon className="w-5 h-5 text-white"/>
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default PosterGallery;

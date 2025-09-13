
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AspectRatioSelector from './components/AspectRatioSelector';
import PosterCanvas from './components/PosterCanvas';
import PosterGallery from './components/PosterGallery';
import RefinementChat from './components/RefinementChat';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons';
import type { AspectRatio, Poster, ImageFile } from './types';
import { removeBackground, generatePoster, refinePoster } from './services/geminiService';

const App: React.FC = () => {
    const [productImage, setProductImage] = useState<ImageFile | null>(null);
    const [imageWithoutBg, setImageWithoutBg] = useState<ImageFile | null>(null);
    const [referenceImage, setReferenceImage] = useState<ImageFile | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [posterConcept, setPosterConcept] = useState<string>('');
    const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
    const [finalPosters, setFinalPosters] = useState<Poster[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleProductImageUpload = useCallback(async (file: ImageFile) => {
        setProductImage(file);
        setImageWithoutBg(null); // Reset when new image is uploaded
        setError(null);
        setIsLoading(true);
        setLoadingMessage('Removing background...');
        try {
            const processedImage = await removeBackground(file);
            setImageWithoutBg(processedImage);
        } catch (e) {
            console.error(e);
            setError('Failed to remove background. Please try another image.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleGeneratePoster = async () => {
        if (!imageWithoutBg || !posterConcept) {
            setError("Please provide a product image and a concept.");
            return;
        }
        setError(null);
        setIsLoading(true);
        setLoadingMessage('Generating your poster...');
        try {
            const posterData = await generatePoster(imageWithoutBg, posterConcept, aspectRatio, referenceImage);
            setGeneratedPoster(posterData);
        } catch (e) {
            console.error(e);
            setError('Failed to generate poster. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefinePoster = async (message: string) => {
        if (!generatedPoster) return;
        setError(null);
        setIsLoading(true);
        setLoadingMessage('Refining your poster...');
        try {
            const refinedPosterData = await refinePoster(generatedPoster, message);
            setGeneratedPoster(refinedPosterData);
        } catch (e) {
            console.error(e);
            setError('Failed to refine poster. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        if (generatedPoster) {
            e.dataTransfer.setData('text/plain', generatedPoster);
        }
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const posterData = e.dataTransfer.getData('text/plain');
        if (posterData && !finalPosters.some(p => p.imageData === posterData)) {
            const newPoster: Poster = { id: `poster-${Date.now()}`, imageData: posterData };
            setFinalPosters(prev => [...prev, newPoster]);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleRemovePoster = (id: string) => {
        setFinalPosters(posters => posters.filter(p => p.id !== id));
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
            <Header />
            <main className="flex-grow p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-68px)]">
                {/* Left Panel: Controls */}
                <div className="lg:col-span-3 bg-gray-800/50 rounded-lg p-4 flex flex-col space-y-4 overflow-y-auto">
                    <h2 className="text-lg font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">Controls</h2>
                    
                    <ImageUploader id="product-uploader" label="Product Image" onImageUpload={handleProductImageUpload} uploadedImageName={productImage?.name} />
                    {imageWithoutBg && (
                         <div className="p-2 border border-green-500/30 bg-green-900/20 rounded-lg text-center">
                            <p className="text-xs text-green-300">Background removed successfully!</p>
                        </div>
                    )}
                    
                    <AspectRatioSelector selectedRatio={aspectRatio} onRatioChange={setAspectRatio} />
                    
                    <div>
                        <label htmlFor="concept" className="block text-sm font-semibold text-gray-400 mb-2">Poster Concept</label>
                        <textarea
                            id="concept"
                            rows={4}
                            value={posterConcept}
                            onChange={(e) => setPosterConcept(e.target.value)}
                            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all"
                            placeholder="e.g., A vibrant, futuristic city street with neon lights..."
                        />
                    </div>
                    
                    <ImageUploader id="reference-uploader" label="Reference Image (Optional)" onImageUpload={setReferenceImage} uploadedImageName={referenceImage?.name} />

                    <button
                        onClick={handleGeneratePoster}
                        disabled={!imageWithoutBg || !posterConcept || isLoading}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Generate Poster
                    </button>
                    {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                </div>

                {/* Center Panel: Canvas & Chat */}
                <div className="lg:col-span-6 flex flex-col h-full relative">
                    {isLoading && <Loader message={loadingMessage} />}
                    <div className="flex-grow h-[calc(100%-6rem)]">
                        <PosterCanvas posterData={generatedPoster} isLoading={isLoading} onDragStart={handleDragStart} />
                    </div>
                    <div className="flex-shrink-0">
                         <RefinementChat onSendMessage={handleRefinePoster} disabled={!generatedPoster || isLoading} />
                    </div>
                </div>

                {/* Right Panel: Gallery */}
                <div className="lg:col-span-3 h-full">
                    <PosterGallery posters={finalPosters} onDrop={handleDrop} onDragOver={handleDragOver} onRemovePoster={handleRemovePoster} />
                </div>
            </main>
        </div>
    );
};

export default App;

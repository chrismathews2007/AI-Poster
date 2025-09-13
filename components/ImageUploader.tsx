
import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons';
import type { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile) => void;
  label: string;
  id: string;
  uploadedImageName?: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, label, id, uploadedImageName }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        onImageUpload({ name: file.name, base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onImageUpload]);

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${isDragging ? 'border-cyan-400 bg-cyan-900/20' : 'border-gray-600 hover:border-gray-500 bg-gray-800/50 hover:bg-gray-700/50'}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className="w-8 h-8 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">{label}</p>
          {uploadedImageName && (
             <p className="text-xs text-green-400 mt-2 truncate max-w-full px-2">{uploadedImageName}</p>
          )}
        </div>
        <input id={id} type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)} />
      </label>
    </div>
  );
};

export default ImageUploader;

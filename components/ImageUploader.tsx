import React, { useState, useEffect, useCallback } from 'react';
import { PhotoIcon } from './icons/PhotoIcon';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  title: string;
  subtitle: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, title, subtitle }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((files: FileList | null) => {
    const file = files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file));
    }
  }, [onImageSelect, imagePreview]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 h-full">
      <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 mb-4">{subtitle}</p>
      <label
        htmlFor={`file-upload-${title.replace(/\s+/g, '-')}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
        }`}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
        ) : (
          <div className="text-center text-slate-500">
            <PhotoIcon className="mx-auto h-12 w-12" />
            <p className="mt-2 font-semibold">Click to upload or drag & drop</p>
            <p className="text-xs">PNG, JPG, WEBP, etc.</p>
          </div>
        )}
        <input 
          id={`file-upload-${title.replace(/\s+/g, '-')}`}
          type="file" 
          className="sr-only" 
          accept="image/*"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
    </div>
  );
};

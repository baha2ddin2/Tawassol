import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';

const AvatarUpload = ({ currentUrl, onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Create local preview URL
      onImageSelect(file);
    }
  };


  const renderImage = () => {
    if (imagePreview) {
      return <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />;
    }
    if (currentUrl) {
      return <img src={`http://127.0.0.1:8000/storage/${currentUrl}`} alt="Profile" className="w-full h-full object-cover" />;
    }
    return <Image src={'/avatar.jpeg'} width={150} height={150} alt="default" />;
  };

  return (
    <div className="flex flex-col items-center justify-center pb-5 gap-4">
      <div 
        onClick={() => fileInputRef.current.click()}
        className="relative w-32 h-32 overflow-hidden rounded-full border-2 border-dashed border-gray-300 cursor-pointer hover:opacity-80 transition-all flex items-center justify-center"
      >
        {renderImage()}
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />
      
      {imagePreview && (
        <button 
          type="button"
          onClick={() => { setImagePreview(null); onImageSelect(null); }}
          className="text-red-500 text-sm font-medium"
        >
          Remove Selection
        </button>
      )}
    </div>
  );
};

export default AvatarUpload;

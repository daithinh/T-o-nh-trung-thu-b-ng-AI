
import React, { useRef } from 'react';

interface ImageUploaderProps {
  uploadedImage: string | null;
  onImageUpload: (image: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedImage, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // No file size check
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = () => {
    onImageUpload(null);
  };

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner">
      <h2 className="text-2xl font-semibold text-amber-400 mb-4">1. Tải ảnh của bạn lên</h2>
      <div 
        onClick={handleUploadClick}
        className="w-full min-h-64 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-500 hover:bg-slate-800/60 transition-all overflow-hidden"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
        />
        {uploadedImage ? (
          <img 
            src={uploadedImage} 
            alt="Uploaded preview" 
            className="max-w-full max-h-full object-contain rounded-md"
          />
        ) : (
          <div className="text-center text-slate-400">
            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2">Nhấn để chọn một bức ảnh</p>
            <p className="text-xs text-slate-500">Chấp nhận PNG, JPG, WEBP. Không giới hạn kích thước.</p>
          </div>
        )}
      </div>
      {uploadedImage && (
         <button onClick={handleClearImage} className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            Xóa ảnh
         </button>
      )}
    </div>
  );
};

export default ImageUploader;
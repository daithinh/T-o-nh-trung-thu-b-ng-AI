import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ImageFilters } from './ImageEditor';
import { GeneratedImage } from '../App';
import { ZoomInIcon } from './icons/ZoomInIcon';
import { ZoomOutIcon } from './icons/ZoomOutIcon';
import { ResetZoomIcon } from './icons/ResetZoomIcon';
import { DownloadIcon } from './icons/DownloadIcon';


interface ImageModalProps {
  isOpen: boolean;
  images: GeneratedImage[];
  startIndex: number;
  onClose: () => void;
}

const getCssFilterString = (filters: ImageFilters): string => {
    const { brightness, warmth, saturation, vibrance, tint } = filters;
    const warmthFilter = `sepia(${warmth}%)`;
    const tintFilter = `hue-rotate(${tint}deg)`;
    const vibranceFilter = `contrast(${vibrance}%)`;
    
    return `brightness(${brightness}%) saturate(${saturation}%) ${vibranceFilter} ${warmthFilter} ${tintFilter}`.trim().replace(/\s+/g, ' ');
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const currentImage = images.length > 0 ? images[currentIndex] : null;

  const handleReset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      handleReset();
    }
  }, [isOpen, startIndex, handleReset]);

  const handleNext = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex(prev => (prev + 1) % images.length);
      handleReset();
    }
  }, [images.length, handleReset]);

  const handlePrev = useCallback(() => {
    if (images.length > 0) {
      setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
      handleReset();
    }
  }, [images.length, handleReset]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    else if (e.key === 'ArrowLeft') handlePrev();
    else if (e.key === 'Escape') onClose();
  }, [handleNext, handlePrev, onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleZoom = (scale: number, clientX: number, clientY: number) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();

    // Position of the mouse relative to the container
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // The point on the image that is under the mouse
    const imageX = (mouseX - offset.x) / zoom;
    const imageY = (mouseY - offset.y) / zoom;

    const newZoom = Math.max(0.5, Math.min(zoom * scale, 8));

    // New offset to keep the same point under the mouse
    const newOffsetX = mouseX - imageX * newZoom;
    const newOffsetY = mouseY - imageY * newZoom;

    setZoom(newZoom);
    setOffset({ x: newOffsetX, y: newOffsetY });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scale = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    handleZoom(scale, e.clientX, e.clientY);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    e.preventDefault();
    setOffset({ x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y });
  };
  
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({ x: touch.clientX - dragStartRef.current.x, y: touch.clientY - dragStartRef.current.y });
  };
  
  const handleTouchEnd = () => setIsDragging(false);

  const downloadImage = () => {
    if (!currentImage) return;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = currentImage.imageUrl;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = getCssFilterString(currentImage.filters);
      ctx.drawImage(image, 0, 0);

      const link = document.createElement('a');
      link.download = `mid-autumn-edited-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };

  if (!isOpen || !currentImage) return null;

  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => e.stopPropagation();

  let cursorClass = 'cursor-zoom-in';
  if (zoom > 1) {
    cursorClass = isDragging ? 'cursor-grabbing' : 'cursor-grab';
  }

  return (
    <div 
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 modal-backdrop-animate"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <style>{`
        @keyframes modal-fade-in { from { opacity: 0; } to { opacity: 1; } }
        .modal-backdrop-animate { animation: modal-fade-in 0.3s ease-out; }
      `}</style>
      
      <div 
        ref={imageContainerRef}
        className={`relative w-full h-full flex items-center justify-center overflow-hidden ${cursorClass}`}
        onClick={stopPropagation}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          key={currentIndex}
          src={currentImage.imageUrl}
          alt={`Generated result ${currentIndex + 1}`}
          className="max-w-none max-h-none transition-transform duration-100 ease-out"
          style={{ 
            filter: getCssFilterString(currentImage.filters),
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            touchAction: 'none',
          }}
        />
      </div>

      <button
        onClick={(e) => { stopPropagation(e); onClose(); }}
        className="absolute top-4 right-4 text-white/70 text-4xl font-bold hover:text-white transition-colors z-[52]"
        aria-label="Đóng trình xem ảnh"
      >
        &times;
      </button>

      {images.length > 1 && (
        <>
            <button 
                onClick={(e) => { stopPropagation(e); handlePrev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white/80 hover:bg-black/60 hover:text-white p-3 rounded-full transition-all z-[52]"
                aria-label="Ảnh trước"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                onClick={(e) => { stopPropagation(e); handleNext(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white/80 hover:bg-black/60 hover:text-white p-3 rounded-full transition-all z-[52]"
                aria-label="Ảnh kế tiếp"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full shadow-lg z-[52]">
          <button onClick={(e) => { e.stopPropagation(); handleZoom(1 / 1.5, window.innerWidth / 2, window.innerHeight / 2); }} className="hover:text-amber-300" aria-label="Thu nhỏ">
              <ZoomOutIcon className="w-6 h-6" />
          </button>
          <span className="font-mono text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={(e) => { e.stopPropagation(); handleZoom(1.5, window.innerWidth / 2, window.innerHeight / 2); }} className="hover:text-amber-300" aria-label="Phóng to">
              <ZoomInIcon className="w-6 h-6" />
          </button>
          <div className="w-px h-6 bg-white/20"></div>
          <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="hover:text-amber-300" aria-label="Đặt lại thu phóng">
              <ResetZoomIcon className="w-6 h-6" />
          </button>
          <div className="w-px h-6 bg-white/20"></div>
          <button onClick={(e) => { e.stopPropagation(); downloadImage(); }} className="hover:text-amber-300" aria-label="Tải ảnh">
              <DownloadIcon className="w-6 h-6" />
          </button>
      </div>

       <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 text-white text-sm px-3 py-1 rounded-full z-[52]">
          {currentIndex + 1} / {images.length}
      </div>

    </div>
  );
};

export default ImageModal;

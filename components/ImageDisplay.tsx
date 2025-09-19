
import React, { useState } from 'react';
import ImageEditor, { ImageFilters } from './ImageEditor';
import { GeneratedImage } from '../App';
import VideoGenerator from './VideoGenerator';
import ColorChanger from './ColorChanger';
import { VideoIcon } from './icons/VideoIcon';
import { EditIcon } from './icons/EditIcon';
import { PaletteIcon } from './icons/PaletteIcon';


declare global {
  interface Window {
    JSZip: any;
  }
}

interface ImageDisplayProps {
  generatedImages: GeneratedImage[];
  isLoading: boolean;
  onImageClick: (index: number) => void;
  activeImageIndex: number | null;
  onImageSelect: (index: number) => void;
  onFilterChange: (filters: ImageFilters) => void;
  // Video props
  isGeneratingVideo: boolean;
  videoGenerationMessage: string;
  generatedVideoUrl: string | null;
  videoError: string | null;
  onGenerateVideo: (prompt: string) => void;
  // Color Change props
  isChangingColor: boolean;
  colorChangeError: string | null;
  onColorChange: (color: string) => void;
}

const getCssFilterString = (filters: ImageFilters): string => {
    const { brightness, warmth, saturation, vibrance, tint } = filters;
    const warmthFilter = `sepia(${warmth}%)`;
    const tintFilter = `hue-rotate(${tint}deg)`;
    const vibranceFilter = `contrast(${vibrance}%)`;
    
    return `brightness(${brightness}%) saturate(${saturation}%) ${vibranceFilter} ${warmthFilter} ${tintFilter}`.trim().replace(/\s+/g, ' ');
}

const loadingMessages = [
  "Đang triệu hồi Chị Hằng...",
  "Đang nướng bánh trung thu...",
  "Đang tìm Chú Cuội...",
  "Đang rước đèn ông sao...",
  "AI đang múa lân...",
  "Đang đổ màu yêu thương...",
  "Thêm ánh trăng vào ảnh...",
];

const LoadingState: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
        }, 2500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
             <div className="w-16 h-16 border-4 border-t-amber-400 border-solid rounded-full animate-spin border-slate-700"></div>
            <p className="mt-4 text-lg font-semibold text-amber-400">{message}</p>
            <p className="text-sm">Quá trình này có thể mất vài phút.</p>
        </div>
    );
};

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79.09-.38.45-.63.85-.55.4.08.68.45.59.84-.11.49-.17 1-.17 1.5 0 3.31 2.69 6 6 6 .5 0 .99-.06 1.48-.17.39-.09.76.19.85.59.08.4-.17.77-.55.85-.58.13-1.17.2-1.77.2z"/>
    </svg>
);

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
        <MoonIcon className="w-24 h-24 text-amber-400/20" />
        <h3 className="mt-4 text-xl font-semibold text-slate-300">Những bức ảnh ma thuật của bạn sẽ xuất hiện ở đây</h3>
        <p className="mt-1 text-sm">Tải ảnh của bạn lên, chọn một phong cách và để AI thực hiện phép màu!</p>
    </div>
);

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
    generatedImages, 
    isLoading, 
    onImageClick, 
    activeImageIndex, 
    onImageSelect, 
    onFilterChange,
    isGeneratingVideo,
    videoGenerationMessage,
    generatedVideoUrl,
    videoError,
    onGenerateVideo,
    isChangingColor,
    colorChangeError,
    onColorChange
}) => {
  const activeImage = activeImageIndex !== null ? generatedImages[activeImageIndex] : null;
  const [isZipping, setIsZipping] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'color' | 'video'>('edit');

  const tabButtonClass = "flex-1 flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-md transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-400";
  const selectedTabClass = "bg-red-600 text-white shadow-md";
  const unselectedTabClass = "bg-transparent hover:bg-slate-700/50 text-slate-300";

  const downloadImage = (url: string, filename: string, filters?: ImageFilters) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = url;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (filters) {
        ctx.filter = getCssFilterString(filters);
      }
      ctx.drawImage(image, 0, 0);

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };
  
  const handleDownloadEditedImage = () => {
    if (!activeImage) return;
    downloadImage(
      activeImage.imageUrl, 
      `mid-autumn-edited-${new Date().getTime()}.png`, 
      activeImage.filters
    );
  };

  const handleDownloadAll = async () => {
    if (!window.JSZip) {
      alert('Lỗi: không thể tạo tệp zip. Vui lòng tải lại trang.');
      return;
    }
    if (isZipping) return;

    setIsZipping(true);

    try {
      const zip = new window.JSZip();

      const imagePromises = generatedImages.map((image, index) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = image.imageUrl;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return reject(new Error('Không thể lấy context của canvas'));
            }

            ctx.filter = getCssFilterString(image.filters);
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((blob) => {
              if (blob) {
                zip.file(`mid-autumn-edited-${index + 1}.png`, blob);
                resolve();
              } else {
                reject(new Error('Không thể tạo blob từ canvas'));
              }
            }, 'image/png');
          };

          img.onerror = () => {
            reject(new Error(`Không thể tải ảnh ${index + 1}`));
          };
        });
      });

      await Promise.all(imagePromises);

      const content = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `mid-autumn-photo-set-${new Date().getTime()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Đã xảy ra lỗi khi tạo tệp zip. Vui lòng thử lại.');
    } finally {
      setIsZipping(false);
    }
  };
  
  if (isLoading) {
    return <LoadingState />;
  }

  if (activeImage) {
    return (
        <div className="flex flex-col items-center justify-between h-full w-full gap-4">
            <div 
                id="generated-image-wrapper"
                className="w-full flex-grow flex items-center justify-center cursor-pointer min-h-0"
                onClick={() => onImageClick(activeImageIndex!)}
            >
                <img 
                    src={activeImage.imageUrl} 
                    alt="Generated result" 
                    className="max-w-full max-h-[40vh] object-contain rounded-lg shadow-2xl hover:opacity-90 transition-opacity"
                    style={{ filter: getCssFilterString(activeImage.filters) }}
                />
            </div>
            
            {generatedImages.length > 1 && (
                <div className="flex-shrink-0 w-full flex gap-2 overflow-x-auto p-2 bg-slate-900/30 rounded-md">
                    {generatedImages.map((image, index) => (
                        <img 
                            key={index}
                            src={image.imageUrl}
                            alt={`Thumbnail ${index + 1}`}
                            onClick={() => onImageSelect(index)}
                            className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 flex-shrink-0 ${
                                index === activeImageIndex 
                                ? 'ring-2 ring-red-500 scale-105' 
                                : 'opacity-60 hover:opacity-100'
                            }`}
                        />
                    ))}
                </div>
            )}
            
            <div className="w-full flex flex-col gap-4">
                 <div className="flex bg-slate-900/50 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('edit')}
                        className={`${tabButtonClass} ${activeTab === 'edit' ? selectedTabClass : unselectedTabClass}`}
                        aria-pressed={activeTab === 'edit'}
                    >
                        <EditIcon className="w-5 h-5"/>
                        Chỉnh sửa ảnh
                    </button>
                    <button 
                        onClick={() => setActiveTab('color')}
                        className={`${tabButtonClass} ${activeTab === 'color' ? selectedTabClass : unselectedTabClass}`}
                        aria-pressed={activeTab === 'color'}
                    >
                        <PaletteIcon className="w-5 h-5"/>
                        Đổi màu trang phục
                    </button>
                    <button 
                        onClick={() => setActiveTab('video')}
                        className={`${tabButtonClass} ${activeTab === 'video' ? selectedTabClass : unselectedTabClass}`}
                        aria-pressed={activeTab === 'video'}
                    >
                        <VideoIcon className="w-5 h-5"/>
                        Tạo Video
                    </button>
                </div>

                {activeTab === 'edit' && (
                  <>
                    <ImageEditor filters={activeImage.filters} onFilterChange={onFilterChange} />
                    <div className="flex flex-col sm:flex-row gap-3 w-full items-center">
                        <button 
                            onClick={handleDownloadEditedImage}
                            className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            Tải về ảnh đã chỉnh sửa
                        </button>
                        <button 
                            onClick={handleDownloadAll}
                            disabled={isZipping}
                            className="w-full text-center bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-wait text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            {isZipping ? 'Đang nén tệp...' : 'Tải tất cả (.zip)'}
                        </button>
                    </div>
                  </>
                )}
                 
                {activeTab === 'color' && (
                  <ColorChanger
                    onColorChange={onColorChange}
                    isChangingColor={isChangingColor}
                    error={colorChangeError}
                   />
                )}

                {activeTab === 'video' && (
                  <VideoGenerator
                    onGenerateVideo={onGenerateVideo}
                    isGeneratingVideo={isGeneratingVideo}
                    videoGenerationMessage={videoGenerationMessage}
                    videoUrl={generatedVideoUrl}
                    error={videoError}
                   />
                )}
            </div>
        </div>
    );
  }

  return <InitialState />;
};

export default ImageDisplay;

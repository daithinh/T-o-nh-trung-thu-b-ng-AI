
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import PromptSelector from './components/PromptSelector';
import ImageDisplay from './components/ImageDisplay';
import { generateMidAutumnImage, startVideoGeneration, getVideosOperation } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';
import InfoBox from './components/InfoBox';
import ImageModal from './components/ImageModal';
import { ImageFilters, defaultFilters } from './components/ImageEditor';
import OutputOptions from './components/OutputOptions';
import MusicPlayer from './components/MusicPlayer';

export interface GeneratedImage {
  imageUrl: string;
  text: string | null;
  filters: ImageFilters;
}

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalStartIndex, setModalStartIndex] = useState<number>(0);
  
  const [numberOfImages, setNumberOfImages] = useState<number>(1);
  const [imageQuality, setImageQuality] = useState<string>('8K');
  const [gender, setGender] = useState<'female' | 'male'>('female');

  // Video State
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoGenerationMessage, setVideoGenerationMessage] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Color Change State
  const [isChangingColor, setIsChangingColor] = useState(false);
  const [colorChangeError, setColorChangeError] = useState<string | null>(null);

  const handleStartNew = () => {
    setUploadedImage(null);
    setGeneratedImages([]);
    setActiveImageIndex(null);
    setSelectedPrompt('');
    setError(null);
    setIsLoading(false);
    // Reset video state
    setGeneratedVideoUrl(null);
    setVideoError(null);
    setIsGeneratingVideo(false);
    // Reset color change state
    setIsChangingColor(false);
    setColorChangeError(null);
  };

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) {
      setError('Vui lòng tải ảnh của bạn lên trước.');
      return;
    }
    if (!selectedPrompt) {
      setError('Vui lòng chọn hoặc tạo một lời nhắc.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setActiveImageIndex(null);
    setGeneratedVideoUrl(null);
    setVideoError(null);
    setColorChangeError(null);


    try {
      const qualityRegex = /(?:Photo (?:hyper-realistic|cinematic|dynamic|lifestyle|full-body)? ?)?\d+K,?\s*/i;
      const promptWithoutQuality = selectedPrompt.replace(qualityRegex, '');
      const finalPrompt = `Photo quality ${imageQuality}, ${promptWithoutQuality}`;
      
      const newImages: GeneratedImage[] = [];
      for (let i = 0; i < numberOfImages; i++) {
        setLoadingMessage(`Đang tạo ảnh ${i + 1} / ${numberOfImages}...`);
        // The gemini-2.5-flash-image-preview model generates one image at a time.
        // We call it in a loop to get the desired number of images.
        const { imageUrl, text } = await generateMidAutumnImage(uploadedImage, finalPrompt);
        if (imageUrl) {
            newImages.push({ imageUrl, text, filters: defaultFilters });
        }
      }
      setGeneratedImages(newImages);
      if(newImages.length > 0) {
        setActiveImageIndex(0);
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [uploadedImage, selectedPrompt, imageQuality, numberOfImages]);

  const handleGenerateVideo = async (prompt: string) => {
    if (activeImageIndex === null || !generatedImages[activeImageIndex]) return;

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setVideoError(null);
    setVideoGenerationMessage('Bắt đầu tạo video...');

    try {
        const imageToAnimate = generatedImages[activeImageIndex];
        let operation = await startVideoGeneration(imageToAnimate.imageUrl, prompt);
        
        const messages = [
            "Đang lên kịch bản...",
            "Đang chuẩn bị máy quay AI...",
            "Đang tìm góc quay đẹp nhất...",
            "Đang xử lý từng khung hình...",
            "Thêm hiệu ứng đặc biệt...",
            "Chỉnh màu cho video...",
            "Sắp xong rồi, chờ một chút nhé...",
        ];
        let messageIndex = 0;
        
        while (!operation.done) {
            setVideoGenerationMessage(messages[messageIndex % messages.length]);
            messageIndex++;
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await getVideosOperation({operation: operation});
        }
        
        setVideoGenerationMessage('Hoàn tất! Đang tải video xuống...');

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (downloadLink && process.env.API_KEY) {
            const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
            if (!response.ok) {
                const errorBody = await response.text();
                console.error("Video fetch error:", errorBody);
                throw new Error('Không thể tải tệp video. Vui lòng thử lại.');
            }
            const videoBlob = await response.blob();
            const videoUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(videoUrl);
        } else {
            if (!process.env.API_KEY) {
                 throw new Error('API Key chưa được định cấu hình đúng để tải video.');
            }
            throw new Error('AI không thể tạo video. Vui lòng thử lại với một lời nhắc khác.');
        }

    } catch(err) {
        console.error(err);
        setVideoError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định khi tạo video.');
    } finally {
        setIsGeneratingVideo(false);
        setVideoGenerationMessage('');
    }
  };

  const handleColorChange = async (color: string) => {
    if (activeImageIndex === null || !generatedImages[activeImageIndex] || isChangingColor) return;

    setIsChangingColor(true);
    setColorChangeError(null);
    setGeneratedVideoUrl(null); // Clear video when image changes

    try {
        const imageToEdit = generatedImages[activeImageIndex];
        const prompt = `Keep the person's face and the background exactly the same. Change the color of the outfit/clothing to ${color}.`;
        
        const { imageUrl, text } = await generateMidAutumnImage(imageToEdit.imageUrl, prompt);

        if (imageUrl) {
            const newImage: GeneratedImage = {
                imageUrl,
                text,
                filters: defaultFilters, // Reset filters for the new image
            };
            setGeneratedImages(prev => 
                prev.map((img, index) => 
                    index === activeImageIndex ? newImage : img
                )
            );
        } else {
            throw new Error("Không thể đổi màu trang phục. Vui lòng thử lại với màu khác.");
        }

    } catch (err) {
        console.error("Color change error:", err);
        setColorChangeError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định khi đổi màu.');
    } finally {
        setIsChangingColor(false);
    }
  };


  const handleFilterChange = (newFilters: ImageFilters) => {
    if (activeImageIndex === null) return;
    setGeneratedImages(prev => 
      prev.map((image, index) => 
        index === activeImageIndex ? { ...image, filters: newFilters } : image
      )
    );
  };

  const handleImageClick = (index: number) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="flex flex-col gap-8">
            {generatedImages.length > 0 ? (
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner text-center flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-semibold text-amber-400 mb-2">Tuyệt vời!</h2>
                    <p className="text-slate-400 mb-6">Ảnh của bạn đã được tạo. Bạn có thể tạo lại hoặc bắt đầu một phiên mới.</p>
                    <button 
                        onClick={handleStartNew} 
                        className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                    >
                        Tải ảnh mới & Bắt đầu lại
                    </button>
                </div>
            ) : (
                <ImageUploader 
                    uploadedImage={uploadedImage} 
                    onImageUpload={setUploadedImage}
                />
            )}

            <PromptSelector 
              selectedPrompt={selectedPrompt} 
              onPromptSelect={setSelectedPrompt} 
              setIsLoading={(val) => setIsLoading(val)} 
              setError={setError}
              gender={gender}
              onGenderChange={setGender}
            />
            <OutputOptions
              numberOfImages={numberOfImages}
              setNumberOfImages={setNumberOfImages}
              imageQuality={imageQuality}
              setImageQuality={setImageQuality}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !uploadedImage || !selectedPrompt}
              className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out text-xl group"
            >
              <SparklesIcon className="w-6 h-6 group-hover:animate-pulse" />
              {isLoading ? loadingMessage : (generatedImages.length > 0 ? 'Tạo lại bộ ảnh' : 'Tạo ảnh ma thuật')}
            </button>
            {error && <p className="text-red-400 text-center mt-2 bg-red-900/30 p-3 rounded-md border border-red-500/30">{error}</p>}
          </div>

          {/* Right Column: Display & Info */}
          <div className="flex flex-col gap-8">
            <InfoBox isResultView={generatedImages.length > 0} />
            <div className="bg-slate-800/40 p-4 rounded-lg shadow-inner flex-grow flex items-center justify-center min-h-[400px]">
              <ImageDisplay 
                generatedImages={generatedImages} 
                isLoading={isLoading} 
                onImageClick={handleImageClick}
                activeImageIndex={activeImageIndex}
                onImageSelect={setActiveImageIndex}
                onFilterChange={handleFilterChange}
                // Video props
                isGeneratingVideo={isGeneratingVideo}
                videoGenerationMessage={videoGenerationMessage}
                generatedVideoUrl={generatedVideoUrl}
                videoError={videoError}
                onGenerateVideo={handleGenerateVideo}
                // Color Change props
                isChangingColor={isChangingColor}
                colorChangeError={colorChangeError}
                onColorChange={handleColorChange}
              />
            </div>
          </div>
        </div>
      </main>
       <footer className="text-center p-4 text-slate-500 text-sm">
        <p>Tết Trung Thu 2025</p>
      </footer>
       <ImageModal 
        isOpen={isModalOpen}
        images={generatedImages}
        startIndex={modalStartIndex}
        onClose={() => setIsModalOpen(false)}
      />
      <MusicPlayer />
    </div>
  );
};

export default App;

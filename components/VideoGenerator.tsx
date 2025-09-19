
import React, { useState } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface VideoGeneratorProps {
  onGenerateVideo: (prompt: string) => void;
  isGeneratingVideo: boolean;
  videoGenerationMessage: string;
  videoUrl: string | null;
  error: string | null;
}

const styles = [
  { name: 'Điện ảnh', hint: 'cinematic, high detail, epic lighting, professional color grading' },
  { name: 'Hành trình Sử thi', hint: 'epic cinematic journey, sweeping landscapes, dramatic score' },
  { name: 'Cổ tích', hint: 'whimsical fairy tale, magical, sparkling effects, enchanting' },
  { name: 'Cyberpunk', hint: 'cyberpunk futuristic vibe, neon lights, high-tech city' },
  { name: 'Hoạt hình', hint: 'anime style, vibrant colors, 2d animation, stylized' },
  { name: 'Tài liệu', hint: 'documentary style, realistic, handheld camera feel' },
  { name: 'Phim xưa', hint: 'vintage film look, 8mm, grain, faded colors, nostalgic' },
  { name: 'Chuyên nghiệp', hint: 'professional video, high quality, steady shot, clean look' },
  { name: 'Chậm', hint: 'slow motion, dramatic effect, smooth movement' },
  { name: 'Nhanh', hint: 'timelapse effect, fast motion, clouds moving quickly' },
  { name: 'Mơ màng', hint: 'dreamy, ethereal, soft focus, glowing light, fantasy' },
];

const LoadingState: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-10">
         <div className="w-12 h-12 border-4 border-t-amber-400 border-solid rounded-full animate-spin border-slate-700"></div>
        <p className="mt-4 text-md font-semibold text-amber-400">{message}</p>
        <p className="text-sm">Quá trình này có thể mất vài phút, vui lòng đợi.</p>
    </div>
);

const VideoGenerator: React.FC<VideoGeneratorProps> = ({
  onGenerateVideo,
  isGeneratingVideo,
  videoGenerationMessage,
  videoUrl,
  error,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleStyleClick = (hint: string) => {
    setPrompt(prev => prev ? `${prev}, ${hint}` : hint);
  };
  
  const handleGenerateClick = () => {
    if (prompt && !isGeneratingVideo) {
      onGenerateVideo(prompt);
    }
  };

  if (isGeneratingVideo) {
    return <LoadingState message={videoGenerationMessage} />;
  }
  
  if (error) {
    return (
        <div className="p-4 bg-slate-900/50 rounded-lg border border-red-700/50 text-center">
            <h3 className="text-lg font-semibold text-red-400">Đã xảy ra lỗi</h3>
            <p className="text-red-400 text-center mt-2 bg-red-900/30 p-3 rounded-md">{error}</p>
             <button
                onClick={() => onGenerateVideo(prompt)} // Allow retry
                className="mt-4 w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-colors"
            >
                Thử lại
            </button>
        </div>
    );
  }

  if (videoUrl) {
    return (
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 space-y-4">
            <h3 className="text-lg font-semibold text-amber-400">Video của bạn đã sẵn sàng!</h3>
            <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg bg-black"></video>
            <div className="flex flex-col sm:flex-row gap-3">
                 <a 
                    href={videoUrl} 
                    download={`mid-autumn-video-${new Date().getTime()}.mp4`}
                    className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Tải Video
                </a>
                 <button
                    onClick={() => onGenerateVideo(prompt)} // Allow re-generation
                    className="w-full text-center bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Tạo video khác
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Mô tả video bạn muốn tạo</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ví dụ: làm cho những chiếc đèn lồng lắc lư nhẹ nhàng"
        className="w-full h-20 p-2 bg-slate-800/60 border border-slate-700 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-slate-300"
      />
      <div>
        <p className="text-sm text-slate-400 mb-2">Hoặc chọn một phong cách có sẵn:</p>
        <div className="flex flex-wrap gap-2">
            {styles.map(style => (
                <button
                    key={style.name}
                    onClick={() => handleStyleClick(style.hint)}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold rounded-full transition-colors"
                >
                    {style.name}
                </button>
            ))}
        </div>
      </div>
      <button
        onClick={handleGenerateClick}
        disabled={!prompt || isGeneratingVideo}
        className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out group"
      >
        <SparklesIcon className="w-5 h-5 group-hover:animate-pulse" />
        Tạo Video
      </button>
    </div>
  );
};

export default VideoGenerator;
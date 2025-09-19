
import React from 'react';

interface OutputOptionsProps {
  numberOfImages: number;
  setNumberOfImages: (count: number) => void;
  imageQuality: string;
  setImageQuality: (quality: string) => void;
}

const OutputOptions: React.FC<OutputOptionsProps> = ({
  numberOfImages,
  setNumberOfImages,
  imageQuality,
  setImageQuality,
}) => {
  const imageCounts = [1, 2, 3, 4];
  const qualityLevels = ['2K', '4K', '8K'];

  const buttonClass = "flex-1 py-2 px-4 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-400";
  const selectedClass = "bg-red-600 text-white shadow-md";
  const unselectedClass = "bg-slate-700/80 hover:bg-slate-600/90 text-slate-300";

  return (
    <div className="bg-slate-800/50 p-6 rounded-lg shadow-inner space-y-6">
      <h2 className="text-2xl font-semibold text-amber-400">3. Tùy chọn đầu ra</h2>
      
      <div>
        <label className="block text-base font-medium text-slate-300 mb-3">Số lượng ảnh</label>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg">
          {imageCounts.map(count => (
            <button
              key={count}
              onClick={() => setNumberOfImages(count)}
              className={`${buttonClass} ${numberOfImages === count ? selectedClass : unselectedClass}`}
              aria-pressed={numberOfImages === count}
            >
              {count} ảnh
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-base font-medium text-slate-300 mb-3">Chất lượng</label>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg">
          {qualityLevels.map(quality => (
            <button
              key={quality}
              onClick={() => setImageQuality(quality)}
              className={`${buttonClass} ${imageQuality === quality ? selectedClass : unselectedClass}`}
              aria-pressed={imageQuality === quality}
            >
              {quality}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OutputOptions;

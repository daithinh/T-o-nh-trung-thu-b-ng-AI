
import React from 'react';

interface ColorChangerProps {
  onColorChange: (color: string) => void;
  isChangingColor: boolean;
  error: string | null;
}

const colors = [
  { name: 'Xanh Dương', value: 'deep blue', hex: '#2563eb' },
  { name: 'Xanh Lá', value: 'emerald green', hex: '#10b981' },
  { name: 'Tím', value: 'royal purple', hex: '#7c3aed' },
  { name: 'Hồng', value: 'hot pink', hex: '#ec4899' },
  { name: 'Trắng', value: 'pure white', hex: '#ffffff' },
  { name: 'Đen', value: 'jet black', hex: '#111827' },
  { name: 'Bạc', value: 'metallic silver', hex: '#d1d5db' },
];

const LoadingState: React.FC = () => (
    <div className="flex items-center justify-center h-full text-center text-slate-400 py-6">
         <div className="w-8 h-8 border-4 border-t-amber-400 border-solid rounded-full animate-spin border-slate-700"></div>
        <p className="ml-4 text-md font-semibold text-amber-400">Đang đổi màu, vui lòng chờ...</p>
    </div>
);


const ColorChanger: React.FC<ColorChangerProps> = ({
  onColorChange,
  isChangingColor,
  error,
}) => {
  if (isChangingColor) {
    return <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50"><LoadingState /></div>;
  }
  
  return (
    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Đổi màu trang phục</h3>
       <p className="text-sm text-slate-400 -mt-2">Chọn một màu để AI thay đổi màu sắc trang phục trong ảnh.</p>
       {error && (
            <div className="p-3 bg-red-900/30 rounded-md border border-red-500/30">
                <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
       )}
       <div className="grid grid-cols-4 md:grid-cols-7 gap-3">
        {colors.map(color => (
          <div key={color.name} className="flex flex-col items-center gap-2">
            <button
              onClick={() => onColorChange(color.value)}
              disabled={isChangingColor}
              className="w-12 h-12 rounded-full border-2 border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-400 disabled:cursor-not-allowed transform hover:scale-110 transition-transform"
              style={{ backgroundColor: color.hex }}
              aria-label={`Change color to ${color.name}`}
            />
            <span className="text-xs font-medium text-slate-300">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorChanger;

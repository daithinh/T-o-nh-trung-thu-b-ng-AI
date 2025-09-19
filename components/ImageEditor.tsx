
import React from 'react';
import FilterSlider from './FilterSlider';

export interface ImageFilters {
  brightness: number;
  warmth: number;
  saturation: number;
  vibrance: number; // Mapped to contrast
  tint: number;     // Mapped to hue-rotate
}

interface ImageEditorProps {
  filters: ImageFilters;
  onFilterChange: (filters: ImageFilters) => void;
}

export const defaultFilters: ImageFilters = {
  brightness: 100,
  warmth: 0,
  saturation: 100,
  vibrance: 100,
  tint: 0,
};

const ImageEditor: React.FC<ImageEditorProps> = ({ filters, onFilterChange }) => {

  const handleFilterChange = (filterName: keyof ImageFilters, value: number) => {
    onFilterChange({ ...filters, [filterName]: value });
  };

  const resetFilter = (filterName: keyof ImageFilters) => {
    onFilterChange({ ...filters, [filterName]: defaultFilters[filterName] });
  };

  const resetAllFilters = () => {
    onFilterChange(defaultFilters);
  };

  return (
    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-amber-400">Trình chỉnh sửa ảnh</h3>
        <button 
          onClick={resetAllFilters}
          className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-semibold px-3 py-1 rounded-md bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700"
        >
          Đặt lại tất cả
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FilterSlider 
          label="Độ sáng"
          value={filters.brightness}
          onChange={(v) => handleFilterChange('brightness', v)}
          onReset={() => resetFilter('brightness')}
          min={0} max={200} step={1}
        />
        <FilterSlider 
          label="Bão hòa"
          value={filters.saturation}
          onChange={(v) => handleFilterChange('saturation', v)}
          onReset={() => resetFilter('saturation')}
          min={0} max={200} step={1}
        />
        <FilterSlider 
          label="Độ ấm"
          value={filters.warmth}
          onChange={(v) => handleFilterChange('warmth', v)}
          onReset={() => resetFilter('warmth')}
          min={0} max={100} step={1}
        />
        <FilterSlider 
          label="Rực rỡ"
          value={filters.vibrance}
          onChange={(v) => handleFilterChange('vibrance', v)}
          onReset={() => resetFilter('vibrance')}
          min={0} max={200} step={1}
        />
        <FilterSlider 
          label="Tông màu"
          value={filters.tint}
          onChange={(v) => handleFilterChange('tint', v)}
          onReset={() => resetFilter('tint')}
          min={-180} max={180} step={1}
        />
      </div>
    </div>
  );
};

export default ImageEditor;

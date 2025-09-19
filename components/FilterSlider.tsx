
import React from 'react';

interface FilterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
  min: number;
  max: number;
  step: number;
}

const FilterSlider: React.FC<FilterSliderProps> = ({ label, value, onChange, onReset, min, max, step }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label htmlFor={`${label}-slider`} className="text-sm font-medium text-slate-300">{label}</label>
          <span className="text-xs font-mono bg-slate-800/70 text-amber-300 px-2 py-0.5 rounded-md w-[45px] text-center">{value}</span>
        </div>
        <button onClick={onReset} className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-semibold">Đặt lại</button>
      </div>
      <input
        id={`${label}-slider`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
      />
    </div>
  );
};

export default FilterSlider;

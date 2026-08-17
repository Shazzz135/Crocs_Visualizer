import { useState, useEffect } from 'react';
import { colors, type Color } from '../data/colors';

interface ToolsProps {
  selectedColor?: string;
  onSelectColor?: (color: Color) => void;
}

export default function Tools({ selectedColor, onSelectColor }: ToolsProps) {
  const [activeColor, setActiveColor] = useState<string>(
    selectedColor || colors[0].color
  );

  useEffect(() => {
    if (selectedColor) {
      setActiveColor(selectedColor);
    }
  }, [selectedColor]);

  const handleSelect = (colorItem: Color) => {
    setActiveColor(colorItem.color);
    if (onSelectColor) {
      onSelectColor(colorItem);
    }
  };

  return (
    <div className="bg-gray-900 w-full h-full p-4 flex flex-col border-t md:border-t-0 md:border-r border-gray-800 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Color Selector</h2>
        <span className="text-xs text-gray-400">
          {colors.length} Colors
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {colors.map((item) => {
          const isSelected = activeColor === item.color;

          return (
            <button
              key={item.color}
              onClick={() => handleSelect(item)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                  : 'bg-gray-950/50 border-gray-800 text-gray-300 hover:bg-gray-800 hover:border-gray-700'
              }`}
            >
              <span className="text-sm font-medium truncate mr-2">
                {item.color}
              </span>

              {/* Color Swatch Trio */}
              <div className="flex items-center gap-1 shrink-0">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-gray-700 shadow-inner"
                  style={{ backgroundColor: item.set.c1 }}
                  title={`c1: ${item.set.c1}`}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-gray-700 shadow-inner"
                  style={{ backgroundColor: item.set.c2 }}
                  title={`c2: ${item.set.c2}`}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-gray-700 shadow-inner"
                  style={{ backgroundColor: item.set.c3 }}
                  title={`c3: ${item.set.c3}`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
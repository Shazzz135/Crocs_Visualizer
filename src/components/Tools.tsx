import { useState, useEffect } from 'react';
import { colors, type Color } from '../data/colors';
import { white_chars } from '../data/charms';

interface ToolsProps {
  selectedColor?: string;
  onSelectColor?: (color: Color) => void;
  onSelectCharm?: (char: string) => void;
}

// 6x6 grid character mapping in reading order
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');

export default function Tools({
  selectedColor,
  onSelectColor,
  onSelectCharm,
}: ToolsProps) {
  const [activeColor, setActiveColor] = useState<string>(
    selectedColor || colors[0].color
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCharm, setSelectedCharm] = useState<string | null>(null);

  useEffect(() => {
    if (selectedColor) {
      setActiveColor(selectedColor);
    }
  }, [selectedColor]);

  const handleSelectColor = (colorItem: Color) => {
    setActiveColor(colorItem.color);
    if (onSelectColor) {
      onSelectColor(colorItem);
    }
  };

  const handleSelectCharm = (char: string) => {
    setSelectedCharm(char);
    if (onSelectCharm) {
      onSelectCharm(char);
    }
  };

  // Filter charms based on search input
  const filteredCharms = CHARACTERS.map((char, index) => {
    const row = Math.floor(index / 6);
    const col = index % 6;
    return { char, index, row, col };
  }).filter(({ char }) =>
    char.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="bg-gray-900 w-full h-full p-4 flex flex-col border-t md:border-t-0 md:border-r border-gray-800 overflow-y-auto">
      {/* Color Selector Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Color Selector</h2>
        <span className="text-xs text-gray-400">{colors.length} Colors</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {colors.map((item) => {
          const isSelected = activeColor === item.color;

          return (
            <button
              key={item.color}
              onClick={() => handleSelectColor(item)}
              className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500'
                  : 'bg-gray-950/50 border-gray-800 text-gray-300 hover:bg-gray-800 hover:border-gray-700'
              }`}
            >
              <span className="text-sm font-medium truncate mr-2">
                {item.color}
              </span>

              <div className="flex items-center gap-1 shrink-0">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-gray-700 shadow-inner"
                  style={{ backgroundColor: item.set.c1 }}
                  title={`c1: ${item.set.c1}`}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="w-auto border-t border-gray-800 my-6" />

      {/* Jibbitz / Charms Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Jibbitz / Charms</h2>
        <span className="text-xs text-gray-400">
          {filteredCharms.length} Charms
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative w-full mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search charms (A-Z, 0-9)..."
          className="w-full pl-9 pr-4 py-2 text-sm text-white bg-gray-950/60 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 transition-all"
        />
      </div>

      {/* Charms Grid Sliced from Sprite Sheet */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {filteredCharms.map(({ char, index, row, col }) => {
          const isSelected = selectedCharm === char;

          return (
            <button
              key={`${char}-${index}`}
              onClick={() => handleSelectCharm(char)}
              title={`Charm: ${char}`}
              className={`group flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                  : 'bg-gray-950/50 border-gray-800 hover:bg-gray-800 hover:border-gray-700'
              }`}
            >
              {/* Sliced Sprite Tile */}
              <div
                className="w-12 h-12 bg-no-repeat transition-transform group-hover:scale-105"
                style={{
                  backgroundImage: `url(${white_chars})`,
                  backgroundSize: '600% 600%',
                  backgroundPosition: `${col * 20}% ${row * 20}%`,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
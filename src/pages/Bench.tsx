import { useState } from 'react';
import Tools from '../components/Tools';
import View from '../components/View';
import { colors, type Color } from '../data/colors';

export default function Bench() {
  const [selectedColor, setSelectedColor] = useState<Color>(colors[0]);

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-screen overflow-hidden text-white">
      <aside className="w-full md:w-1/2 h-1/3 md:h-full">
        <Tools
          selectedColor={selectedColor.color}
          onSelectColor={setSelectedColor}
        />
      </aside>

      <main className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center p-4">
        <View selectedColor={selectedColor} />
      </main>
    </div>
  );
}
import ColoredClog from './view/Canvas';
import { colors, type Color } from '../data/colors';

interface ViewProps {
  selectedColor?: Color | null;
}

export default function View({ selectedColor }: ViewProps) {
  // Extract c1, c2, c3 or fall back to the first color item in the list
  const activeColors = selectedColor?.set
    ? [selectedColor.set.c1, selectedColor.set.c2, selectedColor.set.c3].filter(
        Boolean
      )
    : [colors[0].set.c1, colors[0].set.c2, colors[0].set.c3];

  return (
    <div className="flex w-2/5 max-w-md gap-4 justify-center items-center">
      <ColoredClog
        color={{
          colors: activeColors,
          angle: 90,
        }}
      />

      <ColoredClog
        color={{
          colors: activeColors,
          angle: 90,
        }}
        flipped
      />
    </div>
  );
}
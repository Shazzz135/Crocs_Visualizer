import React, { useRef, useState, useCallback } from 'react';
import { calculateAngleDeg, type Point2D } from '@crocs/shared';

interface RotationDialProps {
  center: Point2D;
  rotationDeg: number;
  radius?: number;
  onRotate: (deg: number) => void;
}

export const RotationDial: React.FC<RotationDialProps> = ({
  center,
  rotationDeg,
  radius = 26,
  onRotate,
}) => {
  const [isRotating, setIsRotating] = useState(false);
  const svgRef = useRef<SVGGElement>(null);

  // Knob position at rotationDeg angle (0 deg is top / 12 o'clock)
  const angleRad = (rotationDeg * Math.PI) / 180;
  const knobX = center.x + radius * Math.sin(angleRad);
  const knobY = center.y - radius * Math.cos(angleRad);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      (e.target as Element).setPointerCapture(e.pointerId);
      setIsRotating(true);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isRotating) return;
      e.stopPropagation();
      const svg = svgRef.current?.ownerSVGElement;
      if (!svg) return;

      // Transform client pointer coordinates into SVG coordinate space
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      const newAngle = calculateAngleDeg(center, { x: svgPoint.x, y: svgPoint.y });
      onRotate(newAngle);
    },
    [center, isRotating, onRotate]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isRotating) return;
      e.stopPropagation();
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // no-op if pointer already released
      }
      setIsRotating(false);
    },
    [isRotating]
  );

  return (
    <g ref={svgRef} className="select-none pointer-events-auto">
      {/* Outer Halo Selection Ring */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="none"
        stroke="#10b981"
        strokeWidth="1.8"
        strokeDasharray="4 3"
        className="opacity-80 animate-pulse pointer-events-none"
      />

      {/* Guide Line from Center to Knob */}
      <line
        x1={center.x}
        y1={center.y}
        x2={knobX}
        y2={knobY}
        stroke="#10b981"
        strokeWidth="1.2"
        opacity="0.6"
        className="pointer-events-none"
      />

      {/* Interactive 360-Degree Rotation Handle Knob */}
      <g
        transform={`translate(${knobX}, ${knobY})`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="cursor-grab active:cursor-grabbing"
      >
        {/* Expanded invisible hit target for comfortable touch dragging */}
        <circle r={14} fill="transparent" />

        {/* Visual Knob */}
        <circle
          r={5.5}
          fill="#10b981"
          stroke="#06241a"
          strokeWidth="2"
          className="shadow-md shadow-emerald-500/50 hover:scale-125 transition-transform"
        />

        {/* Small center dot */}
        <circle r={1.5} fill="#02130e" />
      </g>

      {/* Degree Badge readout while rotating */}
      {isRotating && (
        <g transform={`translate(${center.x}, ${center.y - radius - 12})`}>
          <rect
            x={-14}
            y={-9}
            width={28}
            height={16}
            rx={4}
            fill="#06241a"
            stroke="#10b981"
            strokeWidth="1"
          />
          <text
            textAnchor="middle"
            y={3}
            fontSize="9"
            fontWeight="bold"
            fill="#34d399"
          >
            {rotationDeg}°
          </text>
        </g>
      )}
    </g>
  );
};

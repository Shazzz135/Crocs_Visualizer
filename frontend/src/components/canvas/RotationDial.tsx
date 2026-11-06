import React, { useRef, useState, useCallback } from 'react';
import type { Point2D } from '@crocs/shared';

interface RotationDialProps {
  center: Point2D;
  rotationDeg: number;
  radius?: number;
  onRotate: (deg: number) => void;
}

export const RotationDial: React.FC<RotationDialProps> = ({
  center,
  rotationDeg,
  radius = 48,
  onRotate,
}) => {
  const [isRotating, setIsRotating] = useState(false);
  const dragStartRef = useRef<{ startY: number; startAngle: number } | null>(null);

  // Knob position at rotationDeg angle (0 deg is 12 o'clock)
  const angleRad = (rotationDeg * Math.PI) / 180;
  const knobX = center.x + radius * Math.sin(angleRad);
  const knobY = center.y - radius * Math.cos(angleRad);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      try {
        (e.target as Element).setPointerCapture(e.pointerId);
      } catch {
        // pointer capture fallback
      }
      dragStartRef.current = { startY: e.clientY, startAngle: rotationDeg };
      setIsRotating(true);
    },
    [rotationDeg]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragStartRef.current;
      if (!isRotating || !drag) return;
      e.stopPropagation();

      // Smooth linear movement: dragging vertically (up/down) linearly changes rotation angle
      // Dragging UP rotates clockwise (+deg), dragging DOWN rotates counter-clockwise (-deg)
      const dy = drag.startY - e.clientY;
      const sensitivity = 1.0;
      const rawAngle = drag.startAngle + Math.round(dy * sensitivity);
      const normalizedAngle = ((rawAngle % 360) + 360) % 360;

      onRotate(normalizedAngle);
    },
    [isRotating, onRotate]
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
      dragStartRef.current = null;
      setIsRotating(false);
    },
    [isRotating]
  );

  return (
    <g data-rotation-dial="true" className="select-none pointer-events-auto">
      {/* Outer Halo Selection Ring */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radius - 8}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeDasharray="4 3"
        className="opacity-90 animate-pulse pointer-events-none"
      />

      {/* Connecting Stem from Halo to Rotation Point */}
      <line
        x1={center.x + (radius - 8) * Math.sin(angleRad)}
        y1={center.y - (radius - 8) * Math.cos(angleRad)}
        x2={knobX}
        y2={knobY}
        stroke="#10b981"
        strokeWidth="2"
        className="pointer-events-none"
      />

      {/* Prominent Linear Rotate Point (Drag vertically up/down to rotate) */}
      <g
        data-rotation-knob="true"
        transform={`translate(${knobX}, ${knobY})`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="cursor-ns-resize active:cursor-ns-resize transition-transform hover:scale-110 active:scale-125"
      >
        {/* Large invisible hit area (r=24 / 48px touch diameter for mobile) */}
        <circle r={24} fill="transparent" pointerEvents="all" />

        {/* Outer Emerald Glow Ring */}
        <circle
          r={12}
          fill="#06241a"
          stroke="#10b981"
          strokeWidth="2.5"
          className="shadow-lg filter drop-shadow(0 0 6px rgba(16,185,129,0.75))"
        />

        {/* Inner Solid Center Dot */}
        <circle r={4.5} fill="#34d399" />

        {/* Clean vertical arrows icon indicating vertical linear rotation */}
        <path
          d="M 0 -6 L -3.5 -2.5 M 0 -6 L 3.5 -2.5 M 0 -6 L 0 6 M 0 6 L -3.5 2.5 M 0 6 L 3.5 2.5"
          fill="none"
          stroke="#a7f3d0"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none opacity-90"
        />
      </g>

      {/* Live Degree Badge Readout while rotating */}
      {isRotating && (
        <g transform={`translate(${center.x}, ${center.y - radius - 18})`}>
          <rect
            x={-18}
            y={-10}
            width={36}
            height={18}
            rx={5}
            fill="#06241a"
            stroke="#10b981"
            strokeWidth="1.5"
          />
          <text
            textAnchor="middle"
            y={3}
            fontSize="10"
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

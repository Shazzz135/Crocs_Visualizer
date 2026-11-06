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
      // Swiping UP (dy > 0) rotates Counter-Clockwise (CCW)
      // Swiping DOWN (dy < 0) rotates Clockwise (CW)
      const dy = drag.startY - e.clientY;
      const sensitivity = 1.0;
      const rawAngle = drag.startAngle - Math.round(dy * sensitivity);
      const normalizedAngle = ((rawAngle % 360) + 360) % 360;

      onRotate(normalizedAngle);
    },
    [isRotating, onRotate]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isRotating) return;
      try {
        (e.target as Element).releasePointerCapture(e.pointerId);
      } catch {
        // no-op
      }
      setIsRotating(false);
      dragStartRef.current = null;
    },
    [isRotating]
  );

  return (
    <g
      data-rotation-dial="true"
      className="pointer-events-auto select-none"
      style={{ touchAction: 'none' }}
    >
      {/* Outer Halo Dial Guide Ring */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        fill="none"
        stroke={isRotating ? '#10b981' : 'rgba(52, 211, 153, 0.45)'}
        strokeWidth={isRotating ? 2 : 1.5}
        strokeDasharray={isRotating ? 'none' : '4 3'}
        className="transition-colors duration-150"
      />

      {/* Center Pivot Indicator */}
      <circle
        cx={center.x}
        cy={center.y}
        r={2.5}
        fill="#34d399"
        opacity={0.7}
        className="pointer-events-none"
      />

      {/* Dynamic Ray from Center to Knob */}
      <line
        x1={center.x}
        y1={center.y}
        x2={knobX}
        y2={knobY}
        stroke={isRotating ? '#34d399' : 'rgba(52, 211, 153, 0.5)'}
        strokeWidth={isRotating ? 2 : 1.5}
        className="pointer-events-none"
      />

      {/* Vertical Drag Handle Knob */}
      <g
        data-rotation-knob="true"
        transform={`translate(${knobX}, ${knobY})`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="cursor-ns-resize active:cursor-grabbing"
      >
        {/* Generous touch target (r=26) */}
        <circle r={26} fill="transparent" pointerEvents="all" />

        {/* Outer glowing halo ring */}
        <circle
          r={14}
          fill="#06241a"
          stroke={isRotating ? '#34d399' : '#10b981'}
          strokeWidth={2.5}
          style={{
            filter: isRotating
              ? 'drop-shadow(0 0 10px rgba(52, 211, 153, 0.95))'
              : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6))',
          }}
          className="transition-all duration-150"
        />

        {/* Center emerald core */}
        <circle r={5.5} fill="#34d399" />

        {/* Bold vertical arrows icon indicating vertical linear rotation */}
        <path
          d="M 0 -8 L -4 -4 M 0 -8 L 4 -4 M 0 -8 L 0 8 M 0 8 L -4 4 M 0 8 L 4 4"
          fill="none"
          stroke="#a7f3d0"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none opacity-95"
        />
      </g>

      {/* Live Degree Badge Readout while rotating */}
      {isRotating && (
        <g transform={`translate(${center.x}, ${center.y - radius - 20})`}>
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

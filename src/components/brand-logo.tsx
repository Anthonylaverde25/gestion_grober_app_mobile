import React from 'react';
import Svg, { G, Rect, Line } from 'react-native-svg';

interface BrandLogoProps {
  size?: number;
}

export function BrandLogo({ size = 60 }: BrandLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <G transform="translate(15, 15)">
        {/* Layer 1: Metallic Grey Base */}
        <Rect
          x={25}
          y={10}
          width={50}
          height={60}
          fill="#94a3b8"
          fillOpacity={0.2}
          stroke="#64748b"
          strokeWidth={1.5}
          rx={2}
          transform="skewX(-10)"
        />
        {/* Layer 2: Soft Glass Blue */}
        <Rect
          x={12}
          y={5}
          width={50}
          height={60}
          fill="#0ea5e9"
          fillOpacity={0.15}
          stroke="#0ea5e9"
          strokeWidth={1.5}
          rx={2}
          transform="skewX(-5)"
        />
        {/* Layer 3: Vibrant Glass Highlight */}
        <Rect
          x={0}
          y={0}
          width={50}
          height={60}
          fill="#38bdf8"
          fillOpacity={0.25}
          stroke="#38bdf8"
          strokeWidth={2}
          rx={2}
        />
        {/* Refraction Line Details */}
        <Line
          x1={5}
          y1={5}
          x2={45}
          y2={55}
          stroke="white"
          strokeOpacity={0.3}
          strokeWidth={1}
        />
        <Line
          x1={10}
          y1={0}
          x2={50}
          y2={50}
          stroke="white"
          strokeOpacity={0.3}
          strokeWidth={1}
        />
      </G>
    </Svg>
  );
}

import React from 'react';

interface GeometryVisualizerProps {
  data: any;
}

export const GeometryVisualizer: React.FC<GeometryVisualizerProps> = ({ data }) => {
  if (!data) return null;

  if (data.type === 'right_triangle') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <svg viewBox="0 0 200 150" style={{ width: '100%', maxWidth: '200px', height: 'auto' }}>
          <polygon points="30,120 170,120 30,30" fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="3" />
          {/* Right angle mark */}
          <rect x="30" y="105" width="15" height="15" fill="none" stroke="#38bdf8" strokeWidth="2" />
          {/* Leg labels */}
          <text x="100" y="138" fill="white" fontSize="13" textAnchor="middle" fontWeight="700">b = {data.b}</text>
          <text x="18" y="78" fill="white" fontSize="13" textAnchor="middle" fontWeight="700">a = {data.a}</text>
          <text x="110" y="65" fill="#f59e0b" fontSize="14" textAnchor="middle" fontWeight="800">c = ?</text>
        </svg>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Right Triangle: a² + b² = c²</div>
      </div>
    );
  }

  if (data.type === 'rectangle') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <svg viewBox="0 0 220 120" style={{ width: '100%', maxWidth: '220px', height: 'auto' }}>
          <rect x="25" y="20" width="170" height="80" rx="4" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" strokeWidth="3" />
          <text x="110" y="15" fill="white" fontSize="13" textAnchor="middle" fontWeight="700">length = {data.length} m</text>
          <text x="110" y="115" fill="white" fontSize="13" textAnchor="middle" fontWeight="700">length = {data.length} m</text>
          <text x="12" y="65" fill="white" fontSize="13" textAnchor="middle" fontWeight="700">w = {data.width} m</text>
          <text x="208" y="65" fill="white" fontSize="13" textAnchor="middle" fontWeight="700">w = {data.width} m</text>
        </svg>
      </div>
    );
  }

  if (data.type === 'angle') {
    const deg = data.degrees || 60;
    const rad = (deg * Math.PI) / 180;
    const x2 = 100 + 80 * Math.cos(-rad);
    const y2 = 100 + 80 * Math.sin(-rad);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <svg viewBox="0 0 200 130" style={{ width: '100%', maxWidth: '200px', height: 'auto' }}>
          {/* Base ray */}
          <line x1="100" y1="100" x2="180" y2="100" stroke="#38bdf8" strokeWidth="3" />
          {/* Angled ray */}
          <line x1="100" y1="100" x2={x2} y2={y2} stroke="#ec4899" strokeWidth="3" />
          {/* Vertex dot */}
          <circle cx="100" cy="100" r="4" fill="white" />
          <text x="125" y="85" fill="#f59e0b" fontSize="14" fontWeight="800">{deg}°</text>
        </svg>
      </div>
    );
  }

  return null;
};

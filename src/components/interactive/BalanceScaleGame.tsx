import React from 'react';

interface BalanceScaleGameProps {
  left: number | string;
  right: number | string;
}

export const BalanceScaleGame: React.FC<BalanceScaleGameProps> = ({ left, right }) => {
  const leftNum = typeof left === 'number' ? left : parseFloat(left) || 0;
  const rightNum = typeof right === 'number' ? right : parseFloat(right) || 0;

  // Calculate tilt angle: capped between -15deg and +15deg
  const diff = rightNum - leftNum;
  const tiltDeg = Math.max(-15, Math.min(15, diff * 2));

  return (
    <div className="balance-scale-wrapper" style={{ padding: '2rem 1rem 1rem 1rem' }}>
      {/* Animated Beam */}
      <div
        className="balance-beam"
        style={{
          transform: `rotate(${tiltDeg}deg)`,
          transformOrigin: 'center center',
        }}
      >
        {/* Left Pan */}
        <div
          className="balance-pan left"
          style={{
            transform: `translateX(-50%) rotate(${-tiltDeg}deg)`,
            transformOrigin: 'top center',
          }}
        >
          <span style={{ fontSize: '1.25rem', color: '#38bdf8' }}>{left}</span>
        </div>

        {/* Center Pivot */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '-5px',
            width: '12px',
            height: '12px',
            background: 'white',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Right Pan */}
        <div
          className="balance-pan right"
          style={{
            transform: `translateX(50%) rotate(${-tiltDeg}deg)`,
            transformOrigin: 'top center',
          }}
        >
          <span style={{ fontSize: '1.25rem', color: '#ec4899' }}>{right}</span>
        </div>
      </div>

      {/* Triangular Fulcrum Base */}
      <div className="balance-fulcrum" />
      <div
        style={{
          width: '60px',
          height: '6px',
          background: '#64748b',
          borderRadius: '3px',
          marginTop: '2px',
        }}
      />
    </div>
  );
};

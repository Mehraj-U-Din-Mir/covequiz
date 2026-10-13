import React from 'react';

interface NumberLineGameProps {
  start?: number;
  hop?: number;
  direction?: 'forward' | 'backward';
  range?: [number, number];
  currentPos?: number;
  onSelectTick?: (value: number) => void;
}

export const NumberLineGame: React.FC<NumberLineGameProps> = ({
  start = 0,
  range = [0, 20],
  onSelectTick,
}) => {
  const [min, max] = range;
  const count = max - min;
  const ticks = Array.from({ length: count + 1 }, (_, i) => min + i);

  return (
    <div className="number-line-container">
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
        Interactive Number Line (Click a number mark to place your answer)
      </div>

      <div className="number-line-axis" style={{ width: '92%' }}>
        {ticks.map((val) => {
          const pct = ((val - min) / count) * 100;
          const isStart = val === start;

          return (
            <div
              key={val}
              onClick={() => onSelectTick && onSelectTick(val)}
              style={{
                position: 'absolute',
                left: `${pct}%`,
                top: '-20px',
                bottom: '-25px',
                width: '28px',
                transform: 'translateX(-50%)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 5,
              }}
            >
              {/* Tick line */}
              <div
                style={{
                  width: val % 5 === 0 ? '3px' : '1px',
                  height: val % 5 === 0 ? '22px' : '14px',
                  background: isStart ? '#38bdf8' : val % 5 === 0 ? '#cbd5e1' : '#64748b',
                  marginTop: '12px',
                }}
              />

              {/* Number Label */}
              <div
                style={{
                  fontSize: val % 5 === 0 ? '0.85rem' : '0.72rem',
                  fontWeight: val % 5 === 0 || isStart ? 800 : 500,
                  color: isStart ? '#38bdf8' : 'var(--text-secondary)',
                  marginTop: '6px',
                  userSelect: 'none',
                }}
              >
                {val}
              </div>

              {/* Character marker if at start */}
              {isStart && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-18px',
                    fontSize: '1.2rem',
                    animation: 'bounce 1s infinite',
                  }}
                >
                  🐰
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

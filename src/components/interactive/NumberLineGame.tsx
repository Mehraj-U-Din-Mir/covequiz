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
  const step = count <= 20 ? 1 : count <= 50 ? 5 : 10;
  const ticks = Array.from({ length: count + 1 }, (_, i) => min + i);

  return (
    <div className="number-line-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '0.5rem 0.2rem' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textAlign: 'center' }}>
        Interactive Number Line (Tap a mark to select position)
      </div>

      <div className="number-line-axis" style={{ width: '92%', margin: '20px auto 30px auto' }}>
        {ticks.map((val) => {
          const pct = ((val - min) / count) * 100;
          const isStart = val === start;
          const isMajor = val % 5 === 0;
          const shouldShowLabel = count <= 15 || val === start || val === min || val === max || (count <= 30 && val % 2 === 0) || (val % step === 0);

          return (
            <div
              key={val}
              onClick={() => onSelectTick && onSelectTick(val)}
              style={{
                position: 'absolute',
                left: `${pct}%`,
                top: '-20px',
                bottom: '-25px',
                width: '26px',
                transform: 'translateX(-50%)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: isStart ? 10 : 5,
              }}
            >
              {/* Tick line */}
              <div
                style={{
                  width: isMajor ? '2px' : '1px',
                  height: isMajor ? '20px' : '12px',
                  background: isStart ? '#38bdf8' : isMajor ? '#cbd5e1' : '#64748b',
                  marginTop: '12px',
                }}
              />

              {/* Number Label */}
              {shouldShowLabel && (
                <div
                  style={{
                    fontSize: isMajor || isStart ? '0.78rem' : '0.68rem',
                    fontWeight: isMajor || isStart ? 800 : 500,
                    color: isStart ? '#38bdf8' : 'var(--text-secondary)',
                    marginTop: '4px',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {val}
                </div>
              )}

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

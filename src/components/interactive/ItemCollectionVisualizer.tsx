import React, { useState, useEffect } from 'react';
import { soundManager } from '../../audio/soundEffects';
import { RotateCcw, Check, Sparkles, Eye, Grid } from 'lucide-react';

export interface ItemCollectionVisualizerProps {
  count: number;
  item: string; // emoji e.g. '🦁', '🐒', '🦓', '🐘', '🦒'
  onSelectAnswer?: (val: number) => void;
  selectedAnswer?: number | string | null;
  isAnswerSubmitted?: boolean;
  correctAnswer?: number;
}

export const ItemCollectionVisualizer: React.FC<ItemCollectionVisualizerProps> = ({
  count,
  item = '🦁',
  onSelectAnswer,
  selectedAnswer,
  isAnswerSubmitted = false,
  correctAnswer,
}) => {
  // Store the set of tapped animal indices and their counting order
  const [countedIndices, setCountedIndices] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'safari' | 'organized'>('safari');
  const [highlightPairs, setHighlightPairs] = useState<boolean>(false);

  // Reset counted state whenever the question or count changes
  useEffect(() => {
    setCountedIndices([]);
  }, [count, item]);

  // Pre-generate stable positions around the watering hole for up to 20 animals
  const animalPositions = React.useMemo(() => {
    // Semi-random yet deterministic positions distributed around the watering hole center (x: 50%, y: 56%)
    const positions = [
      { x: 22, y: 38, scale: 0.95 },
      { x: 38, y: 28, scale: 0.9 },
      { x: 55, y: 26, scale: 0.9 },
      { x: 72, y: 34, scale: 0.95 },
      { x: 82, y: 48, scale: 1.0 },
      { x: 74, y: 66, scale: 1.05 },
      { x: 58, y: 72, scale: 1.1 },
      { x: 40, y: 74, scale: 1.1 },
      { x: 25, y: 65, scale: 1.05 },
      { x: 15, y: 50, scale: 1.0 },
      { x: 30, y: 46, scale: 1.0 },
      { x: 48, y: 44, scale: 1.0 },
      { x: 64, y: 50, scale: 1.0 },
      { x: 44, y: 60, scale: 1.05 },
      { x: 86, y: 28, scale: 0.85 },
      { x: 12, y: 32, scale: 0.85 },
      { x: 62, y: 80, scale: 1.15 },
      { x: 28, y: 78, scale: 1.15 },
      { x: 80, y: 76, scale: 1.1 },
      { x: 18, y: 20, scale: 0.8 },
    ];
    return positions.slice(0, count);
  }, [count]);

  const handleAnimalClick = (index: number) => {
    if (isAnswerSubmitted) return;

    if (countedIndices.includes(index)) {
      // Toggle off / remove from count
      const updated = countedIndices.filter((i) => i !== index);
      setCountedIndices(updated);
      soundManager.playClick();
    } else {
      // Add to count and play musical note
      const updated = [...countedIndices, index];
      setCountedIndices(updated);
      soundManager.playCount(updated.length);

      // If all animals have now been counted, suggest the answer
      if (onSelectAnswer && updated.length === count) {
        onSelectAnswer(updated.length);
      }
    }
  };

  const handleResetCount = () => {
    soundManager.playClick();
    setCountedIndices([]);
  };

  const handleApplyCountAsAnswer = () => {
    if (onSelectAnswer && countedIndices.length > 0) {
      soundManager.playClick();
      onSelectAnswer(countedIndices.length);
    }
  };

  const currentCount = countedIndices.length;

  return (
    <div
      style={{
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(180deg, #18181b 0%, #271406 50%, #1c1917 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        marginBottom: '1.25rem',
      }}
    >
      {/* Top Interactive Safari Control Bar */}
      <div className="safari-control-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
          <span style={{ fontSize: '1.1rem' }}>{item}</span>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#f59e0b', whiteSpace: 'nowrap' }}>
            Savanna Safari Scout
          </span>
          <span
            className="safari-helper-badge"
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.08)',
              padding: '0.15rem 0.45rem',
              borderRadius: '12px',
              whiteSpace: 'nowrap',
            }}
          >
            Touch animals to count
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          {/* View Toggle */}
          <button
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
            onClick={() => setViewMode((m) => (m === 'safari' ? 'organized' : 'safari'))}
            title="Toggle between natural habitat and organized grid"
          >
            {viewMode === 'safari' ? <Grid size={12} /> : <Eye size={12} />}
            <span>{viewMode === 'safari' ? 'Organize' : 'Safari'}</span>
          </button>

          {/* Pair Highlight Toggle */}
          <button
            className="btn btn-secondary btn-sm"
            style={{
              fontSize: '0.72rem',
              padding: '0.25rem 0.5rem',
              borderColor: highlightPairs ? '#38bdf8' : undefined,
              color: highlightPairs ? '#38bdf8' : undefined,
            }}
            onClick={() => setHighlightPairs((p) => !p)}
            title="Group animals in pairs of 2"
          >
            Pairs
          </button>

          {/* Reset button */}
          {currentCount > 0 && !isAnswerSubmitted && (
            <button
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem' }}
              onClick={handleResetCount}
              title="Reset counting marks"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Main Safari Stage / Watering Hole Landscape */}
      {viewMode === 'safari' ? (
        <div
          className="safari-stage-arena"
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(175px, 28vh, 230px)',
            background: 'radial-gradient(ellipse at 50% 65%, #0284c7 0%, #0369a1 28%, #1e3a5f 46%, #3b1d0c 70%, #1c1917 100%)',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >
          {/* Savanna Horizon Silhouette (Acacia Trees & Horizon) */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '80px',
              opacity: 0.35,
              pointerEvents: 'none',
            }}
            viewBox="0 0 600 80"
            preserveAspectRatio="none"
          >
            {/* Distant trees and hills */}
            <path
              d="M0,55 Q80,48 150,56 Q240,62 320,53 Q420,46 510,55 Q560,58 600,54 L600,80 L0,80 Z"
              fill="#18181b"
            />
            {/* Acacia 1 */}
            <path d="M70,55 L70,30 L55,20 Q70,24 85,20 L70,30" stroke="#09090b" strokeWidth="2.5" fill="none" />
            <ellipse cx="70" cy="18" rx="22" ry="6" fill="#09090b" opacity="0.6" />
            {/* Acacia 2 */}
            <path d="M520,55 L520,28 L505,18 Q520,22 535,18 L520,28" stroke="#09090b" strokeWidth="2.5" fill="none" />
            <ellipse cx="520" cy="16" rx="24" ry="7" fill="#09090b" opacity="0.6" />
          </svg>

          {/* Shimmering Watering Hole Center Pool with Animated Wave Rings */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '56%',
              transform: 'translate(-50%, -50%)',
              width: 'min(260px, 72%)',
              height: 'min(110px, 46%)',
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.45) 0%, rgba(14, 165, 233, 0.3) 50%, rgba(2, 132, 199, 0.15) 100%)',
              border: '2px solid rgba(56, 189, 248, 0.5)',
              boxShadow: '0 0 30px rgba(56, 189, 248, 0.35), inset 0 0 20px rgba(255, 255, 255, 0.2)',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            {/* Water Ripple SVG */}
            <svg width="100%" height="100%" viewBox="0 0 260 110" preserveAspectRatio="none">
              <ellipse cx="130" cy="55" rx="100" ry="40" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" strokeDasharray="6 4" />
              <ellipse cx="130" cy="55" rx="60" ry="24" fill="none" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" />
              <text x="130" y="58" fill="rgba(255, 255, 255, 0.5)" fontSize="11" textAnchor="middle" fontWeight="700">
                WATERING HOLE
              </text>
            </svg>
          </div>

          {/* Shoreline Rocks & Green Tufts */}
          <div
            style={{
              position: 'absolute',
              left: '26%',
              top: '72%',
              fontSize: '0.9rem',
              opacity: 0.7,
              pointerEvents: 'none',
            }}
          >
            🪨
          </div>
          <div
            style={{
              position: 'absolute',
              right: '25%',
              top: '38%',
              fontSize: '0.9rem',
              opacity: 0.7,
              pointerEvents: 'none',
            }}
          >
            🪨
          </div>
          <div
            style={{
              position: 'absolute',
              left: '18%',
              top: '48%',
              fontSize: '0.8rem',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          >
            🌿
          </div>
          <div
            style={{
              position: 'absolute',
              right: '18%',
              top: '68%',
              fontSize: '0.8rem',
              opacity: 0.6,
              pointerEvents: 'none',
            }}
          >
            🌿
          </div>

          {/* Animals Rendered at Natural Watering Hole Shoreline */}
          {animalPositions.map((pos, idx) => {
            const isCounted = countedIndices.includes(idx);
            const countOrder = countedIndices.indexOf(idx) + 1;
            const isPairHighlighted = highlightPairs && Math.floor(idx / 2) % 2 === 0;

            // In submitted mode: show true count badges if student made a mistake
            const showTrueNumber = isAnswerSubmitted;

            return (
              <div
                key={idx}
                onClick={() => handleAnimalClick(idx)}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: `translate(-50%, -50%) scale(${pos.scale})`,
                  cursor: isAnswerSubmitted ? 'default' : 'pointer',
                  zIndex: isCounted ? 15 : 10,
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Counting Order Badge */}
                {(isCounted || showTrueNumber) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      background: showTrueNumber ? '#f59e0b' : '#10b981',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6), 0 0 10px rgba(16, 185, 129, 0.7)',
                      zIndex: 20,
                      animation: 'popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      border: '1.5px solid white',
                    }}
                  >
                    {showTrueNumber ? idx + 1 : countOrder}
                  </div>
                )}

                {/* Ground Shadow */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    width: '32px',
                    height: '8px',
                    background: 'rgba(0, 0, 0, 0.55)',
                    borderRadius: '50%',
                    filter: 'blur(2px)',
                    zIndex: 1,
                  }}
                />

                {/* Animal Sprite with Interactive Highlight Ring */}
                <div
                  style={{
                    fontSize: 'clamp(1.7rem, 5.5vw, 2.5rem)',
                    lineHeight: 1,
                    position: 'relative',
                    zIndex: 5,
                    filter: isCounted
                      ? 'drop-shadow(0 0 10px #10b981) brightness(1.15)'
                      : isPairHighlighted
                      ? 'drop-shadow(0 0 8px #38bdf8)'
                      : 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))',
                    transform: isCounted ? 'scale(1.12)' : 'scale(1)',
                    transition: 'transform 0.2s ease, filter 0.2s ease',
                  }}
                >
                  {item}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Organized Ten-Frame / Rows View */
        <div
          style={{
            padding: '1.25rem 1rem',
            background: 'rgba(0, 0, 0, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Organized in groups of 5 for clear counting:
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.8rem',
              maxWidth: '380px',
            }}
          >
            {Array.from({ length: count }).map((_, idx) => {
              const isCounted = countedIndices.includes(idx);
              const countOrder = countedIndices.indexOf(idx) + 1;
              const showTrueNumber = isAnswerSubmitted;

              return (
                <div
                  key={idx}
                  onClick={() => handleAnimalClick(idx)}
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: 'var(--radius-md)',
                    background: isCounted
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `2px solid ${
                      isCounted ? '#10b981' : 'rgba(255, 255, 255, 0.12)'
                    }`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isAnswerSubmitted ? 'default' : 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{item}</span>
                  {(isCounted || showTrueNumber) && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '-6px',
                        background: showTrueNumber ? '#f59e0b' : '#10b981',
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {showTrueNumber ? idx + 1 : countOrder}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Counter Bar & Answer Connector */}
      <div className="safari-counter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Your Finger Count:
          </span>
          <span
            style={{
              fontSize: '1.3rem',
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              color: currentCount > 0 ? '#10b981' : 'white',
            }}
          >
            {currentCount} {item}
          </span>
          {currentCount > 0 && (
            <span style={{ fontSize: '0.78rem', color: '#10b981' }}>
              ({currentCount} of {count} tagged)
            </span>
          )}
        </div>

        {/* Action button to bridge counting into selected answer */}
        {!isAnswerSubmitted ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {currentCount > 0 && onSelectAnswer && (
              <button
                className="btn btn-primary btn-sm"
                style={{
                  background:
                    selectedAnswer === currentCount
                      ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                      : 'var(--grad-primary)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.82rem',
                }}
                onClick={handleApplyCountAsAnswer}
              >
                <Check size={14} />
                {selectedAnswer === currentCount
                  ? `Selected: ${currentCount}`
                  : `Select "${currentCount}" as My Answer`}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f59e0b' }}>
              Correct Total: {correctAnswer ?? count} {item}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { GuiGameType, GuiQuestion } from '../../types/guiGame';
import { Crown, Flame, Swords, Zap, Shield, Sparkles } from 'lucide-react';

export interface GuiGameRendererProps {
  gameType: GuiGameType;
  question: GuiQuestion;
  selectedAnswer?: string | number | null;
  isAnswerSubmitted?: boolean;
  isCorrect?: boolean;
  onSelectOption?: (opt: string | number) => void;
  ropePosition?: number;
  fuelLevel?: number;
  towerStories?: number;
  p1Stories?: number;
  p2Stories?: number;
  p1Fuel?: number;
  p2Fuel?: number;
  p1RacePos?: number;
  p2RacePos?: number;
  p1Score?: number;
  p2Score?: number;
  p1Streak?: number;
  p2Streak?: number;
  lastActionMessage?: string;
  isTwoPlayerMode?: boolean;
}

export const GuiGameRenderer: React.FC<GuiGameRendererProps> = ({
  gameType,
  question,
  selectedAnswer,
  isAnswerSubmitted,
  isCorrect,
  onSelectOption,
  ropePosition = 50,
  fuelLevel = 40,
  towerStories = 3,
  p1Stories = 3,
  p2Stories = 3,
  p1Fuel = 50,
  p2Fuel = 40,
  p1RacePos = 50,
  p2RacePos = 40,
  p1Score = 0,
  p2Score = 0,
  p1Streak = 0,
  p2Streak = 0,
  lastActionMessage,
  isTwoPlayerMode = true,
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(165deg, rgba(13, 21, 39, 0.95) 0%, rgba(7, 11, 20, 0.98) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        minHeight: '290px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 10px 30px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* 1. Tug of War (Real War Head-to-Head) */}
      {gameType === 'tug_of_war' && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', fontWeight: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8' }}>
              <span style={{ fontSize: '1.4rem' }}>🟦</span>
              <div>
                <div style={{ fontSize: '0.85rem' }}>BLUE TITANS (P1)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pull Force: {100 - ropePosition}%</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(255, 255, 255, 0.06)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24' }}>
              <Swords size={13} />
              <span>WAR TENSION</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fb7185' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem' }}>RUBY FALCONS (P2)</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pull Force: {ropePosition}%</div>
              </div>
              <span style={{ fontSize: '1.4rem' }}>🟥</span>
            </div>
          </div>

          {/* Rope & Arena */}
          <div style={{ position: 'relative', height: '42px', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '21px', border: '2px solid rgba(255, 255, 255, 0.12)', overflow: 'hidden', margin: '0.8rem 0' }}>
            {/* Center boundary line */}
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '4px', background: '#e2e8f0', transform: 'translateX(-50%)', zIndex: 1 }} />
            {/* Left territory fill (P1) */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${100 - ropePosition}%`, background: 'rgba(56, 189, 248, 0.15)', transition: 'width 0.4s ease' }} />
            {/* Right territory fill (P2) */}
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: `${ropePosition}%`, background: 'rgba(244, 63, 94, 0.15)', transition: 'width 0.4s ease' }} />
            {/* Rope */}
            <div style={{ position: 'absolute', top: '18px', left: '8%', right: '8%', height: '7px', background: '#d97706', borderRadius: '4px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)' }} />
            {/* Gold Ribbon Marker */}
            <div
              style={{
                position: 'absolute',
                left: `${ropePosition}%`,
                top: '9px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#f59e0b',
                border: '3px solid white',
                transform: 'translateX(-50%)',
                transition: 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: '0 0 18px #f59e0b, 0 0 6px white',
                zIndex: 2,
              }}
            />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {ropePosition < 50 ? '⚡ Player 1 is pulling the battle ribbon across!' : ropePosition > 50 ? '⚡ Player 2 is pulling the battle ribbon across!' : '⚡ Stalemate! Speed and accuracy will claim victory!'}
          </div>
        </div>
      )}

      {/* 2. Rocket Launch (Dual Space Race) */}
      {gameType === 'rocket_launch' && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '0.8rem' }}>
            {/* P1 Rocket */}
            <div style={{ background: 'rgba(56, 189, 248, 0.06)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>BLUE SATURN (P1)</span>
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>{p1Fuel}% THRUST</span>
              </div>
              <div style={{ fontSize: '2.5rem', transform: `translateY(-${Math.min(25, (p1Fuel / 100) * 25)}px)`, transition: 'transform 0.4s ease' }}>🚀</div>
              <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px', overflow: 'hidden', marginTop: '0.4rem' }}>
                <div style={{ width: `${p1Fuel}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* P2 Rocket */}
            <div style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fb7185' }}>RUBY MARS (P2)</span>
                <span style={{ fontSize: '0.72rem', color: '#fb7185', fontFamily: 'var(--font-mono)' }}>{p2Fuel}% THRUST</span>
              </div>
              <div style={{ fontSize: '2.5rem', transform: `translateY(-${Math.min(25, (p2Fuel / 100) * 25)}px)`, transition: 'transform 0.4s ease' }}>🚀</div>
              <div style={{ height: '10px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '5px', overflow: 'hidden', marginTop: '0.4rem' }}>
                <div style={{ width: `${p2Fuel}%`, height: '100%', background: 'linear-gradient(90deg, #f43f5e, #ec4899)', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Each correct calculation injects 20% rocket fuel thrust!
          </div>
        </div>
      )}

      {/* 3. Tower Builder (Dual Battle Towers Side-by-Side!) */}
      {gameType === 'tower_builder' && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {/* Header Title & Comparator */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem' }}>
              <span>🟦 P1 TOWER: {p1Stories} FLOORS</span>
              {p1Stories > p2Stories && <Crown size={16} color="#fbbf24" />}
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24' }}>
              🏰 WAR CITADEL
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fb7185', fontWeight: 800, fontSize: '0.85rem' }}>
              {p2Stories > p1Stories && <Crown size={16} color="#fbbf24" />}
              <span>P2 TOWER: {p2Stories} FLOORS 🟥</span>
            </div>
          </div>

          {/* Dual Towers Arena */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-end',
              height: '180px',
              padding: '0.5rem 1rem 0',
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              borderBottom: '4px solid #334155',
              position: 'relative',
            }}
          >
            {/* Player 1 Blue Tower */}
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '3px', width: '100px', alignItems: 'center' }}>
              <div style={{ width: '110px', height: '6px', background: '#38bdf8', borderRadius: '3px', marginTop: '2px' }} />
              {Array.from({ length: Math.min(7, p1Stories) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '22px',
                    width: '100%',
                    background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(56, 189, 248, 0.3)',
                    animation: i === p1Stories - 1 ? 'pulseGlow 1s' : undefined,
                  }}
                >
                  P1 FL {i + 1}
                </div>
              ))}
            </div>

            {/* Center Battle Emblems */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.5rem' }}>
              <div style={{ fontSize: '1.8rem', animation: 'bounce 2s infinite' }}>⚡⚔️⚡</div>
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: p1Stories > p2Stories ? '#38bdf8' : p2Stories > p1Stories ? '#fb7185' : '#fbbf24',
                  background: 'rgba(0,0,0,0.4)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                }}
              >
                {p1Stories > p2Stories ? 'P1 Blue Leading!' : p2Stories > p1Stories ? 'P2 Ruby Leading!' : 'Tied Height!'}
              </div>
            </div>

            {/* Player 2 Ruby Tower */}
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '3px', width: '100px', alignItems: 'center' }}>
              <div style={{ width: '110px', height: '6px', background: '#f43f5e', borderRadius: '3px', marginTop: '2px' }} />
              {Array.from({ length: Math.min(7, p2Stories) }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: '22px',
                    width: '100%',
                    background: 'linear-gradient(90deg, #e11d48, #fb7185)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.72rem',
                    color: 'white',
                    boxShadow: '0 2px 8px rgba(244, 63, 94, 0.3)',
                    animation: i === p2Stories - 1 ? 'pulseGlow 1s' : undefined,
                  }}
                >
                  P2 FL {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Maze Escape */}
      {gameType === 'maze_escape' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 48px)', gap: '6px' }}>
          {Array.from({ length: 16 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                height: '48px',
                borderRadius: '8px',
                background: idx === 0 ? '#10b981' : idx === 15 ? '#f59e0b' : idx % 3 === 0 ? '#1e293b' : 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
              }}
            >
              {idx === 0 ? '🚶' : idx === 15 ? '🚪' : idx % 3 === 0 ? '🧱' : '✨'}
            </div>
          ))}
        </div>
      )}

      {/* 5. Treasure Hunt */}
      {gameType === 'treasure_hunt' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏝️ 🗝️ 💎</div>
          <div style={{ fontSize: '0.9rem', color: '#8b5cf6', fontWeight: 700 }}>
            Coordinate Waypoint: Skeleton Bay • Clue Secret Key #4
          </div>
        </div>
      )}

      {/* 6. Number Ninja */}
      {gameType === 'number_ninja' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>⚔️ 🥷 🍉</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Slice Target: Strike the correct mathematical expression!
          </div>
        </div>
      )}

      {/* 7. Basketball */}
      {gameType === 'basketball' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
            <div style={{ fontSize: '3rem' }}>🏀</div>
            <div style={{ width: '80px', height: '60px', borderTop: '4px solid #ea580c', borderLeft: '2px solid white', borderRight: '2px solid white', borderRadius: '0 0 20px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(234, 88, 12, 0.1)' }}>
              <span style={{ fontSize: '1.4rem' }}>🎯</span>
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#f97316', fontWeight: 700, marginTop: '0.6rem' }}>
            Trajectory Ready • Distance 6.5m
          </div>
        </div>
      )}

      {/* 8. Arithmetic Racing (Dual-Lane Drag Strip) */}
      {gameType === 'arithmetic_racing' && (
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            <span style={{ color: '#38bdf8' }}>🟦 P1 BLUE RACER: {p1RacePos}M</span>
            <span style={{ color: '#fbbf24' }}>⚡ CIRCUIT DUEL</span>
            <span style={{ color: '#fb7185' }}>P2 RUBY RACER: {p2RacePos}M 🟥</span>
          </div>
          
          {/* Lane 1: Player 1 Blue Racer */}
          <div style={{ height: '30px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '15px', border: '1px solid rgba(56, 189, 248, 0.3)', position: 'relative', overflow: 'hidden', marginBottom: '0.4rem' }}>
            <div style={{ position: 'absolute', left: `${Math.min(88, Math.max(8, p1RacePos))}%`, top: '1px', fontSize: '1.4rem', transform: 'translateX(-50%)', transition: 'left 0.4s ease' }}>
              🏎️
            </div>
            <div style={{ position: 'absolute', right: '10px', top: '5px', fontSize: '1.1rem' }}>🏁</div>
          </div>

          {/* Lane 2: Player 2 Ruby Racer */}
          <div style={{ height: '30px', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '15px', border: '1px solid rgba(244, 63, 94, 0.3)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: `${Math.min(88, Math.max(8, p2RacePos))}%`, top: '1px', fontSize: '1.4rem', transform: 'translateX(-50%)', transition: 'left 0.4s ease' }}>
              🏎️
            </div>
            <div style={{ position: 'absolute', right: '10px', top: '5px', fontSize: '1.1rem' }}>🏁</div>
          </div>
        </div>
      )}

      {/* 9. Balloon Pop */}
      {gameType === 'balloon_pop' && (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {['🎈', '🎈', '🎈', '🎈'].map((b, i) => (
            <div key={i} style={{ fontSize: '2.5rem', animation: `bounce ${1 + i * 0.3}s infinite` }}>
              {b}
            </div>
          ))}
        </div>
      )}

      {/* 10. Bridge Builder */}
      {gameType === 'bridge_builder' && (
        <div style={{ textAlign: 'center', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '2rem' }}>
            <span>⛰️</span>
            <span style={{ borderBottom: '6px dashed #14b8a6', flex: 1, margin: '0 10px' }} />
            <span>⛰️</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#14b8a6', fontWeight: 700, marginTop: '0.5rem' }}>
            Truss Section 3 under construction
          </div>
        </div>
      )}

      {/* 11. Robot Factory */}
      {gameType === 'robot_factory' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🤖 ⚙️ 🔲</div>
          <div style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 700, marginTop: '0.4rem' }}>
            Instruction Register: [STEP, EVALUATE, ROTATE]
          </div>
        </div>
      )}

      {/* 12. Pizza Workshop */}
      {gameType === 'pizza_workshop' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem' }}>🍕 🧀 🍄</div>
          <div style={{ fontSize: '0.85rem', color: '#f43f5e', fontWeight: 700, marginTop: '0.4rem' }}>
            Equal Slices Workbench
          </div>
        </div>
      )}

      {/* 13. Geometry Builder */}
      {gameType === 'geometry_builder' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>📐 🔷 🔺</div>
          <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 700, marginTop: '0.4rem' }}>
            Polygon Snap Workbench
          </div>
        </div>
      )}

      {/* 14. Number Line Adventure */}
      {gameType === 'number_line_adventure' && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.3rem' }}>🐰 🥕 ⭐</div>
          <div style={{ height: '4px', background: '#84cc16', margin: '0.5rem 1rem', borderRadius: '2px' }} />
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Continuous Axis Navigator</div>
        </div>
      )}

      {/* 15. Math Memory Match */}
      {gameType === 'math_memory' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 44px)', gap: '8px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '44px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #d946ef, #8b5cf6)',
                border: '1px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: 'white',
              }}
            >
              ?
            </div>
          ))}
        </div>
      )}

      {/* 16. Code Breaker */}
      {gameType === 'code_breaker' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem' }}>🔐 🔢 🔑</div>
          <div style={{ fontSize: '0.85rem', color: '#eab308', fontWeight: 700, marginTop: '0.4rem' }}>
            Cipher Pin 2 of 3 Disengaged
          </div>
        </div>
      )}

      {/* 17. Factory Conveyor */}
      {gameType === 'factory_conveyor' && (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>📦 ⚙️ 📦 ⚙️</div>
          <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
            <span>[Bin A: Even]</span>
            <span>[Bin B: Odd]</span>
            <span>[Bin C: Multiples]</span>
          </div>
        </div>
      )}

      {/* 18. Target Number */}
      {gameType === 'target_number' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🎯 ➕ ✖️</div>
          <div style={{ fontSize: '0.9rem', color: '#4f46e5', fontWeight: 800, marginTop: '0.4rem' }}>
            Bullseye Target Math Board
          </div>
        </div>
      )}

      {/* 19. Logic Grid */}
      {gameType === 'logic_grid' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem' }}>🕵️‍♂️ 📋 🔍</div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700, marginTop: '0.4rem' }}>
            Deductive Evidence Matrix
          </div>
        </div>
      )}

      {/* 20. Ultimate Arena */}
      {gameType === 'ultimate_arena' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', animation: 'bounce 1.5s infinite' }}>🐉 ⚔️ 🛡️</div>
          <div style={{ fontSize: '0.9rem', color: '#e11d48', fontWeight: 900, marginTop: '0.4rem' }}>
            BOSS BATTLE: Math Dragon Phase 1
          </div>
        </div>
      )}
    </div>
  );
};

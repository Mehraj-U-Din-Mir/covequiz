import React, { useState } from 'react';
import { getGuiGamesByLevel, ALL_100_GUI_GAMES } from '../../engine/guiGameRegistry';
import { GuiGameDefinition, SessionConfig, GuiGameStageConfig } from '../../types/guiGame';
import { PreGameConfigModal } from './PreGameConfigModal';
import { StageSelectorModal } from './StageSelectorModal';
import { GuiGameArena } from './GuiGameArena';
import { soundManager } from '../../audio/soundEffects';
import { Gamepad2, Search, Zap, Compass, Star, Sparkles } from 'lucide-react';

export const GuiGameCatalog: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGame, setActiveGame] = useState<GuiGameDefinition | null>(null);
  const [isPreGameModalOpen, setIsPreGameModalOpen] = useState<boolean>(false);
  const [isStageSelectOpen, setIsStageSelectOpen] = useState<boolean>(false);
  const [activeSessionConfig, setActiveSessionConfig] = useState<SessionConfig | null>(null);

  const levelGames = getGuiGamesByLevel(selectedLevel);

  const filteredGames = levelGames.filter((g) => {
    return (
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.shortObjective.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleLaunchGame = (game: GuiGameDefinition) => {
    soundManager.playClick();
    setActiveGame(game);
    setIsPreGameModalOpen(true);
  };

  const handleStartSession = (config: SessionConfig) => {
    setIsPreGameModalOpen(false);
    setActiveSessionConfig(config);
  };

  const handlePickStage = (stg: GuiGameStageConfig) => {
    setIsStageSelectOpen(false);
    setActiveSessionConfig({
      mode: 'stage_journey',
      questionCount: 10,
      selectedStageNumber: stg.stageNumber,
    });
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-purple">
            <Gamepad2 size={13} /> Dedicated GUI Arcade Engine
          </span>
          <span className="badge badge-blue">100 Games • 3,000 Playable Stages</span>
        </div>
        <h2 style={{ fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
          Interactive Mathematics Games (Levels 1–5)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '850px' }}>
          Experience strategy games, rocket launches, obstacle mazes, tower builders, and code breakers. Every game features 30 progressive stages (Easy 1–10, Intermediate 11–20, Advanced 21–30) and customizable session lengths.
        </p>
      </div>

      {/* Level Selector Strip (1 to 5) */}
      <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.3rem' }}>
        {[1, 2, 3, 4, 5].map((lvl) => (
          <button
            key={lvl}
            className={`btn ${selectedLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              soundManager.playClick();
              setSelectedLevel(lvl);
            }}
            style={{ minWidth: '120px', flexDirection: 'column', padding: '0.6rem 1rem' }}
          >
            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>Level {lvl}</span>
            <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>20 GUI Games</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '1.25rem', position: 'relative', maxWidth: '400px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search by game title or mechanic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 0.8rem 0.6rem 2.3rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            color: 'white',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
      </div>

      {/* 20 Games Grid */}
      <div className="games-grid">
        {filteredGames.map((game, idx) => (
          <div key={game.id} className="game-card" onClick={() => handleLaunchGame(game)}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '2rem' }}>{game.icon}</span>
                <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                  30 Stages
                </span>
              </div>

              <h3 className="game-card-title">
                {idx + 1}. {game.title}
              </h3>
              <p className="game-card-desc">{game.shortObjective}</p>
            </div>

            <div>
              <div className="game-card-meta">
                <span>Stages: <strong>1–30</strong></span>
                <button className="btn btn-primary btn-sm" style={{ gap: '0.3rem' }}>
                  <Zap size={14} fill="white" /> Play Game
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pre-Game Configuration Modal */}
      {activeGame && isPreGameModalOpen && (
        <PreGameConfigModal
          game={activeGame}
          isOpen={isPreGameModalOpen}
          onClose={() => setIsPreGameModalOpen(false)}
          onStartSession={handleStartSession}
          onOpenStageSelect={() => {
            setIsPreGameModalOpen(false);
            setIsStageSelectOpen(true);
          }}
        />
      )}

      {/* Stage Selector Modal */}
      {activeGame && isStageSelectOpen && (
        <StageSelectorModal
          game={activeGame}
          isOpen={isStageSelectOpen}
          onClose={() => setIsStageSelectOpen(false)}
          onSelectStage={handlePickStage}
        />
      )}

      {/* Active Game Arena */}
      {activeGame && activeSessionConfig && (
        <GuiGameArena
          game={activeGame}
          config={activeSessionConfig}
          onExit={() => {
            setActiveSessionConfig(null);
            setActiveGame(null);
          }}
        />
      )}
    </div>
  );
};

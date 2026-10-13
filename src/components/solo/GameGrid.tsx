import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { getGamesByLevel } from '../../data/gamesRegistry';
import { GameDefinition, MathDomain } from '../../types/game';
import { soundManager } from '../../audio/soundEffects';
import { Play, Star, Search, Filter, Sparkles, BookOpen } from 'lucide-react';

interface GameGridProps {
  onSelectGame: (game: GameDefinition) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({ onSelectGame }) => {
  const { profile } = usePlayer();
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const games = getGamesByLevel(profile.selectedLevel);

  const domains = Array.from(new Set(games.map((g) => g.domain)));

  const filteredGames = games.filter((g) => {
    const matchesDomain = selectedDomain === 'all' || g.domain === selectedDomain;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.learningObjective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.nepCompetencyCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const handleLaunchGame = (game: GameDefinition) => {
    soundManager.playClick();
    onSelectGame(game);
  };

  const getDomainColor = (domain: MathDomain) => {
    switch (domain) {
      case 'Number Sense': return 'badge-blue';
      case 'Arithmetic': return 'badge-green';
      case 'Geometry & Spatial': return 'badge-purple';
      case 'Fractions & Decimals': return 'badge-amber';
      case 'Algebra': return 'badge-blue';
      case 'Measurement': return 'badge-green';
      case 'Financial & Everyday': return 'badge-amber';
      case 'Logic & Patterns': return 'badge-purple';
      default: return 'badge-blue';
    }
  };

  return (
    <div>
      {/* Search and Filters Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.8rem',
          marginBottom: '1.25rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '240px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search quest or NEP competency..."
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

        {/* Domain Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            className={`btn btn-sm ${selectedDomain === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              soundManager.playClick();
              setSelectedDomain('all');
            }}
          >
            All (20)
          </button>
          {domains.map((dom) => (
            <button
              key={dom}
              className={`btn btn-sm ${selectedDomain === dom ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedDomain(dom);
              }}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 20 Games */}
      <div className="games-grid">
        {filteredGames.map((game, idx) => {
          const progress = profile.levelProgress[game.id] || { highScore: 0, stars: 0 };
          const stars = progress.stars;

          return (
            <div key={game.id} className="game-card" onClick={() => handleLaunchGame(game)}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span className={`badge ${getDomainColor(game.domain)}`}>
                    {game.domain}
                  </span>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        fill={s <= stars ? '#f59e0b' : 'transparent'}
                        color={s <= stars ? '#f59e0b' : '#475569'}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="game-card-title">
                  {idx + 1}. {game.title}
                </h3>
                <p className="game-card-desc">{game.learningObjective}</p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.8rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <BookOpen size={13} />
                  <span>{game.nepCompetencyCode}</span>
                </div>

                <div className="game-card-meta">
                  <span>High Score: <strong>{progress.highScore}</strong></span>
                  <button className="btn btn-primary btn-sm" style={{ gap: '0.3rem' }}>
                    <Play size={13} fill="white" /> Play
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

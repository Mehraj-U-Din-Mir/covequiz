import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { AVATAR_OPTIONS } from '../../data/avatars';
import { soundManager } from '../../audio/soundEffects';
import { Sparkles, X, Check, RefreshCw } from 'lucide-react';

interface AvatarPickerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ isOpen, onClose }) => {
  const { profile, setNickname, setAvatar, regenerateCodename } = usePlayer();
  const [nameInput, setNameInput] = useState(profile.nickname);

  if (!isOpen) return null;

  const handleSelectAvatar = (id: string) => {
    soundManager.playClick();
    setAvatar(id);
  };

  const handleRegenerate = () => {
    soundManager.playClick();
    regenerateCodename();
    setNameInput(profile.nickname);
  };

  const handleSave = () => {
    soundManager.playCorrect();
    setNickname(nameInput);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="#6366f1" />
            <h3>Choose Student Identity</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
            No email or password needed! Choose your math avatar and codename for solo quests and live multiplayer battles.
          </p>

          {/* Nickname input */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              PLAYER CODENAME
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={nameInput}
                maxLength={22}
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
              <button className="btn btn-secondary" onClick={handleRegenerate} title="Generate random math codename">
                <RefreshCw size={16} /> Random
              </button>
            </div>
          </div>

          {/* Avatars Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
              CHOOSE AVATAR
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
              {AVATAR_OPTIONS.map((av) => {
                const isSelected = profile.avatar === av.id;
                return (
                  <button
                    key={av.id}
                    onClick={() => handleSelectAvatar(av.id)}
                    style={{
                      background: isSelected ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.04)',
                      border: isSelected ? '2px solid white' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      transform: isSelected ? 'scale(1.05)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{av.emoji}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 600, color: isSelected ? 'white' : 'var(--text-secondary)' }}>
                      {av.name.split(' ')[1] || av.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Check size={18} /> Ready to Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

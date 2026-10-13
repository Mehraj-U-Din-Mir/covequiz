import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { CORE_BADGE_LIST } from '../../data/achievementBadges';
import { BadgeIcon } from './BadgeIcon';
import { soundManager } from '../../audio/soundEffects';
import {
  X,
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  Cloud,
  HardDrive,
  RefreshCw,
  Gift
} from 'lucide-react';

interface BadgeShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BadgeShowcaseModal: React.FC<BadgeShowcaseModalProps> = ({ isOpen, onClose }) => {
  const { profile, syncBadgesToServer } = usePlayer();
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const earnedMap = new Map((profile.earnedBadges || []).map((b) => [b.badgeId, b]));

  const handleManualSync = async () => {
    soundManager.playClick();
    setIsSyncing(true);
    setSyncStatus('Syncing with server...');
    const ok = await syncBadgesToServer();
    setIsSyncing(false);
    setSyncStatus(ok ? 'Synced successfully!' : 'Device local mode (offline)');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const unlockedCount = profile.earnedBadges?.length || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '720px',
          width: '95%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: '#0a0f1d',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header matching screenshot styling */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Trophy size={20} color="#f59e0b" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', margin: 0 }}>
                Achievement Badges
              </h3>
              <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                {unlockedCount} / {CORE_BADGE_LIST.length} Unlocked
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Earn badges by mastering accuracy, problem-solving, and excellence across all math quizzes.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleManualSync}
              disabled={isSyncing}
              title="Sync badges with classroom cloud"
              style={{ padding: '0.4rem 0.7rem' }}
            >
              <RefreshCw size={13} className={isSyncing ? 'spin' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <button className="btn-icon" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sync notification message */}
        {syncStatus && (
          <div
            style={{
              padding: '0.5rem 1rem',
              background: 'rgba(56, 189, 248, 0.15)',
              borderBottom: '1px solid rgba(56, 189, 248, 0.3)',
              fontSize: '0.8rem',
              color: '#38bdf8',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Cloud size={14} /> {syncStatus}
          </div>
        )}

        {/* Storage status banner distinguishing local vs cloud progress */}
        <div
          style={{
            padding: '0.7rem 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
            <HardDrive size={13} color="#38bdf8" />
            <span>Anonymous Profile ID: <strong style={{ color: 'white' }}>{profile.nickname}</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Storage Type:</span>
            <span
              style={{
                padding: '0.15rem 0.5rem',
                borderRadius: '8px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: '#38bdf8',
                fontWeight: 700,
                fontSize: '0.72rem',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              Device Local Persistent (Cloud Ready)
            </span>
          </div>
        </div>

        {/* Badge List Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {CORE_BADGE_LIST.map((badge) => {
            const earned = earnedMap.get(badge.id);
            const isUnlocked = !!earned;

            return (
              <div
                key={badge.id}
                style={{
                  display: 'flex',
                  gap: '1.2rem',
                  padding: '1.25rem',
                  borderRadius: '18px',
                  background: isUnlocked
                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isUnlocked
                    ? `1px solid ${badge.color}55`
                    : '1px solid rgba(255, 255, 255, 0.06)',
                  boxShadow: isUnlocked
                    ? `0 4px 20px ${badge.color}15`
                    : 'none',
                  opacity: isUnlocked ? 1 : 0.75,
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
              >
                {/* Badge Icon */}
                <div style={{ position: 'relative' }}>
                  <BadgeIcon badgeId={badge.id} size={74} glow={isUnlocked} />
                  {!isUnlocked && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.55)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Lock size={22} color="rgba(255, 255, 255, 0.7)" />
                    </div>
                  )}
                </div>

                {/* Badge Information matching screenshot layout */}
                <div style={{ flex: 1 }}>
                  {/* Badge Name and Title */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', margin: 0 }}>
                      {badge.orderNumber}. {badge.name}
                    </h4>

                    {isUnlocked ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.78rem', fontWeight: 800 }}>
                        <CheckCircle2 size={15} /> UNLOCKED
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 700 }}>
                        <Lock size={13} /> LOCKED
                      </div>
                    )}
                  </div>

                  {/* Category Tag pill */}
                  <div style={{ marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '10px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: `${badge.tagColor}22`,
                        color: badge.tagColor,
                        border: `1px solid ${badge.tagColor}44`,
                      }}
                    >
                      {badge.category}
                    </span>
                  </div>

                  {/* Unlock Condition */}
                  <div style={{ fontSize: '0.86rem', color: 'white', marginBottom: '0.3rem' }}>
                    <strong style={{ color: '#e2e8f0' }}>Unlock condition: </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{badge.unlockCondition}</span>
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: isUnlocked ? '0.5rem' : 0 }}>
                    <strong style={{ color: 'var(--text-secondary)' }}>Description: </strong>
                    {badge.description}
                  </div>

                  {/* Date Earned & Verification Meta */}
                  {isUnlocked && earned && (
                    <div
                      style={{
                        marginTop: '0.5rem',
                        paddingTop: '0.4rem',
                        borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <span>
                        Earned in <strong>{earned.gameTitle}</strong> on {earned.displayDate} ({earned.accuracyPercent}% accuracy)
                      </span>

                      <span style={{ color: earned.isSynced ? '#38bdf8' : '#a855f7', fontWeight: 700 }}>
                        {earned.isSynced ? '☁️ Cloud Synced' : '📱 Device Local'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Never awarded solely for opening or attempting a quiz. Deterministically verified upon completion.
          </div>

          <button className="btn btn-primary" onClick={onClose}>
            Close Showcase
          </button>
        </div>
      </div>
    </div>
  );
};

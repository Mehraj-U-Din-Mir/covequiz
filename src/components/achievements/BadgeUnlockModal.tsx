import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { EarnedBadgeRecord } from '../../types/achievement';
import { CORE_BADGES } from '../../data/achievementBadges';
import { BadgeIcon } from './BadgeIcon';
import { soundManager } from '../../audio/soundEffects';
import { Sparkles, Trophy, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';

interface BadgeUnlockModalProps {
  newlyEarnedBadges: EarnedBadgeRecord[];
  onClose: () => void;
  onOpenShowcase?: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  newlyEarnedBadges,
  onClose,
  onOpenShowcase,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (newlyEarnedBadges.length > 0) {
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.5 },
        });
      } catch {
        // Fallback
      }
    }
  }, [newlyEarnedBadges]);

  if (!newlyEarnedBadges || newlyEarnedBadges.length === 0) return null;

  const currentEarned = newlyEarnedBadges[currentIndex];
  const badgeDef = CORE_BADGES[currentEarned.badgeId];
  const hasMultiple = newlyEarnedBadges.length > 1;

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex + 1 < newlyEarnedBadges.length) {
      setCurrentIndex((i) => i + 1);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
      } catch {}
    } else {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: '520px',
          width: '92%',
          textAlign: 'center',
          padding: '2rem 1.5rem',
          position: 'relative',
          background: 'linear-gradient(180deg, #131d36 0%, #0a0f1d 100%)',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.2)',
          borderRadius: '24px',
          animation: 'modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close icon */}
        <button
          className="btn-icon"
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px' }}
        >
          <X size={18} />
        </button>

        {/* Top Header Tag */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', borderRadius: '20px', background: 'rgba(255, 215, 0, 0.15)', border: '1px solid rgba(255, 215, 0, 0.3)', marginBottom: '1.2rem' }}>
          <Sparkles size={15} color="#fbbf24" />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {hasMultiple ? `Achievement Unlocked (${currentIndex + 1} of ${newlyEarnedBadges.length})` : 'New Achievement Unlocked!'}
          </span>
        </div>

        {/* Radiant Badge Display */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.4rem' }}>
          <div style={{ position: 'relative' }}>
            {/* Glowing Aura Ring */}
            <div
              style={{
                position: 'absolute',
                inset: '-15px',
                borderRadius: '30px',
                background: badgeDef ? badgeDef.color : '#38bdf8',
                opacity: 0.25,
                filter: 'blur(20px)',
                zIndex: 0,
              }}
            />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <BadgeIcon badgeId={currentEarned.badgeId} size={110} glow={true} />
            </div>
          </div>
        </div>

        {/* Badge Title & Number */}
        <div style={{ marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', margin: 0 }}>
            {badgeDef ? `${badgeDef.orderNumber}. ${badgeDef.name}` : currentEarned.badgeName}
          </h2>
        </div>

        {/* Category Pill Tag */}
        <div style={{ marginBottom: '1rem' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 800,
              background: badgeDef ? `${badgeDef.tagColor}22` : 'rgba(16, 185, 129, 0.15)',
              color: badgeDef ? badgeDef.tagColor : '#10b981',
              border: `1px solid ${badgeDef ? badgeDef.tagColor : '#10b981'}44`,
            }}
          >
            {badgeDef?.category || 'Accuracy'}
          </span>
        </div>

        {/* Achievement Description Box */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            marginBottom: '1.25rem',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.2rem' }}>
            UNLOCK CONDITION
          </div>
          <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600, marginBottom: '0.6rem' }}>
            {badgeDef?.unlockCondition}
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.2rem' }}>
            DESCRIPTION
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {badgeDef?.description}
          </div>
        </div>

        {/* Date Earned & Storage Details */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
            padding: '0 0.4rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={14} color="#10b981" />
            <span>Earned: {currentEarned.displayDate}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={14} color="#38bdf8" />
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>
              {currentEarned.isSynced ? 'Cloud Synced' : 'Device Local Profile'}
            </span>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
          {onOpenShowcase && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onOpenShowcase();
              }}
            >
              <Trophy size={16} /> View All Badges
            </button>
          )}

          <button className="btn btn-primary btn-lg" onClick={handleNext}>
            {currentIndex + 1 < newlyEarnedBadges.length ? (
              <>
                Next Unlocked Badge <ArrowRight size={18} />
              </>
            ) : (
              'Collect Badge & Continue'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

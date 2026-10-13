import React, { useState } from 'react';
import { SIGNATURE_THINKING_STAGES, getThinkingPromptsForQuestion } from '../../engine/signatureThinking';
import { soundManager } from '../../audio/soundEffects';
import { Brain, ChevronRight, CheckCircle2, Lightbulb } from 'lucide-react';

interface ThinkingEngineDrawerProps {
  level: number;
  topic: string;
  questionPrompt: string;
}

export const ThinkingEngineDrawer: React.FC<ThinkingEngineDrawerProps> = ({
  level,
  topic,
  questionPrompt,
}) => {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const prompts = getThinkingPromptsForQuestion(level, topic, questionPrompt, 'the correct mathematical answer');
  const activeStage = SIGNATURE_THINKING_STAGES[activeStageIndex];

  const handleNextStage = () => {
    soundManager.playClick();
    setActiveStageIndex((prev) => (prev + 1) % SIGNATURE_THINKING_STAGES.length);
  };

  return (
    <div style={{ marginTop: '1.25rem', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      {/* Header bar toggle */}
      <div
        onClick={() => {
          soundManager.playClick();
          setIsOpen(!isOpen);
        }}
        style={{
          padding: '0.75rem 1rem',
          background: 'rgba(99, 102, 241, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Brain size={18} color="#8b5cf6" />
          <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Signature 6-Stage Thinking Engine</span>
          <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>Mastery Method</span>
        </div>
        <span style={{ fontSize: '0.82rem', color: '#8b5cf6', fontWeight: 600 }}>
          {isOpen ? 'Collapse' : 'Explore Steps'}
        </span>
      </div>

      {/* Expanded body */}
      {isOpen && (
        <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.02)' }}>
          {/* Stage pills */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', marginBottom: '1rem', paddingBottom: '0.3rem' }}>
            {SIGNATURE_THINKING_STAGES.map((stg, idx) => {
              const isCurrent = idx === activeStageIndex;
              return (
                <button
                  key={stg.id}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveStageIndex(idx);
                  }}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    background: isCurrent ? stg.badgeColor : 'rgba(255, 255, 255, 0.05)',
                    color: isCurrent ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>{stg.icon}</span>
                  <span>{stg.title.split('. ')[1]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Stage Card */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(0, 0, 0, 0.25)',
              borderLeft: `4px solid ${activeStage.badgeColor}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem' }}>{activeStage.icon}</span>
              <h4 style={{ fontSize: '1rem', color: activeStage.badgeColor }}>{activeStage.title}</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.6rem' }}>
              {activeStage.questionPrompt}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>
              <Lightbulb size={16} color="#f59e0b" />
              <span>{prompts[activeStage.id] || prompts.understand}</span>
            </div>

            <div style={{ marginTop: '0.8rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleNextStage} style={{ gap: '0.3rem' }}>
                Next Strategy Step <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

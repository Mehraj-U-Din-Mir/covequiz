import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameDefinition, QuestionData } from '../../types/game';
import { generateQuestionForGame } from '../../engine/questionGenerators';
import { calculateDifficultyDistribution } from '../../engine/questionCountDistributor';
import { usePlayer } from '../../context/PlayerContext';
import { soundManager } from '../../audio/soundEffects';
import { NumberLineGame } from '../interactive/NumberLineGame';
import { BalanceScaleGame } from '../interactive/BalanceScaleGame';
import { FractionVisualizer } from '../interactive/FractionVisualizer';
import { GeometryVisualizer } from '../interactive/GeometryVisualizer';
import { ItemCollectionVisualizer } from '../interactive/ItemCollectionVisualizer';
import { RainbowBondVisualizer } from '../interactive/RainbowBondVisualizer';
import { BaseTenBlocksVisualizer } from '../interactive/BaseTenBlocksVisualizer';
import { MoneyVisualizer } from '../interactive/MoneyVisualizer';
import { ThinkingEngineDrawer } from './ThinkingEngineDrawer';
import { EarnedBadgeRecord } from '../../types/achievement';
import { BadgeUnlockModal } from '../achievements/BadgeUnlockModal';
import {
  X,
  HelpCircle,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Bot,
  Play,
  Zap,
  Award
} from 'lucide-react';

interface GamePlayModalProps {
  game: GameDefinition;
  onClose: () => void;
  onOpenAiCoach?: (context: { question: string; level: number; userAns?: string }) => void;
}

export const GamePlayModal: React.FC<GamePlayModalProps> = ({ game, onClose, onOpenAiCoach }) => {
  const { recordGameResult, evaluateAndAwardBadges } = usePlayer();
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<EarnedBadgeRecord[]>([]);

  // Configuration Dialog State
  const [isConfiguring, setIsConfiguring] = useState<boolean>(true);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [customInput, setCustomInput] = useState<string>('10');

  // Gameplay State
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [sessionStreak, setSessionStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [hintTierUnlocked, setHintTierUnlocked] = useState<number>(0); // 0, 1, 2, 3
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const distribution = calculateDifficultyDistribution(questionCount);

  // Helper to determine difficulty for a specific round
  const getDifficultyForRound = (roundNum: number): 1 | 2 | 3 => {
    if (roundNum <= distribution.easyCount) return 1;
    if (roundNum <= distribution.easyCount + distribution.intermediateCount) return 2;
    return 3;
  };

  // Generate question when round changes after game has started
  useEffect(() => {
    if (isConfiguring) return;

    const diff = getDifficultyForRound(currentRound);
    setCurrentQuestion(generateQuestionForGame(game.id, diff));
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setHintTierUnlocked(0);
  }, [currentRound, isConfiguring, game.id]);

  const handleSelectPreset = (preset: number) => {
    soundManager.playClick();
    setQuestionCount(preset);
    setCustomInput(String(preset));
  };

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 3 && num <= 100) {
      setQuestionCount(num);
    }
  };

  const handleStartQuest = () => {
    soundManager.playCorrect();
    setIsConfiguring(false);
    setCurrentRound(1);
    setScore(0);
    setSessionStreak(0);
    setCorrectCount(0);
    setIsCompleted(false);

    const diff = getDifficultyForRound(1);
    setCurrentQuestion(generateQuestionForGame(game.id, diff));
  };

  const handleSelectOption = (opt: string | number) => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setSelectedAnswer(opt);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || isAnswerSubmitted || !currentQuestion) return;

    const correctStr = String(currentQuestion.correctAnswer).trim().toLowerCase();
    const chosenStr = String(selectedAnswer).trim().toLowerCase();
    const correct = chosenStr === correctStr;

    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      soundManager.playCorrect();
      const points = 100 + sessionStreak * 25 - hintTierUnlocked * 15;
      setScore((s) => s + Math.max(30, points));
      setSessionStreak((str) => str + 1);
      setCorrectCount((c) => c + 1);
      soundManager.playStreak(sessionStreak + 1);
    } else {
      soundManager.playIncorrect();
      setSessionStreak(0);
    }
  };

  const handleNextRound = () => {
    soundManager.playClick();
    if (currentRound < questionCount) {
      setCurrentRound((r) => r + 1);
    } else {
      // Completed all requested questions
      setIsCompleted(true);
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }

      const accuracy = Math.round((correctCount / questionCount) * 100);
      const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;
      recordGameResult(game.id, score, stars);

      // Deterministically evaluate badges immediately upon quiz completion
      const newlyEarned = evaluateAndAwardBadges({
        gameId: game.id,
        gameTitle: game.title,
        level: game.level,
        totalQuestions: questionCount,
        attemptedQuestions: questionCount,
        correctAnswers: correctCount,
        accuracyPercent: accuracy,
        hasIntermediate: distribution.intermediateCount > 0,
        hasAdvanced: distribution.advancedCount > 0,
        completed: true,
        timestamp: new Date().toISOString(),
      });

      if (newlyEarned && newlyEarned.length > 0) {
        setNewlyUnlockedBadges(newlyEarned);
      }
    }
  };

  const handleUnlockHint = () => {
    if (hintTierUnlocked < 3) {
      soundManager.playHint();
      setHintTierUnlocked((t) => t + 1);
    }
  };

  const handleReplay = () => {
    soundManager.playClick();
    setIsConfiguring(true);
    setIsCompleted(false);
  };

  // Keyboard navigation: 1-4 to pick options, Enter to Check Answer or Next Round
  useEffect(() => {
    if (isConfiguring || isCompleted || !currentQuestion) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isAnswerSubmitted) {
          if (selectedAnswer !== null) {
            handleSubmitAnswer();
          }
        } else {
          handleNextRound();
        }
      } else if (['1', '2', '3', '4'].includes(e.key) && !isAnswerSubmitted) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentQuestion.options && currentQuestion.options[idx] !== undefined) {
          handleSelectOption(currentQuestion.options[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConfiguring, isCompleted, isAnswerSubmitted, selectedAnswer, currentQuestion]);

  const currentDiff = getDifficultyForRound(currentRound);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          maxWidth: isConfiguring ? '620px' : '820px',
          width: '100%',
          overflowX: 'hidden',
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #6366f1 0%, #38bdf8 50%, #a855f7 100%)',
            width: '100%',
          }}
        />

        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-blue">Level {game.level}</span>
              <span className="badge badge-purple">{game.domain}</span>
              {!isConfiguring && !isCompleted && (
                <span
                  className={`badge ${
                    currentDiff === 1 ? 'badge-green' : currentDiff === 2 ? 'badge-blue' : 'badge-purple'
                  }`}
                >
                  {currentDiff === 1 ? 'EASY' : currentDiff === 2 ? 'INTERMEDIATE' : 'ADVANCED'}
                </span>
              )}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem' }}>{game.title}</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {!isConfiguring && !isCompleted && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>SCORE</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                  {score}
                </div>
              </div>
            )}

            {!isConfiguring && sessionStreak > 1 && (
              <div className="badge badge-amber">
                <Flame size={14} /> {sessionStreak} Streak
              </div>
            )}

            <button className="btn-icon" onClick={onClose} title="Exit Quest">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* 1. CONFIGURATION DIALOG */}
          {isConfiguring ? (
            <div>
              {/* Learning Objective Card */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                  Curriculum Competency: {game.nepCompetencyCode}
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {game.learningObjective}
                </p>
              </div>

              {/* Question Count Selection Dialog Box */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: 'rgba(56, 189, 248, 0.05)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'white' }}>
                    SELECT NUMBER OF CHALLENGES
                  </label>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                    {questionCount} Questions
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                  Choose your session length. Difficulty dynamically advances from Easy to Intermediate to Advanced!
                </p>

                {/* Preset Buttons */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                  {[10, 15, 20, 25, 30, 35, 40, 45, 50].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`btn btn-sm ${questionCount === preset ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleSelectPreset(preset)}
                      style={{ minWidth: '45px' }}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Or custom count (3–100):</span>
                  <input
                    type="number"
                    min={3}
                    max={100}
                    value={customInput}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    style={{
                      width: '80px',
                      padding: '0.4rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid var(--border-subtle)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Difficulty Breakdown Preview */}
              <div
                style={{
                  padding: '0.8rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed var(--border-subtle)',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  PROGRESSION PREVIEW
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-green">
                    Easy: {distribution.easyCount} Qs (Q1–{distribution.easyCount})
                  </span>
                  <span className="badge badge-blue">
                    Intermediate: {distribution.intermediateCount} Qs (Q{distribution.easyCount + 1}–{distribution.easyCount + distribution.intermediateCount})
                  </span>
                  <span className="badge badge-purple">
                    Advanced: {distribution.advancedCount} Qs (Q{distribution.easyCount + distribution.intermediateCount + 1}–{questionCount})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                <button className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleStartQuest}>
                  <Play size={18} fill="white" /> Begin Quest ({questionCount} Qs)
                </button>
              </div>
            </div>
          ) : !isCompleted && currentQuestion ? (
            /* 2. GAMEPLAY VIEW */
            <div>
              {/* Question Progress Tracker */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  Challenge {currentRound} of {questionCount}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {Math.round(((currentRound) / questionCount) * 100)}% Complete
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: `${((currentRound) / questionCount) * 100}%`,
                    height: '100%',
                    background: 'var(--grad-primary)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              {/* Challenge Prompt */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                }}
              >
                <h3 style={{ fontSize: '1.3rem', color: 'white', fontWeight: 800, textAlign: 'center' }}>
                  {currentQuestion.prompt}
                </h3>
              </div>

              {/* Interactive Mathematical Visualizers */}
              {currentQuestion.visualData && (
                <div style={{ marginBottom: '1.25rem' }}>
                  {currentQuestion.visualData.type === 'item_collection' && (
                    <ItemCollectionVisualizer
                      count={currentQuestion.visualData.count}
                      item={currentQuestion.visualData.item}
                      onSelectAnswer={(val: number) => {
                        setSelectedAnswer(val);
                      }}
                      selectedAnswer={selectedAnswer}
                      isAnswerSubmitted={isAnswerSubmitted}
                      correctAnswer={Number(currentQuestion.correctAnswer)}
                    />
                  )}

                  {currentQuestion.visualData.type === 'rainbow_bond' && (
                    <RainbowBondVisualizer
                      given={currentQuestion.visualData.given}
                      target={currentQuestion.visualData.target}
                    />
                  )}

                  {currentQuestion.visualData.type === 'base_10_blocks' && (
                    <BaseTenBlocksVisualizer
                      tens={currentQuestion.visualData.tens}
                      ones={currentQuestion.visualData.ones}
                    />
                  )}

                  {currentQuestion.visualData.type === 'money' && (
                    <MoneyVisualizer
                      price={currentQuestion.visualData.price}
                      paid={currentQuestion.visualData.paid}
                    />
                  )}

                  {currentQuestion.visualData.type === 'number_line' && (
                    <NumberLineGame
                      start={currentQuestion.visualData.start}
                      range={currentQuestion.visualData.range}
                      onSelectTick={(val: number) => {
                        setSelectedAnswer(val);
                      }}
                    />
                  )}

                  {currentQuestion.visualData.type === 'balance_scale' && (
                    <BalanceScaleGame
                      left={currentQuestion.visualData.left}
                      right={currentQuestion.visualData.right}
                    />
                  )}

                  {currentQuestion.visualData.type === 'fraction_circle' && (
                    <FractionVisualizer
                      numerator={currentQuestion.visualData.numerator}
                      denominator={currentQuestion.visualData.denominator}
                    />
                  )}

                  {(currentQuestion.visualData.type === 'rectangle' ||
                    currentQuestion.visualData.type === 'right_triangle' ||
                    currentQuestion.visualData.type === 'angle') && (
                    <GeometryVisualizer
                      data={currentQuestion.visualData}
                    />
                  )}
                </div>
              )}

              {/* Multiple Choice Options Grid */}
              <div className="options-grid">
                {(currentQuestion.options || []).map((opt, i) => {
                  let statusClass = '';
                  if (isAnswerSubmitted) {
                    if (String(opt).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase()) {
                      statusClass = 'correct';
                    } else if (opt === selectedAnswer) {
                      statusClass = 'incorrect';
                    }
                  } else if (selectedAnswer === opt) {
                    statusClass = 'selected';
                  }

                  return (
                    <button
                      key={i}
                      className={`option-tile ${statusClass}`}
                      onClick={() => handleSelectOption(opt)}
                      onDoubleClick={() => {
                        if (!isAnswerSubmitted) {
                          handleSelectOption(opt);
                          setTimeout(() => handleSubmitAnswer(), 50);
                        }
                      }}
                      disabled={isAnswerSubmitted}
                      style={{ position: 'relative' }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '10px',
                          fontSize: '0.68rem',
                          color: selectedAnswer === opt ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-muted)',
                          fontWeight: 700,
                        }}
                      >
                        [{i + 1}]
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Answer Verification Feedback Card */}
              {isAnswerSubmitted && (
                <div
                  style={{
                    marginBottom: '1.25rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                    border: `2px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                    boxShadow: isCorrect ? '0 0 25px rgba(16, 185, 129, 0.25)' : '0 0 25px rgba(239, 68, 68, 0.25)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {isCorrect ? <CheckCircle2 size={24} color="#10b981" /> : <AlertCircle size={24} color="#ef4444" />}
                      <div>
                        <strong style={{ fontSize: '1.15rem', color: isCorrect ? '#34d399' : '#f87171' }}>
                          {isCorrect ? '✅ Brilliant! Correct Answer!' : `❌ Correct Solution: ${currentQuestion.correctAnswer}`}
                        </strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {isCorrect ? `You selected "${selectedAnswer}" which is 100% correct!` : `You selected "${selectedAnswer}". Check the steps below:`}
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-primary btn-md" onClick={handleNextRound} style={{ boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>
                      {currentRound < questionCount ? 'Next Question' : 'View Results'} <ArrowRight size={16} />
                    </button>
                  </div>

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.6rem', lineHeight: 1.5 }}>
                    {currentQuestion.explanation}
                  </p>

                  {currentQuestion.workedSolution && (
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '0.6rem' }}>
                      <strong style={{ color: '#38bdf8' }}>Verification Tip:</strong> {currentQuestion.workedSolution.verificationTip}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', flexWrap: 'wrap', gap: '0.6rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleUnlockHint}
                    disabled={hintTierUnlocked >= 3 || isAnswerSubmitted}
                  >
                    <HelpCircle size={15} />
                    {hintTierUnlocked === 0 ? 'Need a Hint?' : `Hint (${hintTierUnlocked}/3)`}
                  </button>

                  {onOpenAiCoach && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        onOpenAiCoach({
                          question: currentQuestion.prompt,
                          level: game.level,
                          userAns: selectedAnswer ? String(selectedAnswer) : undefined,
                        })
                      }
                    >
                      <Bot size={15} color="#38bdf8" /> AI Coach
                    </button>
                  )}
                </div>

                {!isAnswerSubmitted ? (
                  <button
                    className="btn btn-primary btn-lg"
                    disabled={selectedAnswer === null}
                    onClick={handleSubmitAnswer}
                    style={{
                      boxShadow: selectedAnswer !== null ? '0 0 20px rgba(56, 189, 248, 0.4)' : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <CheckCircle2 size={18} />
                    {selectedAnswer === null ? 'Select an Option to Check' : `Check Answer: "${selectedAnswer}"`}
                  </button>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={handleNextRound}>
                    {currentRound < questionCount ? 'Next Question' : 'Complete Quest'} <ArrowRight size={18} />
                  </button>
                )}
              </div>

              {/* 3-Tier Mathematical Hints Drawer */}
              {hintTierUnlocked > 0 && (
                <div className="hint-ladder" style={{ marginTop: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                    Mathematical Scaffold
                  </div>
                  {Array.from({ length: hintTierUnlocked }).map((_, idx) => (
                    <div key={idx} className="hint-step">
                      <span style={{ fontWeight: 800, color: '#38bdf8' }}>Tier {idx + 1}:</span>
                      <span>{currentQuestion.hints[idx]}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Signature 6-Stage Thinking Engine */}
              <ThinkingEngineDrawer
                level={game.level}
                topic={game.domain}
                questionPrompt={currentQuestion.prompt}
              />
            </div>
          ) : (
            /* 3. CELEBRATION SUMMARY VIEW */
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Quest Completed!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                You conquered all {questionCount} challenges in {game.title}!
              </p>

              {/* Score & Stars */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '0.8rem',
                  maxWidth: '550px',
                  margin: '0 auto 1.5rem auto',
                }}
              >
                <div className="glass-panel" style={{ padding: '0.8rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FINAL SCORE</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                    {score}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '0.8rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ACCURACY</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#10b981' }}>
                    {Math.round((correctCount / questionCount) * 100)}%
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '0.8rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CORRECT</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
                    {correctCount}/{questionCount}
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '0.8rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>MASTERY STARS</div>
                  <div style={{ fontSize: '1.6rem', color: '#f59e0b' }}>
                    {Math.round((correctCount / questionCount) * 100) >= 80 ? '★★★' : Math.round((correctCount / questionCount) * 100) >= 50 ? '★★☆' : '★☆☆'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
                <button className="btn btn-secondary" onClick={handleReplay}>
                  <RotateCcw size={16} /> Choose Count & Play Again
                </button>
                <button className="btn btn-primary" onClick={onClose}>
                  Back to Quests
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated Badge Unlock Celebration Modal */}
      {newlyUnlockedBadges.length > 0 && (
        <BadgeUnlockModal
          newlyEarnedBadges={newlyUnlockedBadges}
          onClose={() => setNewlyUnlockedBadges([])}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GuiGameDefinition, SessionConfig, GuiQuestion, GuiGameSessionStats, StageDifficultyCategory } from '../../types/guiGame';
import { generateGuiQuestion } from '../../engine/guiQuestionGenerators';
import { getDifficultyForQuestionIndex } from '../../engine/questionCountDistributor';
import { soundManager } from '../../audio/soundEffects';
import { GuiGameRenderer } from './GuiGameRenderer';
import { usePlayer } from '../../context/PlayerContext';
import { EarnedBadgeRecord } from '../../types/achievement';
import { BadgeUnlockModal } from '../achievements/BadgeUnlockModal';
import {
  X,
  Pause,
  Play,
  RotateCcw,
  HelpCircle,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  Bot,
  Users,
  User,
  Crown,
  Swords,
  Zap,
  ShieldAlert
} from 'lucide-react';

interface GuiGameArenaProps {
  game: GuiGameDefinition;
  config: SessionConfig;
  onExit: () => void;
  onOpenAiCoach?: (context: { question: string; level: number; userAns?: string }) => void;
}

const P1_HOTKEYS = ['Q', 'W', 'A', 'S'];
const P2_HOTKEYS = ['U', 'I', 'J', 'K'];

export const GuiGameArena: React.FC<GuiGameArenaProps> = ({
  game,
  config,
  onExit,
  onOpenAiCoach,
}) => {
  const is2Player = !!config.isTwoPlayerMode;
  const { evaluateAndAwardBadges } = usePlayer();
  const [newlyUnlockedBadges, setNewlyUnlockedBadges] = useState<EarnedBadgeRecord[]>([]);

  // Round / Question state
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 0 to config.questionCount - 1
  const [currentQuestion, setCurrentQuestion] = useState<GuiQuestion | null>(null);
  const [hintTierUnlocked, setHintTierUnlocked] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Player 1 (Blue Titans) State
  const [p1Answer, setP1Answer] = useState<string | number | null>(null);
  const [p1Submitted, setP1Submitted] = useState<boolean>(false);
  const [p1IsCorrect, setP1IsCorrect] = useState<boolean>(false);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p1Streak, setP1Streak] = useState<number>(0);
  const [p1CorrectCount, setP1CorrectCount] = useState<number>(0);
  const [p1Stories, setP1Stories] = useState<number>(1);
  const [p1Fuel, setP1Fuel] = useState<number>(20);
  const [p1RacePos, setP1RacePos] = useState<number>(20);

  // Player 2 (Ruby Falcons / AI Math Rival) State
  const [p2Answer, setP2Answer] = useState<string | number | null>(null);
  const [p2Submitted, setP2Submitted] = useState<boolean>(false);
  const [p2IsCorrect, setP2IsCorrect] = useState<boolean>(false);
  const [p2Score, setP2Score] = useState<number>(0);
  const [p2Streak, setP2Streak] = useState<number>(0);
  const [p2CorrectCount, setP2CorrectCount] = useState<number>(0);
  const [p2Stories, setP2Stories] = useState<number>(1);
  const [p2Fuel, setP2Fuel] = useState<number>(20);
  const [p2RacePos, setP2RacePos] = useState<number>(20);

  // War Dynamics
  const [ropePosition, setRopePosition] = useState<number>(50); // 15..85 (lower = P1 advantage, higher = P2 advantage)
  const [firstStrikePlayer, setFirstStrikePlayer] = useState<1 | 2 | null>(null);
  const [lastActionMessage, setLastActionMessage] = useState<string>('⚔️ WAR IN PROGRESS: Fastest accurate student wins the frontline!');

  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Session Statistics tracking
  const [stats, setStats] = useState<GuiGameSessionStats>({
    requestedQuestions: config.questionCount,
    attemptedQuestions: 0,
    correctAnswers: 0,
    accuracyPercent: 0,
    hintsUsed: 0,
    totalScore: 0,
    timeSpentSeconds: 0,
    difficultyBreakdown: {
      easy: { total: 0, correct: 0 },
      intermediate: { total: 0, correct: 0 },
      advanced: { total: 0, correct: 0 },
    },
    skillsPracticed: [],
  });

  // Load question for current index & reset round states
  useEffect(() => {
    let diff: StageDifficultyCategory = 'easy';
    let stageNum = 1;

    if (config.mode === 'quick_challenge') {
      diff = getDifficultyForQuestionIndex(currentIndex, config.questionCount);
      stageNum = diff === 'easy' ? 3 : diff === 'intermediate' ? 15 : 25;
    } else {
      stageNum = config.selectedStageNumber || 1;
      diff = stageNum <= 10 ? 'easy' : stageNum <= 20 ? 'intermediate' : 'advanced';
    }

    const q = generateGuiQuestion(game.gameType, game.level, diff, stageNum);
    setCurrentQuestion(q);

    // Reset round states
    setP1Answer(null);
    setP1Submitted(false);
    setP1IsCorrect(false);

    setP2Answer(null);
    setP2Submitted(false);
    setP2IsCorrect(false);

    setFirstStrikePlayer(null);
    setHintTierUnlocked(0);
    setLastActionMessage('⚔️ ROUND ACTIVE: Same challenge on both sides! Strike fast!');

    // In Solo mode: Schedule AI Math Rival move with simulated thinking time
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    if (!is2Player && q) {
      const thinkingDelay =
        diff === 'easy'
          ? Math.floor(Math.random() * 2000) + 4200
          : diff === 'intermediate'
          ? Math.floor(Math.random() * 2500) + 5200
          : Math.floor(Math.random() * 3000) + 6500;

      aiTimerRef.current = setTimeout(() => {
        // AI chooses answer: 85% correct, 15% random distractor
        const willBeCorrect = Math.random() < 0.85;
        let chosen: string | number = q.correctAnswer;
        if (!willBeCorrect) {
          const wrongOpts = q.options.filter(
            (o) => String(o).trim().toLowerCase() !== String(q.correctAnswer).trim().toLowerCase()
          );
          if (wrongOpts.length > 0) {
            chosen = wrongOpts[Math.floor(Math.random() * wrongOpts.length)];
          }
        }
        executeP2Answer(chosen, q);
      }, thinkingDelay);
    }

    return () => {
      if (aiTimerRef.current) {
        clearTimeout(aiTimerRef.current);
        aiTimerRef.current = null;
      }
    };
  }, [currentIndex, config, game, is2Player]);

  // Handle Player 1 Answer
  const handleP1Answer = (opt: string | number) => {
    if (p1Submitted || isPaused || !currentQuestion) return;
    executeP1Answer(opt, currentQuestion);
  };

  const executeP1Answer = (opt: string | number, question: GuiQuestion) => {
    soundManager.playClick();
    setP1Answer(opt);
    setP1Submitted(true);

    const isAnsCorrect = String(opt).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
    setP1IsCorrect(isAnsCorrect);

    const isFirstStrike = isAnsCorrect && !p2Submitted;
    if (isFirstStrike) {
      setFirstStrikePlayer(1);
    }

    const diff = question.difficulty;
    const basePoints = diff === 'easy' ? 100 : diff === 'intermediate' ? 150 : 200;
    const firstStrikeBonus = isFirstStrike ? 50 : 0;
    const streakBonus = p1Streak * 25;
    const awarded = isAnsCorrect ? basePoints + streakBonus + firstStrikeBonus : 0;

    if (isAnsCorrect) {
      soundManager.playCorrect();
      setP1Score((s) => s + awarded);
      setP1Streak((st) => st + 1);
      setP1CorrectCount((c) => c + 1);
      soundManager.playStreak(p1Streak + 1);

      // Battle visual updates for P1
      setP1Stories((t) => t + 1);
      setP1Fuel((f) => Math.min(100, f + 20));
      setP1RacePos((r) => Math.min(88, r + 15));
      setRopePosition((pos) => Math.max(15, pos - 12));

      setLastActionMessage(
        isFirstStrike
          ? '⚡ FIRST STRIKE! Player 1 (Blue Titans) attacked first (+50 Bonus)!'
          : '🎯 Player 1 fortified their citadel with a direct hit!'
      );
    } else {
      soundManager.playIncorrect();
      setP1Streak(0);
      setLastActionMessage('❌ Player 1 missed! Territory opened for Ruby Falcons!');
    }

    // Cumulative session stats tracking
    setStats((prev) => {
      const attempted = prev.attemptedQuestions + 1;
      const totalCorr = prev.correctAnswers + (isAnsCorrect ? 1 : 0);
      const acc = Math.round((totalCorr / attempted) * 100);

      const diffRecord = { ...prev.difficultyBreakdown };
      diffRecord[diff].total += 1;
      if (isAnsCorrect) diffRecord[diff].correct += 1;

      return {
        ...prev,
        attemptedQuestions: attempted,
        correctAnswers: totalCorr,
        accuracyPercent: acc,
        hintsUsed: prev.hintsUsed + hintTierUnlocked,
        totalScore: prev.totalScore + awarded,
        difficultyBreakdown: diffRecord,
      };
    });
  };

  // Handle Player 2 Answer (or AI Rival move)
  const handleP2Answer = (opt: string | number) => {
    if (p2Submitted || isPaused || !currentQuestion) return;
    executeP2Answer(opt, currentQuestion);
  };

  const executeP2Answer = (opt: string | number, question: GuiQuestion) => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }

    soundManager.playClick();
    setP2Answer(opt);
    setP2Submitted(true);

    const isAnsCorrect = String(opt).trim().toLowerCase() === String(question.correctAnswer).trim().toLowerCase();
    setP2IsCorrect(isAnsCorrect);

    const isFirstStrike = isAnsCorrect && !p1Submitted;
    if (isFirstStrike) {
      setFirstStrikePlayer(2);
    }

    const diff = question.difficulty;
    const basePoints = diff === 'easy' ? 100 : diff === 'intermediate' ? 150 : 200;
    const firstStrikeBonus = isFirstStrike ? 50 : 0;
    const streakBonus = p2Streak * 25;
    const awarded = isAnsCorrect ? basePoints + streakBonus + firstStrikeBonus : 0;

    if (isAnsCorrect) {
      soundManager.playCorrect();
      setP2Score((s) => s + awarded);
      setP2Streak((st) => st + 1);
      setP2CorrectCount((c) => c + 1);
      soundManager.playStreak(p2Streak + 1);

      // Battle visual updates for P2
      setP2Stories((t) => t + 1);
      setP2Fuel((f) => Math.min(100, f + 20));
      setP2RacePos((r) => Math.min(88, r + 15));
      setRopePosition((pos) => Math.min(85, pos + 12));

      setLastActionMessage(
        isFirstStrike
          ? '🔥 FIRST STRIKE! Player 2 (Ruby Falcons) attacked first (+50 Bonus)!'
          : '🎯 Player 2 fortified their citadel with a direct hit!'
      );
    } else {
      soundManager.playIncorrect();
      setP2Streak(0);
      setLastActionMessage('❌ Player 2 missed! Blue Titans hold the line!');
    }
  };

  // Move to next challenge
  const handleNextQuestion = () => {
    if (aiTimerRef.current) {
      clearTimeout(aiTimerRef.current);
      aiTimerRef.current = null;
    }
    soundManager.playClick();

    if (currentIndex + 1 < config.questionCount) {
      setCurrentIndex((idx) => idx + 1);
    } else {
      // Completed full battle session
      setIsCompleted(true);
      soundManager.playVictory();
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }

      // Automatically evaluate badges for completed GUI game session
      const hasInter = stats.difficultyBreakdown.intermediate.total > 0;
      const hasAdv = stats.difficultyBreakdown.advanced.total > 0;

      const newlyEarned = evaluateAndAwardBadges({
        gameId: game.id,
        gameTitle: game.title,
        level: game.level,
        totalQuestions: config.questionCount,
        attemptedQuestions: config.questionCount,
        correctAnswers: stats.correctAnswers,
        accuracyPercent: stats.accuracyPercent,
        hasIntermediate: hasInter,
        hasAdvanced: hasAdv,
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

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentIndex(0);
    setP1Score(0);
    setP2Score(0);
    setP1Streak(0);
    setP2Streak(0);
    setP1CorrectCount(0);
    setP2CorrectCount(0);
    setP1Stories(1);
    setP2Stories(1);
    setP1Fuel(20);
    setP2Fuel(20);
    setP1RacePos(20);
    setP2RacePos(20);
    setRopePosition(50);
    setFirstStrikePlayer(null);
    setIsCompleted(false);
  };

  // Simultaneous Dual-Keyboard listener (P1: Q, W, A, S; P2: U, I, J, K; Space/Enter: Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isCompleted) return;

      // Space or Enter advances to next challenge when round is decided
      if ((p1Submitted || p2Submitted) && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        handleNextQuestion();
        return;
      }

      if (!currentQuestion) return;
      const key = e.key.toLowerCase();

      // Player 1 Hotkeys: Q, W, A, S or 1, 2, 3, 4
      if (!p1Submitted) {
        if ((key === 'q' || key === '1') && currentQuestion.options[0] !== undefined) {
          e.preventDefault();
          executeP1Answer(currentQuestion.options[0], currentQuestion);
        } else if ((key === 'w' || key === '2') && currentQuestion.options[1] !== undefined) {
          e.preventDefault();
          executeP1Answer(currentQuestion.options[1], currentQuestion);
        } else if ((key === 'a' || key === '3') && currentQuestion.options[2] !== undefined) {
          e.preventDefault();
          executeP1Answer(currentQuestion.options[2], currentQuestion);
        } else if ((key === 's' || key === '4') && currentQuestion.options[3] !== undefined) {
          e.preventDefault();
          executeP1Answer(currentQuestion.options[3], currentQuestion);
        }
      }

      // Player 2 Hotkeys (active in 2-Player mode): U, I, J, K or 7, 8, 9, 0
      if (is2Player && !p2Submitted) {
        if ((key === 'u' || key === '7') && currentQuestion.options[0] !== undefined) {
          e.preventDefault();
          executeP2Answer(currentQuestion.options[0], currentQuestion);
        } else if ((key === 'i' || key === '8') && currentQuestion.options[1] !== undefined) {
          e.preventDefault();
          executeP2Answer(currentQuestion.options[1], currentQuestion);
        } else if ((key === 'j' || key === '9') && currentQuestion.options[2] !== undefined) {
          e.preventDefault();
          executeP2Answer(currentQuestion.options[2], currentQuestion);
        } else if ((key === 'k' || key === '0') && currentQuestion.options[3] !== undefined) {
          e.preventDefault();
          executeP2Answer(currentQuestion.options[3], currentQuestion);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isCompleted, p1Submitted, p2Submitted, currentQuestion, is2Player, currentIndex]);

  // Calculate War Frontline territory percentage
  const totalWeight = Math.max(1, p1Score + p2Score + (p1Stories + p2Stories) * 40);
  const p1Territory = Math.min(82, Math.max(18, Math.round(((p1Score + p1Stories * 40) / totalWeight) * 100)));
  const p2Territory = 100 - p1Territory;

  const roundResolved = p1Submitted || p2Submitted;

  return (
    <div className="modal-overlay" onClick={onExit}>
      <div
        className="modal-content horizontal-war-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #0284c7 0%, #38bdf8 30%, #fbbf24 50%, #f43f5e 70%, #e11d48 100%)',
            width: '100%',
          }}
        />

        {/* Arena Header */}
        <div className="modal-header" style={{ padding: '0.85rem 1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span style={{ fontSize: '1.9rem' }}>{game.icon}</span>
            <div>
              <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">Level {game.level}</span>
                <span className="badge badge-purple">{game.title}</span>
                <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Swords size={12} /> {is2Player ? '2-Player Head-to-Head Duel' : 'Solo vs AI Math Rival'}
                </span>
                <span className="badge badge-cyan" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem' }}>
                  <span>👆 Dual Touch Ready</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>⌨️ Keys: [Q,W,A,S] vs [U,I,J,K]</span>
                </span>
                {currentQuestion && (
                  <span
                    className={`badge ${
                      currentQuestion.difficulty === 'easy'
                        ? 'badge-green'
                        : currentQuestion.difficulty === 'intermediate'
                        ? 'badge-blue'
                        : 'badge-purple'
                    }`}
                  >
                    {currentQuestion.difficulty.toUpperCase()}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: 600 }}>
                Round {currentIndex + 1} of {config.questionCount} • Competitive War Arena
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            {/* Quick Live Scores */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(0,0,0,0.3)', padding: '0.35rem 0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: 800 }}>P1 BLUE</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{p1Score}</div>
              </div>
              <span style={{ fontWeight: 900, color: '#fbbf24', fontSize: '0.85rem' }}>VS</span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.68rem', color: '#fb7185', fontWeight: 800 }}>P2 RUBY</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#fb7185' }}>{p2Score}</div>
              </div>
            </div>

            <button
              className="btn-icon"
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Resume Battle' : 'Pause Battle'}
            >
              {isPaused ? <Play size={18} fill="white" /> : <Pause size={18} />}
            </button>

            <button className="btn-icon" onClick={onExit} title="Exit Arena">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body: Horizontal War Grid */}
        <div className="modal-body" style={{ padding: '1rem 1.35rem', display: 'flex', flexDirection: 'column' }}>
          {!isCompleted ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              {/* War Frontline Dominance Gauge */}
              <div className="war-frontline-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', fontWeight: 800 }}>
                  <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🟦 BLUE TITANS (P1): {p1Territory}% TERRITORY</span>
                    {p1Streak > 1 && (
                      <span className="badge badge-amber" style={{ padding: '0.1rem 0.4rem', fontSize: '0.68rem' }}>
                        <Flame size={11} /> {p1Streak}x Streak
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24' }}>
                    <Swords size={13} />
                    <span>WAR FRONTLINE DOMINANCE</span>
                    <Swords size={13} />
                  </div>

                  <div style={{ color: '#fb7185', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {p2Streak > 1 && (
                      <span className="badge badge-amber" style={{ padding: '0.1rem 0.4rem', fontSize: '0.68rem' }}>
                        <Flame size={11} /> {p2Streak}x Streak
                      </span>
                    )}
                    <span>{p2Territory}% TERRITORY :RUBY FALCONS (P2) 🟥</span>
                  </div>
                </div>

                {/* Live Frontline Bar Track */}
                <div className="war-frontline-bar-track">
                  <div className="war-frontline-p1" style={{ width: `${p1Territory}%` }} />
                  <div className="war-frontline-p2" style={{ width: `${p2Territory}%` }} />
                  <div className="war-frontline-divider" style={{ left: `${p1Territory}%` }} />
                </div>
              </div>

              {/* 3-COLUMN HORIZONTAL BATTLEFIELD */}
              <div className="battlefield-grid-horizontal">
                {/* 1. LEFT COLUMN: PLAYER 1 (BLUE TITANS) CALCULATION CONSOLE */}
                <div className="player-battle-console p1-console">
                  {/* Console Header */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>⚡</span>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.04em' }}>
                            PLAYER 1 (BLUE)
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Titan Calculation Deck</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 800 }}>P1 SCORE</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'white' }}>
                          {p1Score}
                        </div>
                      </div>
                    </div>

                    {/* Question Prompt Box */}
                    {currentQuestion && (
                      <div className="war-prompt-box" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          Mathematical Challenge
                        </div>
                        <div className="war-prompt-text">{currentQuestion.prompt}</div>
                      </div>
                    )}

                    {/* Option Tiles for Player 1 */}
                    {currentQuestion && (
                      <div className="war-options-grid">
                        {currentQuestion.options.map((opt, idx) => {
                          let statusClass = '';
                          if (p1Submitted) {
                            if (String(opt).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase()) {
                              statusClass = 'correct';
                            } else if (opt === p1Answer) {
                              statusClass = 'incorrect';
                            }
                          } else if (p1Answer === opt) {
                            statusClass = 'selected';
                          }

                          return (
                            <button
                              key={`p1_opt_${idx}`}
                              className={`war-option-tile p1-option-tile ${statusClass}`}
                              onPointerDown={(e) => {
                                e.preventDefault();
                                handleP1Answer(opt);
                              }}
                              onClick={() => handleP1Answer(opt)}
                              disabled={p1Submitted || isPaused}
                              title={`Player 1 select ${opt} (Key: ${P1_HOTKEYS[idx]})`}
                            >
                              <span className="hotkey-pill">{P1_HOTKEYS[idx]}</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Player 1 Status Card */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    {!p1Submitted ? (
                      <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>
                        ⚡ Tap screen or press [{P1_HOTKEYS.join(',')}] to strike!
                      </div>
                    ) : p1IsCorrect ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 800, fontSize: '0.85rem' }}>
                        <CheckCircle2 size={16} />
                        <span>DIRECT HIT! {firstStrikePlayer === 1 && 'FIRST STRIKE (+50) 💥'}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 800, fontSize: '0.85rem' }}>
                        <AlertCircle size={16} />
                        <span>MISS! Opponent holds the defense!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. CENTER STAGE: THE WAR GRAPHICS ARENA (TOWERS, TUG-OF-WAR, ROCKETS, CARS) */}
                <div className="center-war-stage">
                  {/* Top Live Ticker */}
                  <div
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.45rem 0.75rem',
                      textAlign: 'center',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#fbbf24',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {lastActionMessage}
                  </div>

                  {/* Graphical Game Visual Engine */}
                  {currentQuestion && (
                    <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <GuiGameRenderer
                        gameType={game.gameType}
                        question={currentQuestion}
                        selectedAnswer={p1Answer}
                        isAnswerSubmitted={roundResolved}
                        isCorrect={p1IsCorrect || p2IsCorrect}
                        ropePosition={ropePosition}
                        fuelLevel={Math.max(p1Fuel, p2Fuel)}
                        towerStories={Math.max(p1Stories, p2Stories)}
                        p1Stories={p1Stories}
                        p2Stories={p2Stories}
                        p1Fuel={p1Fuel}
                        p2Fuel={p2Fuel}
                        p1RacePos={p1RacePos}
                        p2RacePos={p2RacePos}
                        p1Score={p1Score}
                        p2Score={p2Score}
                        p1Streak={p1Streak}
                        p2Streak={p2Streak}
                        lastActionMessage={lastActionMessage}
                        isTwoPlayerMode={true}
                      />
                    </div>
                  )}

                  {/* Center Controls & Next Round Trigger */}
                  <div style={{ width: '100%', marginTop: '0.85rem' }}>
                    {roundResolved ? (
                      <button
                        className="btn btn-primary"
                        style={{
                          width: '100%',
                          padding: '0.85rem',
                          fontSize: '1.05rem',
                          fontWeight: 900,
                          letterSpacing: '0.04em',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                          border: 'none',
                          boxShadow: '0 6px 20px rgba(234, 88, 12, 0.45)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                        }}
                        onClick={handleNextQuestion}
                      >
                        <span>{currentIndex + 1 < config.questionCount ? 'NEXT ROUND' : 'CLAIM WAR VICTORY'}</span>
                        <ArrowRight size={20} />
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem',
                          width: '100%',
                        }}
                      >
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={handleUnlockHint}
                          disabled={hintTierUnlocked >= 3 || roundResolved}
                          style={{ flex: 1 }}
                        >
                          <HelpCircle size={14} />
                          {hintTierUnlocked === 0 ? 'Need a Hint?' : `Hint (${hintTierUnlocked}/3)`}
                        </button>

                        {onOpenAiCoach && currentQuestion && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              onOpenAiCoach({
                                question: currentQuestion.prompt,
                                level: game.level,
                                userAns: p1Answer ? String(p1Answer) : undefined,
                              })
                            }
                            style={{ flex: 1 }}
                          >
                            <Bot size={14} color="#38bdf8" /> AI Coach
                          </button>
                        )}
                      </div>
                    )}

                    {/* Hints Drawer */}
                    {hintTierUnlocked > 0 && currentQuestion && (
                      <div className="hint-ladder" style={{ marginTop: '0.75rem', maxHeight: '110px', overflowY: 'auto' }}>
                        {Array.from({ length: hintTierUnlocked }).map((_, idx) => (
                          <div key={idx} className="hint-step" style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}>
                            <span style={{ fontWeight: 800, color: '#38bdf8' }}>Hint {idx + 1}:</span>
                            <span>{currentQuestion.hints[idx]}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Worked Solution Summary on round resolution */}
                    {roundResolved && currentQuestion && (
                      <div
                        style={{
                          marginTop: '0.7rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          fontSize: '0.8rem',
                          textAlign: 'left',
                        }}
                      >
                        <strong style={{ color: '#10b981' }}>Solution: {currentQuestion.correctAnswer}</strong> —{' '}
                        <span style={{ color: 'var(--text-secondary)' }}>{currentQuestion.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. RIGHT COLUMN: PLAYER 2 (RUBY FALCONS / AI RIVAL) CALCULATION CONSOLE */}
                <div className="player-battle-console p2-console">
                  {/* Console Header */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.4rem' }}>{is2Player ? '🔥' : '🤖'}</span>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fb7185', letterSpacing: '0.04em' }}>
                            {is2Player ? 'PLAYER 2 (RUBY)' : 'AI MATH RIVAL'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {is2Player ? 'Falcon Calculation Deck' : 'Autonomous AI Competitor'}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: '#fb7185', fontWeight: 800 }}>P2 SCORE</div>
                        <div style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'white' }}>
                          {p2Score}
                        </div>
                      </div>
                    </div>

                    {/* EXACT SAME QUESTION PROMPT BOX */}
                    {currentQuestion && (
                      <div className="war-prompt-box" style={{ borderColor: 'rgba(244, 63, 94, 0.4)' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fb7185', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                          Mathematical Challenge
                        </div>
                        <div className="war-prompt-text">{currentQuestion.prompt}</div>
                      </div>
                    )}

                    {/* Option Tiles for Player 2 */}
                    {currentQuestion && (
                      <div className="war-options-grid">
                        {currentQuestion.options.map((opt, idx) => {
                          let statusClass = '';
                          if (p2Submitted) {
                            if (String(opt).trim().toLowerCase() === String(currentQuestion.correctAnswer).trim().toLowerCase()) {
                              statusClass = 'correct';
                            } else if (opt === p2Answer) {
                              statusClass = 'incorrect';
                            }
                          } else if (p2Answer === opt) {
                            statusClass = 'selected';
                          }

                          return (
                            <button
                              key={`p2_opt_${idx}`}
                              className={`war-option-tile p2-option-tile ${statusClass}`}
                              onPointerDown={(e) => {
                                e.preventDefault();
                                handleP2Answer(opt);
                              }}
                              onClick={() => handleP2Answer(opt)}
                              disabled={p2Submitted || isPaused}
                              title={`Player 2 select ${opt} (Key: ${P2_HOTKEYS[idx]})`}
                            >
                              <span className="hotkey-pill">{P2_HOTKEYS[idx]}</span>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Player 2 Status Card */}
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.35)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.65rem 0.85rem',
                      border: '1px solid rgba(244, 63, 94, 0.2)',
                      textAlign: 'center',
                    }}
                  >
                    {!p2Submitted ? (
                      <div style={{ fontSize: '0.8rem', color: '#fb7185', fontWeight: 700 }}>
                        {is2Player ? `🔥 Tap screen or press [${P2_HOTKEYS.join(',')}] to strike!` : '🤖 AI Rival is computing trajectory...'}
                      </div>
                    ) : p2IsCorrect ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 800, fontSize: '0.85rem' }}>
                        <CheckCircle2 size={16} />
                        <span>DIRECT HIT! {firstStrikePlayer === 2 && 'FIRST STRIKE (+50) 💥'}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 800, fontSize: '0.85rem' }}>
                        <AlertCircle size={16} />
                        <span>MISS! Opponent holds the defense!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Session Victory & Final Duel Ceremony */
            <div style={{ textAlign: 'center', padding: '1.5rem 1rem', overflowY: 'auto' }}>
              <div style={{ fontSize: '3.8rem', marginBottom: '0.5rem', animation: 'bounce 1s infinite' }}>
                🏆
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.4rem' }}>
                {p1Score > p2Score
                  ? '👑 PLAYER 1 (BLUE TITANS) CLAIMS WAR VICTORY!'
                  : p2Score > p1Score
                  ? '👑 PLAYER 2 (RUBY FALCONS) CLAIMS WAR VICTORY!'
                  : '⚡ EPIC STALEMATE! EQUAL MASTERY ON BOTH SIDES!'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
                {config.questionCount} rounds of intense head-to-head mathematical warfare completed!
              </p>

              {/* Head-to-Head Comparison Card */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1.25rem',
                  maxWidth: '700px',
                  margin: '0 auto 1.5rem',
                }}
              >
                {/* P1 Stats */}
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.08)',
                    border: '2px solid rgba(56, 189, 248, 0.4)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8', marginBottom: '0.5rem' }}>
                    BLUE TITANS (P1)
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'white' }}>
                    {p1Score} PTS
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                    Accuracy: {Math.round((p1CorrectCount / config.questionCount) * 100)}% ({p1CorrectCount}/{config.questionCount})
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Citadel Height: {p1Stories} Floors Built
                  </div>
                </div>

                {/* P2 Stats */}
                <div
                  style={{
                    background: 'rgba(244, 63, 94, 0.08)',
                    border: '2px solid rgba(244, 63, 94, 0.4)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fb7185', marginBottom: '0.5rem' }}>
                    {is2Player ? 'RUBY FALCONS (P2)' : 'AI MATH RIVAL'}
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: 'white' }}>
                    {p2Score} PTS
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
                    Accuracy: {Math.round((p2CorrectCount / config.questionCount) * 100)}% ({p2CorrectCount}/{config.questionCount})
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Citadel Height: {p2Stories} Floors Built
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary btn-lg" onClick={handleRestart}>
                  <RotateCcw size={18} /> Play Rematch
                </button>
                <button className="btn btn-primary btn-lg" onClick={onExit}>
                  Return to Matrix <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated Badge Unlock Modal if any badges were earned */}
      {newlyUnlockedBadges.length > 0 && (
        <BadgeUnlockModal
          newlyEarnedBadges={newlyUnlockedBadges}
          onClose={() => setNewlyUnlockedBadges([])}
        />
      )}
    </div>
  );
};

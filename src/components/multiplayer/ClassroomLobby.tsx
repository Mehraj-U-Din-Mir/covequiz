import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { soundManager } from '../../audio/soundEffects';
import { Users, LogIn, Sparkles, CheckCircle2, Shield, Flame, ArrowRight } from 'lucide-react';

export const ClassroomLobby: React.FC = () => {
  const { profile } = usePlayer();
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<'Red Falcons' | 'Blue Titans'>('Red Falcons');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [liveScore, setLiveScore] = useState<number>(0);
  const [teamScore, setTeamScore] = useState<number>(180);
  const [oppScore, setOppScore] = useState<number>(140);
  const [qRound, setQRound] = useState<number>(1);
  const [currentPrompt, setCurrentPrompt] = useState<string>('Solve together: 14 × 6');
  const [currentOpts, setCurrentOpts] = useState<(number | string)[]>([72, 84, 96, 88]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(84);
  const [selectedAns, setSelectedAns] = useState<number | string | null>(null);
  const [ansSubmitted, setAnsSubmitted] = useState<boolean>(false);

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    soundManager.playCorrect();
    setHasJoined(true);
  };

  const handleSelectAnswer = (opt: number | string) => {
    if (ansSubmitted) return;
    soundManager.playClick();
    setSelectedAns(opt);
  };

  const handleSubmitLiveAnswer = () => {
    if (selectedAns === null || ansSubmitted) return;
    const isCorr = selectedAns === correctAnswer;
    setAnsSubmitted(true);

    if (isCorr) {
      soundManager.playCorrect();
      setLiveScore((s) => s + 50);
      setTeamScore((s) => s + 50);
      soundManager.playStreak(2);
    } else {
      soundManager.playIncorrect();
    }
  };

  const handleNextLiveQuestion = () => {
    soundManager.playClick();
    setQRound((r) => r + 1);
    setSelectedAns(null);
    setAnsSubmitted(false);

    if (qRound === 1) {
      setCurrentPrompt('Solve: 9 × 12');
      setCurrentOpts([108, 98, 118, 104]);
      setCorrectAnswer(108);
    } else if (qRound === 2) {
      setCurrentPrompt('Team Target: 25% of 160');
      setCurrentOpts([30, 40, 50, 45]);
      setCorrectAnswer(40);
    } else {
      setCurrentPrompt('Final Round: 15² - 10²');
      setCurrentOpts([125, 115, 135, 145]);
      setCorrectAnswer(125);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {!hasJoined ? (
        <div className="glass-panel" style={{ padding: '2rem 1.5rem', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Users size={30} color="white" />
          </div>

          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>Enter Classroom Battle</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
            Enter the 6-character room code from your teacher's projector screen to jump straight into the live math match.
          </p>

          <form onSubmit={handleJoinSession}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="CQ-XXXX"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                maxLength={7}
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '2px solid var(--border-glow)',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.1em',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.03)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>JOINING AS:</div>
              <div style={{ fontWeight: 800, color: '#38bdf8' }}>{profile.nickname}</div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <LogIn size={18} /> Join Live Match
            </button>
          </form>
        </div>
      ) : (
        /* Live Classroom Battle Arena */
        <div>
          {/* Header Bar */}
          <div
            className="glass-panel"
            style={{
              padding: '1rem 1.5rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ROOM {joinCodeInput || 'CQ-8821'}</div>
              <h3 style={{ fontSize: '1.25rem' }}>Classroom Team Battle</h3>
            </div>

            {/* Live Scores Comparison */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 800 }}>RED FALCONS (YOU)</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#ef4444' }}>
                  {teamScore} pts
                </div>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-muted)' }}>VS</div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 800 }}>BLUE TITANS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: '#3b82f6' }}>
                  {oppScore} pts
                </div>
              </div>
            </div>
          </div>

          {/* Active Question Box */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge badge-purple">Round {qRound} of 4</span>
              <span className="badge badge-amber">Your Contribution: +{liveScore} pts</span>
            </div>

            <div style={{ padding: '1.2rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.04)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'white', textAlign: 'center' }}>{currentPrompt}</h3>
            </div>

            {/* Answer Options */}
            <div className="options-grid">
              {currentOpts.map((opt, i) => {
                let statusClass = '';
                if (ansSubmitted) {
                  if (opt === correctAnswer) statusClass = 'correct';
                  else if (opt === selectedAns) statusClass = 'incorrect';
                } else if (selectedAns === opt) {
                  statusClass = 'selected';
                }

                return (
                  <button
                    key={i}
                    className={`option-tile ${statusClass}`}
                    onClick={() => handleSelectAnswer(opt)}
                    disabled={ansSubmitted}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              {!ansSubmitted ? (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmitLiveAnswer}
                  disabled={selectedAns === null}
                >
                  Submit Team Answer
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleNextLiveQuestion}>
                  Next Challenge <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

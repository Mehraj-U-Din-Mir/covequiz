import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerProfile, Achievement } from '../types/game';
import { EarnedBadgeRecord, QuizSessionResult } from '../types/achievement';
import { generateRandomCodename, AVATAR_OPTIONS } from '../data/avatars';
import { processBadgeAwards } from '../engine/badgeEvaluator';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'calculation_champion', title: 'Calculation Champion', description: 'Score at least 90% correct answers in a completed quiz.', icon: '🎖️', unlocked: false, reqCount: 1 },
  { id: 'master_mind', title: 'Master Mind', description: 'Score at least 80% on a quiz containing Intermediate and Advanced questions.', icon: '🧠', unlocked: false, reqCount: 1 },
  { id: 'math_legend', title: 'Math Legend', description: 'Score 100% on a completed quiz that includes Advanced questions.', icon: '👑', unlocked: false, reqCount: 1 },
  { id: 'first_win', title: 'Number Sense Explorer', description: 'Complete your first math quest.', icon: '🌟', unlocked: false, reqCount: 1 },
  { id: 'streak_3', title: 'Consistency Streak', description: 'Maintain a 3-game winning streak.', icon: '🔥', unlocked: false, reqCount: 3 },
  { id: 'level_master', title: 'Mastery Milestone', description: 'Achieve 3 stars on any math game.', icon: '👑', unlocked: false, reqCount: 3 },
  { id: 'mental_math', title: 'Mental Maths Strategist', description: 'Answer correctly on the first attempt without hints.', icon: '⚡', unlocked: false, reqCount: 5 },
  { id: 'logic_architect', title: 'Logic Architect', description: 'Solve a multi-step problem using the Signature Thinking Engine.', icon: '🏛️', unlocked: false, reqCount: 1 },
  { id: 'team_collaborator', title: 'Team Collaborator', description: 'Participate in a live classroom team battle.', icon: '🤝', unlocked: false, reqCount: 1 },
];

interface PlayerContextType {
  profile: PlayerProfile;
  setNickname: (name: string) => void;
  setAvatar: (avatarId: string) => void;
  setLevel: (level: number) => void;
  regenerateCodename: () => void;
  recordGameResult: (gameId: string, score: number, stars: number) => void;
  evaluateAndAwardBadges: (result: QuizSessionResult) => EarnedBadgeRecord[];
  syncBadgesToServer: () => Promise<boolean>;
  resetProgress: () => void;
  achievements: Achievement[];
}

const STORAGE_KEY = 'covequiz_player_profile';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          earnedBadges: parsed.earnedBadges || [],
        };
      } catch {
        // Fallback
      }
    }
    return {
      id: `player_${Math.random().toString(36).substring(2, 9)}`,
      nickname: generateRandomCodename(),
      avatar: AVATAR_OPTIONS[0].id,
      selectedLevel: 1,
      totalScore: 0,
      starsEarned: 0,
      gamesCompleted: 0,
      streakCount: 0,
      unlockedAchievements: [],
      earnedBadges: [],
      levelProgress: {},
    };
  });

  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const setNickname = (name: string) => {
    setProfile((prev) => ({ ...prev, nickname: name.trim() || generateRandomCodename() }));
  };

  const setAvatar = (avatarId: string) => {
    setProfile((prev) => ({ ...prev, avatar: avatarId }));
  };

  const setLevel = (level: number) => {
    setProfile((prev) => ({ ...prev, selectedLevel: Math.max(1, Math.min(8, level)) }));
  };

  const regenerateCodename = () => {
    setProfile((prev) => ({ ...prev, nickname: generateRandomCodename() }));
  };

  const recordGameResult = (gameId: string, score: number, stars: number) => {
    setProfile((prev) => {
      const existing = prev.levelProgress[gameId] || { highScore: 0, stars: 0, completedAt: '' };
      const newHighScore = Math.max(existing.highScore, score);
      const newStars = Math.max(existing.stars, stars);
      const starsDiff = Math.max(0, newStars - existing.stars);

      const updatedProgress = {
        ...prev.levelProgress,
        [gameId]: {
          highScore: newHighScore,
          stars: newStars,
          completedAt: new Date().toISOString(),
        },
      };

      const newStreak = score > 0 ? prev.streakCount + 1 : 0;
      const newGamesCompleted = prev.gamesCompleted + 1;

      // Update basic achievements
      const unlocked = [...prev.unlockedAchievements];
      if (!unlocked.includes('first_win')) unlocked.push('first_win');
      if (newStreak >= 3 && !unlocked.includes('streak_3')) unlocked.push('streak_3');
      if (stars === 3 && !unlocked.includes('level_master')) unlocked.push('level_master');

      return {
        ...prev,
        totalScore: prev.totalScore + score,
        starsEarned: prev.starsEarned + starsDiff,
        gamesCompleted: newGamesCompleted,
        streakCount: newStreak,
        unlockedAchievements: unlocked,
        levelProgress: updatedProgress,
      };
    });
  };

  /**
   * Evaluates quiz completion against all 3 badge conditions independently.
   * Prevents duplicates and returns newly unlocked badges for immediate UI announcement.
   */
  const evaluateAndAwardBadges = (result: QuizSessionResult): EarnedBadgeRecord[] => {
    const existing = profile.earnedBadges || [];
    const { newlyEarned, allBadges } = processBadgeAwards(profile.id, result, existing);

    if (newlyEarned.length > 0) {
      setProfile((prev) => ({
        ...prev,
        earnedBadges: allBadges,
        unlockedAchievements: Array.from(
          new Set([...prev.unlockedAchievements, ...newlyEarned.map((b) => b.badgeId)])
        ),
      }));

      // Proactively attempt background sync if server is reachable
      syncBadgesToServer().catch(() => {});
    }

    return newlyEarned;
  };

  /**
   * Syncs local device badges to server endpoint to provide cross-device persistence
   * and updates sync status indicators.
   */
  const syncBadgesToServer = async (): Promise<boolean> => {
    try {
      const currentBadges = profile.earnedBadges || [];
      if (currentBadges.length === 0) return true;

      const res = await fetch('/api/achievements/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: profile.id,
          nickname: profile.nickname,
          badges: currentBadges,
        }),
      });

      if (res.ok) {
        setProfile((prev) => ({
          ...prev,
          earnedBadges: (prev.earnedBadges || []).map((b) => ({ ...b, isSynced: true })),
        }));
        return true;
      }
    } catch {
      // Server offline / network disconnected: safely retained on device
    }
    return false;
  };

  const resetProgress = () => {
    const fresh: PlayerProfile = {
      id: `player_${Math.random().toString(36).substring(2, 9)}`,
      nickname: generateRandomCodename(),
      avatar: AVATAR_OPTIONS[0].id,
      selectedLevel: 1,
      totalScore: 0,
      starsEarned: 0,
      gamesCompleted: 0,
      streakCount: 0,
      unlockedAchievements: [],
      earnedBadges: [],
      levelProgress: {},
    };
    setProfile(fresh);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <PlayerContext.Provider
      value={{
        profile,
        setNickname,
        setAvatar,
        setLevel,
        regenerateCodename,
        recordGameResult,
        evaluateAndAwardBadges,
        syncBadgesToServer,
        resetProgress,
        achievements,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

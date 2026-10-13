import React, { useState } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { AVATAR_OPTIONS } from '../../data/avatars';
import { soundManager } from '../../audio/soundEffects';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Trophy,
  Flame,
  Users,
  BookOpen,
  GraduationCap,
  Bot,
  Sun,
  Moon,
  Tv,
  Gamepad2,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'solo' | 'arcade' | 'multiplayer' | 'curriculum' | 'teacher' | 'ai';
  onSelectTab: (tab: 'solo' | 'arcade' | 'multiplayer' | 'curriculum' | 'teacher' | 'ai') => void;
  onOpenAvatarPicker: () => void;
  onOpenBadgesShowcase?: () => void;
}

interface NavTabItem {
  id: 'solo' | 'arcade' | 'multiplayer' | 'curriculum' | 'teacher' | 'ai';
  label: string;
  shortLabel: string;
  badge?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
}

const NAV_ITEMS: NavTabItem[] = [
  {
    id: 'solo',
    label: 'Quests',
    shortLabel: 'Quests',
    badge: '1-8',
    icon: Trophy,
    description: '160 Progressive Curriculum Quests (Levels 1–8)',
  },
  {
    id: 'arcade',
    label: 'GUI Arcade',
    shortLabel: 'Arcade',
    badge: '1-5',
    icon: Gamepad2,
    description: '100 Visual Interactive GUI Games (Levels 1–5)',
  },
  {
    id: 'multiplayer',
    label: 'Live Battles',
    shortLabel: 'Battles',
    icon: Users,
    description: 'Classroom Multiplayer & Real-Time Duels',
  },
  {
    id: 'teacher',
    label: 'Teacher Desk',
    shortLabel: 'Teacher',
    icon: GraduationCap,
    description: 'Class Analytics & Fullscreen Projector Arena',
  },
  {
    id: 'curriculum',
    label: 'NEP 2020 Map',
    shortLabel: 'NEP Map',
    icon: BookOpen,
    description: 'Curriculum Competencies & Stage Mappings',
  },
  {
    id: 'ai',
    label: 'AI Math Coach',
    shortLabel: 'AI Coach',
    badge: 'Groq',
    icon: Bot,
    description: 'Socratic Step-by-Step AI Mathematics Tutor',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAvatarPicker,
  onOpenBadgesShowcase,
}) => {
  const { profile } = usePlayer();
  const [isMuted, setIsMuted] = useState(soundManager.getIsMuted());
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'projector'>('dark');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const avatar = AVATAR_OPTIONS.find((a) => a.id === profile.avatar) || AVATAR_OPTIONS[0];

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const handleCycleTheme = () => {
    soundManager.playClick();
    if (themeMode === 'dark') {
      setThemeMode('light');
      document.body.classList.remove('projector-mode');
      document.body.classList.add('light-theme');
    } else if (themeMode === 'light') {
      setThemeMode('projector');
      document.body.classList.remove('light-theme');
      document.body.classList.add('projector-mode');
    } else {
      setThemeMode('dark');
      document.body.classList.remove('light-theme', 'projector-mode');
    }
  };

  const handleTabClick = (tabId: NavTabItem['id']) => {
    soundManager.playClick();
    onSelectTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      {/* Brand */}
      <div
        className="brand-badge"
        onClick={() => handleTabClick('solo')}
        role="button"
        tabIndex={0}
        title="COVEQUIZ Home (Quests)"
      >
        <div className="brand-logo-icon">CQ</div>
        <div className="brand-title-group">
          <div className="brand-text">COVEQUIZ</div>
          <div className="brand-subtext">MathQuest • CoveIQ</div>
        </div>
      </div>

      {/* Desktop Navigation Tabs (Guaranteed Single Row) */}
      <nav className="navbar-nav-group" aria-label="Main Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-tab-pill ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
              title={item.description}
            >
              <Icon size={15} />
              <span className="nav-tab-label-full">{item.label}</span>
              <span className="nav-tab-label-short">{item.shortLabel}</span>
              {item.badge && (
                <span className="nav-tab-badge-chip">{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right-Side Student Stats & Action Controls */}
      <div className="navbar-actions">
        {/* Streak */}
        <div className="nav-stat-chip nav-stat-amber" title={`Daily Streak: ${profile.streakCount} days`}>
          <Flame size={14} color="#f59e0b" />
          <span>{profile.streakCount}</span>
        </div>

        {/* Stars */}
        <div className="nav-stat-chip nav-stat-purple" title={`Total Stars Earned: ${profile.starsEarned}`}>
          <Sparkles size={14} color="#c084fc" />
          <span>{profile.starsEarned} ★</span>
        </div>

        {/* Achievement Badges Showcase Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenBadgesShowcase?.();
          }}
          className="nav-badge-btn"
          title="View Achievement Badges (Calculation Champion, Master Mind, Math Legend)"
        >
          <Trophy size={14} color="#f59e0b" />
          <span className="nav-badge-text-full">
            {profile.earnedBadges?.length || 0} Badges
          </span>
          <span className="nav-badge-text-short">
            {profile.earnedBadges?.length || 0}
          </span>
        </button>

        {/* Student Avatar Card */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenAvatarPicker();
          }}
          className="nav-profile-btn"
          title="Change Nickname & Avatar (Zero login required)"
        >
          <span className="nav-avatar-emoji">{avatar.emoji}</span>
          <span className="nav-nickname">{profile.nickname}</span>
        </button>

        {/* Sound Toggle */}
        <button
          className="nav-icon-btn"
          onClick={handleToggleSound}
          title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>

        {/* Theme Cycle */}
        <button
          className="nav-icon-btn"
          onClick={handleCycleTheme}
          title={`Theme: ${themeMode.toUpperCase()} (Click to toggle Dark / Light / Projector)`}
          aria-label="Toggle Theme"
        >
          {themeMode === 'dark' && <Moon size={17} />}
          {themeMode === 'light' && <Sun size={17} />}
          {themeMode === 'projector' && <Tv size={17} />}
        </button>

        {/* Mobile / Tablet Menu Toggle */}
        <button
          className="nav-mobile-toggle-btn"
          onClick={() => {
            soundManager.playClick();
            setIsMobileMenuOpen((prev) => !prev);
          }}
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile / Tablet Menu Dropdown Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer" role="dialog" aria-modal="true">
          <div className="mobile-nav-header">
            <span className="mobile-nav-title">Navigation Menu</span>
            <button
              className="btn-icon"
              style={{ width: 32, height: 32 }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          <div className="mobile-nav-list">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.id)}
                >
                  <div className="mobile-nav-item-icon">
                    <Icon size={18} />
                  </div>
                  <div className="mobile-nav-item-info">
                    <div className="mobile-nav-item-label">
                      {item.label}
                      {item.badge && (
                        <span className="nav-tab-badge-chip">{item.badge}</span>
                      )}
                    </div>
                    <div className="mobile-nav-item-desc">{item.description}</div>
                  </div>
                  <ChevronRight size={16} style={{ opacity: 0.4 }} />
                </button>
              );
            })}
          </div>

          {/* Quick Stats in Mobile Drawer */}
          <div className="mobile-nav-footer">
            <div className="mobile-nav-stats">
              <span className="nav-stat-chip nav-stat-amber">
                <Flame size={14} color="#f59e0b" /> {profile.streakCount} Streak
              </span>
              <span className="nav-stat-chip nav-stat-purple">
                <Sparkles size={14} color="#c084fc" /> {profile.starsEarned} Stars
              </span>
              <button
                className="nav-badge-btn"
                style={{ padding: '0.3rem 0.6rem' }}
                onClick={() => {
                  soundManager.playClick();
                  setIsMobileMenuOpen(false);
                  onOpenBadgesShowcase?.();
                }}
              >
                <Trophy size={14} color="#f59e0b" /> {profile.earnedBadges?.length || 0} Badges
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

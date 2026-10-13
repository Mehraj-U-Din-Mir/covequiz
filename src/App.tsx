import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { Navbar } from './components/common/Navbar';
import { AvatarPicker } from './components/common/AvatarPicker';
import { LevelSelector } from './components/solo/LevelSelector';
import { GameGrid } from './components/solo/GameGrid';
import { GamePlayModal } from './components/solo/GamePlayModal';
import { CurriculumAlignmentView } from './components/curriculum/CurriculumAlignmentView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { ClassroomLobby } from './components/multiplayer/ClassroomLobby';
import { ProjectorMode } from './components/multiplayer/ProjectorMode';
import { GroqCoachDrawer } from './components/ai/GroqCoachDrawer';
import { GuiGameCatalog } from './components/guiGames/GuiGameCatalog';
import { BadgeShowcaseModal } from './components/achievements/BadgeShowcaseModal';
import { Footer } from './components/common/Footer';
import { GameDefinition } from './types/game';
import { ClassroomSession } from './types/multiplayer';

export function App() {
  const [currentTab, setCurrentTab] = useState<'solo' | 'arcade' | 'multiplayer' | 'curriculum' | 'teacher' | 'ai'>('solo');
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState<boolean>(false);
  const [isBadgesShowcaseOpen, setIsBadgesShowcaseOpen] = useState<boolean>(false);
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(null);
  const [projectorSession, setProjectorSession] = useState<ClassroomSession | null>(null);
  const [aiCoachContext, setAiCoachContext] = useState<{ question: string; level: number; userAns?: string } | undefined>(undefined);

  const handleOpenAiFromGame = (ctx: { question: string; level: number; userAns?: string }) => {
    setAiCoachContext(ctx);
    setCurrentTab('ai');
  };

  return (
    <PlayerProvider>
      <div className="app-container">
        {/* Navbar */}
        <Navbar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
          onOpenBadgesShowcase={() => setIsBadgesShowcaseOpen(true)}
        />

        {/* Main Content Area */}
        <main className="main-content">
          {currentTab === 'solo' && (
            <div>
              <LevelSelector />
              <GameGrid onSelectGame={(game) => setActiveGame(game)} />
            </div>
          )}

          {currentTab === 'arcade' && <GuiGameCatalog />}

          {currentTab === 'multiplayer' && <ClassroomLobby />}

          {currentTab === 'teacher' && (
            <TeacherDashboard onLaunchProjector={(session) => setProjectorSession(session)} />
          )}

          {currentTab === 'curriculum' && <CurriculumAlignmentView />}

          {currentTab === 'ai' && <GroqCoachDrawer initialContext={aiCoachContext} />}
        </main>

        {/* Clear and Beautifully Designed Footer */}
        <Footer />

        {/* Game Play Modal */}
        {activeGame && (
          <GamePlayModal
            game={activeGame}
            onClose={() => setActiveGame(null)}
            onOpenAiCoach={handleOpenAiFromGame}
          />
        )}

        {/* Avatar & Codename Picker Modal */}
        <AvatarPicker
          isOpen={isAvatarPickerOpen}
          onClose={() => setIsAvatarPickerOpen(false)}
        />

        {/* Achievement Badges Showcase Modal */}
        <BadgeShowcaseModal
          isOpen={isBadgesShowcaseOpen}
          onClose={() => setIsBadgesShowcaseOpen(false)}
        />

        {/* Projector Mode Fullscreen Overlay */}
        {projectorSession && (
          <ProjectorMode
            session={projectorSession}
            onClose={() => setProjectorSession(null)}
          />
        )}
      </div>
    </PlayerProvider>
  );
}

export default App;

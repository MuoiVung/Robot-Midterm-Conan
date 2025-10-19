import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { GameProvider, useGameContext } from './context/GameContext';
import CharacterSelectionScreen from './components/CharacterSelectionScreen';
import MenuScreen from './components/MenuScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import StoryScreen from './components/StoryScreen';
import ChapterSelectionScreen from './components/ChapterSelectionScreen';
import LanguageSwitcher from './components/LanguageSwitcher';

const ScreenManager: React.FC = () => {
  const { screen, setScreen } = useAppContext();
  const { gameState } = useGameContext();
  
  // On initial load, decide which screen to show
  React.useEffect(() => {
      if(gameState.selectedCharacterId) {
          setScreen('menu');
      } else {
          setScreen('character');
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.selectedCharacterId]);


  const renderScreen = () => {
    switch (screen) {
      case 'character':
        return <CharacterSelectionScreen />;
      case 'menu':
        return <MenuScreen />;
      case 'chapter_selection':
        return <ChapterSelectionScreen />;
      case 'story':
        return <StoryScreen />;
      case 'quiz':
        return <QuizScreen />;
      case 'results':
        return <ResultsScreen />;
      default:
        return <CharacterSelectionScreen />;
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <LanguageSwitcher />
        {renderScreen()}
      </div>
    </main>
  );
};


const App: React.FC = () => {
  return (
    <AppProvider>
      <GameProvider>
        <ScreenManager />
      </GameProvider>
    </AppProvider>
  );
};

export default App;

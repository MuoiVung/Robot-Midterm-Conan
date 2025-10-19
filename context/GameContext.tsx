import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { GameState, Character, CHARACTERS } from '../services/gameData';

const MAX_HP = 100;
const HP_LOSS = 10; // Corrected HP loss to 10
const PENALTY_PROGRESS_LOSS = 15;
const HP_RESET_ON_PENALTY = 50;

const getInitialState = (): GameState => {
    try {
        const savedState = localStorage.getItem('detectiveGameState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            // Ensure essential fields are present
            return {
                ...getNewGameState(),
                ...parsedState,
            };
        }
    } catch (error) {
        console.error("Failed to parse game state from localStorage", error);
    }
    return getNewGameState();
};

const getNewGameState = (): GameState => ({
  selectedCharacterId: null,
  characterLevel: 1,
  perfectRuns: 0,
  currentHP: MAX_HP,
  caseProgress: 0,
  currentChapterIndex: 0,
  currentSceneIndex: 0,
});


interface GameContextType {
  gameState: GameState;
  selectCharacter: (id: Character['id']) => void;
  resetCharacterSelection: () => void;
  getCharacter: () => Character | null;
  applyAnswerEffect: (isCorrect: boolean, progressGain: number) => void;
  recordPerfectRun: () => void;
  applyPenaltyAndReset: () => void;
  advanceStory: () => void;
  startChapter: (chapterIndex: number) => void;
  resetGameForNewTest: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem('detectiveGameState', JSON.stringify(gameState));
    } catch (error) {
      console.error("Failed to save game state to localStorage", error);
    }
  }, [gameState]);


  const getCharacter = useCallback(() => {
    if (!gameState.selectedCharacterId) return null;
    return CHARACTERS.find(c => c.id === gameState.selectedCharacterId) || null;
  }, [gameState.selectedCharacterId]);

  const selectCharacter = (id: Character['id']) => {
    setGameState(prev => ({ ...getNewGameState(), selectedCharacterId: id }));
  };
  
  const resetCharacterSelection = () => {
    setGameState(prev => ({...prev, selectedCharacterId: null}));
  };
  
  const resetGameForNewTest = () => {
    setGameState(prev => ({
        ...prev,
        currentHP: MAX_HP,
        caseProgress: 0,
    }));
  };

  const applyAnswerEffect = (isCorrect: boolean, progressGain: number) => {
    setGameState(prev => {
      let newHP = prev.currentHP;
      let newProgress = prev.caseProgress;
      if (isCorrect) {
        newProgress = Math.min(100, prev.caseProgress + progressGain);
      } else {
        newHP = Math.max(0, prev.currentHP - HP_LOSS);
      }
      return { ...prev, currentHP: newHP, caseProgress: newProgress };
    });
  };
  
  const recordPerfectRun = () => {
    setGameState(prev => {
      const newPerfectRuns = prev.perfectRuns + 1;
      let newLevel = prev.characterLevel;
      if (newPerfectRuns >= 10) newLevel = 3;
      else if (newPerfectRuns >= 5) newLevel = 2;
      return { ...prev, perfectRuns: newPerfectRuns, characterLevel: newLevel };
    });
  };
  
  const applyPenaltyAndReset = () => {
    setGameState(prev => ({
      ...prev,
      caseProgress: Math.max(0, prev.caseProgress - PENALTY_PROGRESS_LOSS),
      currentHP: HP_RESET_ON_PENALTY,
    }));
  };

  const advanceStory = () => {
    setGameState(prev => ({...prev, currentSceneIndex: prev.currentSceneIndex + 1}));
  };

  const startChapter = (chapterIndex: number) => {
    setGameState(prev => ({
      ...prev,
      currentChapterIndex: chapterIndex,
      currentSceneIndex: 0,
      currentHP: MAX_HP, // Reset HP for each new chapter
    }));
  };

  return (
    <GameContext.Provider value={{
      gameState,
      selectCharacter,
      resetCharacterSelection,
      getCharacter,
      applyAnswerEffect,
      recordPerfectRun,
      applyPenaltyAndReset,
      advanceStory,
      startChapter,
      resetGameForNewTest
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

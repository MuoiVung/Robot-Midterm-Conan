// Fix: Create the AppContext for global state management
import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Language, UserAnswers, UserAnswer } from '../types';

// Fix: Add 'chapter_selection' to the Screen type to support the new screen.
type Screen = 'character' | 'menu' | 'quiz' | 'results' | 'story' | 'chapter_selection';
type Mode = 'study' | 'test';

interface AppContextType {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  userAnswers: UserAnswers;
  updateUserAnswer: (questionId: string, answer: UserAnswer) => void;
  resetUserAnswers: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [screen, setScreen] = useState<Screen>('character');
  const [mode, setMode] = useState<Mode>('study');
  const [language, setLanguage] = useState<Language>('en');
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});

  const updateUserAnswer = (questionId: string, answer: UserAnswer) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const resetUserAnswers = () => {
    setUserAnswers({});
  };

  return (
    <AppContext.Provider value={{
      screen, setScreen,
      mode, setMode,
      language, setLanguage,
      userAnswers, updateUserAnswer, resetUserAnswers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

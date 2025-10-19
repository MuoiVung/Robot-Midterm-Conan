import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useGameContext } from '../context/GameContext';
import { translations } from '../services/quizData';

const MenuScreen: React.FC = () => {
    const { setScreen, setMode, language, resetUserAnswers } = useAppContext();
    const { getCharacter, resetCharacterSelection, resetGameForNewTest } = useGameContext();
    const character = getCharacter();

    const handleModeSelect = (mode: 'study' | 'test' | 'story') => {
        resetUserAnswers();
        if (mode === 'story') {
            setScreen('chapter_selection');
        } else {
            if (mode === 'test') {
                resetGameForNewTest();
            }
            setMode(mode);
            setScreen('quiz');
        }
    };

    const handleChangeDetective = () => {
        resetCharacterSelection();
        setScreen('character');
    };

    return (
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
             {character && (
                <div className="mb-6 flex flex-col items-center">
                    <img src={character.images.level1} alt={character.name} className="w-24 h-24 mx-auto rounded-full mb-2 object-cover border-4 border-blue-300"/>
                    <p className="font-semibold text-gray-700">Your Detective: {character.name}</p>
                </div>
            )}
            <h1 className="text-4xl font-bold text-blue-600 mb-2">
                {translations[language].app_title}
            </h1>
            <p className="text-gray-600 mb-8">
                {translations[language].app_subtitle}
            </p>
            <div className="flex flex-col items-center space-y-4">
                 <button
                    onClick={() => handleModeSelect('story')}
                    className="w-full max-w-sm bg-purple-500 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-purple-600 transition shadow-md transform hover:scale-105"
                >
                    Story Mode
                </button>
                <button
                    onClick={() => handleModeSelect('study')}
                    className="w-full max-w-sm bg-blue-500 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-blue-600 transition shadow-md transform hover:scale-105"
                >
                    {translations[language].study_mode}
                </button>
                <button
                    onClick={() => handleModeSelect('test')}
                    className="w-full max-w-sm bg-green-500 text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-green-600 transition shadow-md transform hover:scale-105"
                >
                    {translations[language].test_mode}
                </button>
                 <button
                    onClick={handleChangeDetective}
                    className="w-full max-w-sm bg-gray-500 text-white px-6 py-3 mt-4 rounded-xl font-semibold hover:bg-gray-600 transition shadow-md"
                >
                    Change Detective
                </button>
            </div>
        </div>
    );
};

export default MenuScreen;

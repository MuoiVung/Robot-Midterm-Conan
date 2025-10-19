
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useGameContext } from '../context/GameContext';
import { storyChapters } from '../services/storyData';
import { translations } from '../services/quizData';

const ChapterSelectionScreen: React.FC = () => {
    const { setScreen, language } = useAppContext();
    const { startChapter, getCharacter } = useGameContext();
    const character = getCharacter();

    const handleChapterSelect = (chapterIndex: number) => {
        startChapter(chapterIndex);
        setScreen('story');
    };

    const handleBackToMenu = () => {
        setScreen('menu');
    };

    return (
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg animate-fade-in max-w-4xl mx-auto">
            {character && (
                <div className="mb-6 flex flex-col items-center">
                    <img src={character.images.level1} alt={character.name} className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-purple-300"/>
                    <p className="font-semibold text-gray-700 mt-2">Detective: {character.name}</p>
                </div>
            )}
            <h1 className="text-4xl font-bold text-purple-600 mb-2">
                Story Mode: Case Files
            </h1>
            <p className="text-gray-600 mb-8">
                Select a case to begin your investigation.
            </p>
            
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4">
                {storyChapters.map((chapter, index) => (
                    <div
                        key={chapter.id}
                        onClick={() => handleChapterSelect(index)}
                        className="w-full text-left p-6 border-2 border-transparent rounded-xl bg-gray-50 hover:bg-white hover:shadow-xl hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    >
                        <h3 className="text-xl font-bold text-gray-800">{chapter.title[language]}</h3>
                        <p className="text-gray-500 mt-1">{chapter.description[language]}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <button
                    onClick={handleBackToMenu}
                    className="w-full max-w-sm bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition shadow-md"
                >
                    {translations[language].back_to_menu}
                </button>
            </div>
        </div>
    );
};

export default ChapterSelectionScreen;

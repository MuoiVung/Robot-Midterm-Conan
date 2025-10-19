import React from 'react';
import { useGameContext } from '../context/GameContext';
import { CHARACTERS } from '../services/gameData';
import { useAppContext } from '../context/AppContext';
import { translations } from '../services/quizData';

const CharacterSelectionScreen: React.FC = () => {
  const { selectCharacter } = useGameContext();
  const { language } = useAppContext();

  return (
    <div className="text-center bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        {translations[language].app_title}
      </h1>
      <p className="text-gray-600 mb-8">
        {/* A more thematic subtitle */}
        Choose your detective partner to begin the investigation!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHARACTERS.map((char) => (
          <div
            key={char.id}
            onClick={() => selectCharacter(char.id)}
            className="border-2 border-transparent rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-blue-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <img src={char.images.level1} alt={char.name} className="w-32 h-32 mx-auto rounded-full mb-4 object-cover" />
            <h3 className="text-xl font-bold text-gray-800">{char.name}</h3>
            <p className="text-gray-500 mt-1 text-sm">{char.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelectionScreen;

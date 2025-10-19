import React from 'react';
import { useGameContext } from '../context/GameContext';
import { useAppContext } from '../context/AppContext';

const GameUI: React.FC = () => {
  const { gameState, getCharacter } = useGameContext();
  const { language } = useAppContext();
  const { characterLevel, currentHP, caseProgress, perfectRuns } = gameState;

  const character = getCharacter();

  if (!character) return null;

  const getCharacterImage = () => {
    if (characterLevel === 3) return character.images.level3;
    if (characterLevel === 2) return character.images.level2;
    return character.images.level1;
  };

  const hpColor = currentHP > 50 ? 'bg-green-500' : currentHP > 20 ? 'bg-yellow-500' : 'bg-red-500';

  const levelName = language === 'vi' 
    ? `Cấp ${characterLevel}` 
    : `Level ${characterLevel}`;

  const perfectRunsText = language === 'vi'
    ? `Phá án hoàn hảo: ${perfectRuns}`
    : `Perfect Cases: ${perfectRuns}`;
  
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-6 grid grid-cols-3 gap-4 items-center sticky top-2 z-30">
        {/* Character Info */}
        <div className="flex items-center gap-4">
            <img src={getCharacterImage()} alt={character.name} className="w-16 h-16 rounded-full border-4 border-blue-300 object-cover" />
            <div>
                <h3 className="font-bold text-lg text-gray-800">{character.name}</h3>
                <p className="text-sm text-gray-600">{levelName}</p>
                 <p className="text-xs text-blue-600 font-semibold">{perfectRunsText}</p>
            </div>
        </div>

        {/* HP Bar */}
        <div className="flex flex-col justify-center">
            <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-semibold text-gray-700">{language === 'vi' ? 'Uy Tín' : 'Credibility'}</span>
                <span className="font-bold text-lg">{currentHP}<span className="text-sm">/100</span></span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className={`${hpColor} h-4 rounded-full transition-all duration-500 ease-out`} style={{ width: `${currentHP}%` }}></div>
            </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col justify-center">
            <span className="text-sm font-semibold text-gray-700 mb-1">{language === 'vi' ? 'Tiến Trình Vụ Án' : 'Case Progress'}</span>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out" style={{ width: `${caseProgress}%` }}></div>
            </div>
             <span className="text-right font-bold text-lg">{Math.round(caseProgress)}%</span>
        </div>
    </div>
  );
};

export default GameUI;

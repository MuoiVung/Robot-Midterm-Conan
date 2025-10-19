import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useGameContext } from '../context/GameContext';
import { storyChapters, getCharacterById } from '../services/storyData';
import { getAllQuestions, translations } from '../services/quizData';
import QuestionCard from './QuestionCard';
import type { NarrativeScene, QuestionScene, ConclusionScene, UserAnswer, Question, FillInQuestion, OrderingQuestion, SelectQuestion } from '../types';
import GameUI from './GameUI';

const StoryScreen: React.FC = () => {
    const { language, setScreen, userAnswers } = useAppContext();
    const { gameState, advanceStory, getCharacter, applyAnswerEffect } = useGameContext();
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success', message: string } | null>(null);
    const allQuestions = getAllQuestions();
    const playerCharacter = getCharacter();

    const chapter = storyChapters[gameState.currentChapterIndex];
    if (!chapter) {
        return <div>Error: Chapter not found! <button onClick={() => setScreen('chapter_selection')}>Go Back</button></div>;
    }
    const scene = chapter.scenes[gameState.currentSceneIndex];
     if (!scene) {
        // Fallback if scene index is out of bounds
        setScreen('chapter_selection');
        return null;
    }
    
    const handleBackToMenu = () => {
        setScreen('menu');
    };

    const checkAnswer = (question: Question, answer: UserAnswer): boolean => {
        if (!answer) return false;
        switch (question.type) {
            case 'single-select':
            case 'multi-select': {
                const q = question as SelectQuestion;
                const correctAnswers = q.correctAnswers.sort();
                const sortedUserAnswers = Array.isArray(answer) ? [...answer].sort() : [];
                return JSON.stringify(correctAnswers) === JSON.stringify(sortedUserAnswers);
            }
            case 'fill-in': {
                const q = question as FillInQuestion;
                const userAnswerFillIn = answer as Record<number, string>;
                if (Object.keys(userAnswerFillIn).length < q.labels.length) return false;
                return q.labels.every(label =>
                    userAnswerFillIn[label.id]?.toLowerCase().trim() === label.correct[language].toLowerCase().trim()
                );
            }
            case 'ordering': {
                const q = question as OrderingQuestion;
                const userAnswerOrdering = answer as Record<number, number[]>;
                return q.sub_questions.every((sub, subIndex) => {
                    const userOrder = userAnswerOrdering?.[subIndex];
                    if (!userOrder || userOrder.length !== sub.steps.length) return false;
                    return userOrder.every((stepId, pos) => stepId === pos);
                });
            }
            default:
                return false;
        }
    };

    const handleConfirmClue = () => {
        setFeedback(null);
        if (scene.type !== 'question') return;

        const question = allQuestions.find(q => q.id === (scene as QuestionScene).questionId);
        if (!question) return;

        const userAnswer = userAnswers[question.id];
        const isAnswered = userAnswer && (
            (Array.isArray(userAnswer) && userAnswer.length > 0) ||
            (typeof userAnswer === 'object' && Object.keys(userAnswer).length > 0)
        );

        if (!isAnswered) {
            setFeedback({ type: 'error', message: language === 'vi' ? 'Vui lòng đưa ra câu trả lời.' : 'Please provide an answer.' });
            return;
        }

        const isCorrect = checkAnswer(question, userAnswer);
        applyAnswerEffect(isCorrect, 0);

        if (isCorrect) {
            setFeedback({ type: 'success', message: language === 'vi' ? 'Chính xác! Đó là manh mối chúng ta cần.' : 'Correct! That\'s the clue we needed.' });
            setTimeout(() => {
                advanceStory();
                setFeedback(null);
            }, 1500);
        } else {
            setFeedback({ type: 'error', message: language === 'vi' ? 'Có vẻ không đúng. Hãy suy nghĩ lại.' : 'That doesn\'t seem right. Let\'s rethink this.' });
        }
    };
    
    const handleNext = () => {
        if (scene.type === 'question') {
            handleConfirmClue();
        } else {
             if (gameState.currentSceneIndex < chapter.scenes.length - 1) {
                advanceStory();
            } else {
                setScreen('chapter_selection');
            }
        }
    };

    const renderNarrativeScene = (s: NarrativeScene) => {
        const character = getCharacterById(s.characterId);
        const isPlayer = playerCharacter && s.characterId === playerCharacter.id;

        const dialogueBoxClasses = `p-4 rounded-lg my-2 max-w-xl relative ${isPlayer ? 'bg-blue-100 ml-auto' : 'bg-gray-200 mr-auto'}`;
        const characterInfoClasses = `flex items-center gap-2 ${isPlayer ? 'flex-row-reverse ml-auto' : 'mr-auto'}`;
        
        return (
            <div className="animate-fade-in w-full">
                <div className={characterInfoClasses}>
                    <img src={character.image} alt={character.name} className="w-12 h-12 rounded-full object-cover"/>
                    <span className="font-bold">{character.name}</span>
                </div>
                <div className={dialogueBoxClasses}>
                    <p>{s.dialogue[language]}</p>
                </div>
            </div>
        );
    };

    const renderQuestionScene = (s: QuestionScene) => {
        const question = allQuestions.find(q => q.id === s.questionId);
        if (!question) return <div>Error: Question not found!</div>;
        
        const isAnsweredCorrectly = feedback?.type === 'success';

        return (
            <div className="animate-fade-in">
                <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg mb-4 flex items-center gap-3">
                    <img src="/assets/evidence.svg" alt="Evidence" className="w-6 h-6"/>
                    <p className="font-semibold">{s.prompt[language]}</p>
                </div>
                <QuestionCard 
                    question={question} 
                    questionNumber={1}
                    progressPerCorrectAnswer={0}
                    isSolved={isAnsweredCorrectly}
                />
                {feedback && (
                     <p className={`font-semibold mt-4 text-center ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {feedback.message}
                    </p>
                )}
            </div>
        );
    };
    
    const renderConclusionScene = (s: ConclusionScene) => {
        return (
            <div className="text-center p-6 bg-green-50 border border-green-300 rounded-xl animate-fade-in">
                <h2 className="text-2xl font-bold text-green-800 mb-2">{s.title[language]}</h2>
                <p className="text-gray-700">{s.summary[language]}</p>
            </div>
        );
    };

    const renderScene = () => {
        switch (scene.type) {
            case 'narrative':
                return renderNarrativeScene(scene as NarrativeScene);
            case 'question':
                return renderQuestionScene(scene as QuestionScene);
            case 'conclusion':
                 return renderConclusionScene(scene as ConclusionScene);
            default:
                return <div>Unknown scene type.</div>;
        }
    };
    
    const isConclusion = scene.type === 'conclusion';
    let buttonText = translations[language].back_to_menu;
    if (scene.type === 'question') {
      buttonText = language === 'vi' ? 'Xác nhận Manh mối' : 'Confirm Clue';
    } else if (isConclusion) {
      buttonText = language === 'vi' ? 'Hoàn thành' : 'Finish Case';
    } else {
      buttonText = language === 'vi' ? 'Tiếp' : 'Next';
    }


    return (
        <div>
             {!isConclusion && (
                 <div className="sticky top-0 z-20 bg-gray-100/80 backdrop-blur-sm -mx-4 -mt-4 mb-4">
                    <div className="max-w-4xl mx-auto p-4">
                       <GameUI />
                    </div>
                 </div>
             )}

            <div className={`bg-white p-6 rounded-2xl shadow-lg max-w-3xl mx-auto ${isConclusion ? 'mt-8' : ''}`}>
                 <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h1 className="text-2xl font-bold">{chapter.title[language]}</h1>
                    {!isConclusion && (
                         <button onClick={() => setScreen('chapter_selection')} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition">
                            Back to Cases
                        </button>
                    )}
                 </div>
                <div className="min-h-[300px] flex flex-col justify-center items-center">
                    {renderScene()}
                </div>
                <div className="mt-6 text-right">
                    <button
                        onClick={handleNext}
                        disabled={feedback?.type === 'success'}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryScreen;

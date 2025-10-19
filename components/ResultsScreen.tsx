import React, { useMemo, useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useGameContext } from '../context/GameContext';
import { getAllQuestions, translations } from '../services/quizData';
import type { Question, SelectQuestion, FillInQuestion, OrderingQuestion } from '../types';

const ResultsScreen: React.FC = () => {
    const { userAnswers, setScreen, setMode, language, resetUserAnswers } = useAppContext();
    const { gameState, recordPerfectRun, applyPenaltyAndReset, getCharacter } = useGameContext();
    const allQuestions = getAllQuestions();
    const [levelUp, setLevelUp] = useState(false);

    const character = getCharacter();
    const prevLevel = useMemo(() => gameState.characterLevel, []); // Capture level before potential update

    const { score, total } = useMemo(() => {
        let score = 0;
        let total = 0;
        allQuestions.forEach(q => {
            const userAnswer = userAnswers[q.id];
            switch (q.type) {
                case 'single-select':
                case 'multi-select':
                    total++;
                    const correctAnswers = q.correctAnswers.sort();
                    const sortedUserAnswers = userAnswer && Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
                    if (JSON.stringify(correctAnswers) === JSON.stringify(sortedUserAnswers)) {
                        score++;
                    }
                    break;
                case 'fill-in':
                    q.labels.forEach(label => {
                        total++;
                        const userAnswerEntry = (userAnswer as Record<number, string>)?.[label.id]?.toLowerCase() || '';
                        const correctAnswerEntry = label.correct[language].toLowerCase();
                        if (userAnswerEntry === correctAnswerEntry) {
                            score++;
                        }
                    });
                    break;
                case 'ordering':
                    q.sub_questions.forEach((sub, subIndex) => {
                        total += sub.steps.length;
                        const userOrder = (userAnswer as Record<number, number[]>)?.[subIndex] || [];
                        userOrder.forEach((stepId, pos) => {
                            if (stepId === pos) {
                                score++;
                            }
                        });
                    });
                    break;
            }
        });
        return { score, total };
    }, [allQuestions, userAnswers, language]);
    
    useEffect(() => {
        if (score > 0 && score === total) {
            recordPerfectRun();
            if (gameState.perfectRuns + 1 === 5 || gameState.perfectRuns + 1 === 10) {
              setLevelUp(true);
            }
        }
        if (gameState.currentHP <= 0) {
            applyPenaltyAndReset();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleRestart = () => {
        setMode('test');
        setScreen('quiz');
    };

    const handleMenu = () => {
        setScreen('menu');
    };
    
    // ... rest of rendering logic
    const renderReview = (q: Question, questionNumber: number) => {
        const userAnswer = userAnswers[q.id];
        
        switch (q.type) {
            case 'single-select':
            case 'multi-select':
                return renderSelectReview(q, userAnswer as number[], questionNumber);
            case 'fill-in':
                return renderFillInReview(q, userAnswer as Record<number, string>, questionNumber);
            case 'ordering':
                return renderOrderingReview(q, userAnswer as Record<number, number[]>, questionNumber);
            default:
                return null;
        }
    };

    const renderSelectReview = (q: SelectQuestion, userAnswer: number[], questionNumber: number) => {
        const sortedUser = (userAnswer || []).sort();
        const sortedCorrect = q.correctAnswers.sort();
        const isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
        return (
            <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
                <div className="font-semibold mb-2">{questionNumber}. {q.question[language]}</div>
                <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                        const isUserAnswer = sortedUser.includes(optIndex);
                        const isCorrectAnswer = sortedCorrect.includes(optIndex);
                        let classes = 'border p-2 rounded-md ';
                        if (isCorrectAnswer) classes += 'bg-green-200 border-green-500';
                        if (isUserAnswer && !isCorrectAnswer) classes += 'bg-red-200 border-red-500';
                        return <div key={optIndex} className={classes}>{opt[language]}</div>;
                    })}
                </div>
                {!isCorrect && q.explanation && (
                    <div className="mt-2 pt-2 border-t text-sm">
                        <span className="font-bold">{translations[language].explanation_title}:</span> {q.explanation[language]}
                    </div>
                )}
            </div>
        );
    };
    
    const renderFillInReview = (q: FillInQuestion, userAnswer: Record<number, string>, questionNumber: number) => {
        return (
             <div key={q.id} className="p-4 rounded-lg border border-gray-300 bg-gray-50">
                <div className="font-semibold mb-2">{questionNumber}. {q.question[language]}</div>
                {q.image && <div className="my-2 flex justify-center"><img src={q.image} alt={q.alt?.[language]} className="rounded-lg max-w-sm h-auto"/></div>}
                <div className="space-y-2 text-sm">
                    {q.labels.map(label => {
                        const userEntry = userAnswer?.[label.id] || '—';
                        const correctEntry = label.correct[language];
                        const isCorrect = userEntry.toLowerCase() === correctEntry.toLowerCase();
                        return (
                            <div key={label.id}>
                                <span className="font-bold">{label.id}. {translations[language].your_answer}:</span>
                                <span className={isCorrect ? 'text-green-600' : 'text-red-600'}> {userEntry} {isCorrect ? '✓' : '✗'}</span>
                                {!isCorrect && (
                                    <>
                                        <br/>
                                        <span className="font-bold">{translations[language].correct_answer}:</span> 
                                        <span className="text-green-700"> {correctEntry}</span>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
             </div>
        )
    };
    
    const renderOrderingReview = (q: OrderingQuestion, userAnswer: Record<number, number[]>, questionNumber: number) => {
        return(
            <div key={q.id} className="p-4 rounded-lg border border-gray-300 bg-gray-50">
                <div className="font-semibold mb-2">{questionNumber}. {q.question[language]}</div>
                {q.sub_questions.map((sub, subIndex) => {
                    const userOrderIds = userAnswer?.[subIndex] || [];
                    return (
                        <div key={subIndex}>
                            <div className="font-medium mt-3 mb-1">{sub.title[language]}</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <h5 className="font-bold mb-1">{translations[language].your_answer}:</h5>
                                    <div className="space-y-1">
                                    {userOrderIds.map((stepId, pos) => {
                                        const stepText = sub.steps.find(s => s.id === stepId)?.text[language] || 'N/A';
                                        const isCorrect = stepId === pos;
                                        return <div key={pos} className={`p-2 border-l-4 ${isCorrect ? 'border-green-400' : 'border-red-400'} bg-white rounded-r-md`}>{pos + 1}. {stepText}</div>;
                                    })}
                                    {userOrderIds.length === 0 && <p>No answer.</p>}
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-bold mb-1">{translations[language].correct_answer}:</h5>
                                    <div className="space-y-1">
                                    {sub.steps.map((step, pos) => (
                                        <div key={pos} className="p-2 border-l-4 border-gray-300 bg-white rounded-r-md">{pos + 1}. {step.text[language]}</div>
                                    ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )
    };


    let questionCounter = 0;
    let currentPart = '';

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-2">{translations[language].results_title}</h2>

            {levelUp && character && (
                <div className="p-4 mb-4 text-center bg-yellow-100 border-2 border-yellow-400 rounded-lg animate-pulse">
                    <h3 className="font-bold text-yellow-800 text-xl">LEVEL UP!</h3>
                    <p className="text-yellow-700">{character.name} has been promoted to Level {gameState.characterLevel}!</p>
                </div>
            )}
             {gameState.currentHP <= 0 && (
                <div className="p-4 mb-4 text-center bg-red-100 border-2 border-red-400 rounded-lg">
                    <h3 className="font-bold text-red-800 text-xl">Credibility Lost!</h3>
                    <p className="text-red-700">Your case progress has been set back by 15%.</p>
                </div>
            )}

            <p className="text-2xl text-center font-semibold mb-6">
                {translations[language].score_prefix} {score} {translations[language].score_suffix} {total} ({total > 0 ? Math.round((score / total) * 100) : 0}%)
            </p>
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-6">
                {allQuestions.map((q) => {
                    if (q.part !== currentPart) {
                        currentPart = q.part;
                        questionCounter = 0;
                        return (
                           <React.Fragment key={`${q.part}-header`}>
                             <h3 className="text-xl font-bold mt-6 mb-2 border-b-2 border-blue-200 pb-1 sticky top-0 bg-white/90 py-2">
                               {translations[language][`${q.part}_title`]}
                             </h3>
                             {renderReview(q, ++questionCounter)}
                           </React.Fragment>
                        );
                    }
                    return renderReview(q, ++questionCounter);
                })}
            </div>
            <div className="mt-8 flex justify-center gap-4">
                <button
                    onClick={handleRestart}
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition shadow-md"
                >
                    {translations[language].restart_button}
                </button>
                <button
                    onClick={handleMenu}
                    className="bg-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-600 transition shadow-md"
                >
                    {translations[language].back_to_menu}
                </button>
            </div>
        </div>
    );
};

export default ResultsScreen;

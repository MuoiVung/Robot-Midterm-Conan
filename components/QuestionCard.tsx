
import React, { useState } from 'react';
import type { Question, SelectQuestion, FillInQuestion, OrderingQuestion, UserAnswer } from '../types';
import { useAppContext } from '../context/AppContext';
import { useGameContext } from '../context/GameContext';
import { translations } from '../services/quizData';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    progressPerCorrectAnswer: number;
    // Fix: Added optional isSolved prop to disable card when answered in story mode
    isSolved?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, progressPerCorrectAnswer, isSolved = false }) => {
    const { mode, language, userAnswers, updateUserAnswer } = useAppContext();
    const { applyAnswerEffect } = useGameContext();
    const userAnswer = userAnswers[question.id];

    // For OrderingQuestion drag-and-drop
    const [draggedItem, setDraggedItem] = useState<{ subIndex: number; stepId: number } | null>(null);

    const renderSelectQuestion = (q: SelectQuestion) => {
        const selectedOptions = (userAnswer as number[]) || [];

        const handleSelect = (optionIndex: number) => {
            let newSelection: number[];
            if (q.type === 'single-select') {
                newSelection = [optionIndex];
                const isCorrect = q.correctAnswers.includes(optionIndex);
                if (mode === 'test') {
                    // Only apply effect if it's the first time answering this question
                    if (!userAnswer) {
                        applyAnswerEffect(isCorrect, progressPerCorrectAnswer);
                    }
                }
            } else { // multi-select
                newSelection = selectedOptions.includes(optionIndex)
                    ? selectedOptions.filter(i => i !== optionIndex)
                    : [...selectedOptions, optionIndex];
            }
            updateUserAnswer(q.id, newSelection);
        };
        
        const isAnswered = selectedOptions.length > 0;
        const showExplanation = mode === 'study' && isAnswered;

        let isCorrect = false;
        if (isAnswered) {
             const sortedUser = [...selectedOptions].sort();
             const sortedCorrect = [...q.correctAnswers].sort();
             isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
        }

        return (
            <div>
                <p className="mb-4">{q.question[language]}</p>
                <div className="space-y-3">
                    {q.options.map((option, index) => {
                        const isSelected = selectedOptions.includes(index);
                        const isCorrectAnswer = q.correctAnswers.includes(index);
                        let optionClass = "w-full text-left p-3 border rounded-lg transition cursor-pointer flex items-center";

                        if (mode === 'study' && isAnswered) {
                            if (isCorrectAnswer) {
                                optionClass += " bg-green-100 border-green-400";
                            } else if (isSelected && !isCorrectAnswer) {
                                optionClass += " bg-red-100 border-red-400";
                            } else {
                                optionClass += " bg-white border-gray-300 hover:bg-gray-50";
                            }
                        } else {
                             optionClass += isSelected ? " bg-blue-100 border-blue-400" : " bg-white border-gray-300 hover:bg-gray-50";
                        }
                        
                        return (
                            <label key={index} className={optionClass}>
                                <input
                                    type={q.type === 'single-select' ? 'radio' : 'checkbox'}
                                    name={q.id}
                                    checked={isSelected}
                                    onChange={() => handleSelect(index)}
                                    className="mr-3 h-5 w-5"
                                    disabled={isSolved}
                                />
                                {option[language]}
                            </label>
                        );
                    })}
                </div>
                {showExplanation && (
                     <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                        <h4 className="font-bold">{translations[language].explanation_title}</h4>
                        <p>{q.explanation[language]}</p>
                    </div>
                )}
            </div>
        );
    };
    
    const renderFillInQuestion = (q: FillInQuestion) => {
        const userEntries = (userAnswer as Record<number, string>) || {};

        const handleInputChange = (labelId: number, value: string) => {
            const newEntries = { ...userEntries, [labelId]: value };
            updateUserAnswer(q.id, newEntries);
        };

        const handleBlur = (labelId: number, value: string) => {
            if (mode === 'test' && value.trim() !== '') {
                const isCorrect = value.toLowerCase().trim() === q.labels.find(l => l.id === labelId)?.correct[language].toLowerCase().trim();
                applyAnswerEffect(isCorrect, progressPerCorrectAnswer);
            }
        }

        return (
            <div>
                <p className="mb-4">{q.question[language]}</p>
                {q.image && <div className="my-4 flex justify-center"><img src={q.image} alt={q.alt?.[language]} className="rounded-lg max-w-md w-full h-auto"/></div>}
                <div className="space-y-4">
                    {q.labels.map(label => {
                         const userEntry = userEntries[label.id] || '';
                         const isAnswered = userEntry.length > 0;
                         const showStudyFeedback = mode === 'study' && isAnswered;
                         const isCorrect = showStudyFeedback && userEntry.toLowerCase().trim() === label.correct[language].toLowerCase().trim();
                        return (
                            <div key={label.id}>
                                <label className="flex items-center space-x-3">
                                    <span className="font-bold">{label.id}.</span>
                                    <input
                                        type="text"
                                        value={userEntry}
                                        onChange={(e) => handleInputChange(label.id, e.target.value)}
                                        onBlur={(e) => handleBlur(label.id, e.target.value)}
                                        className={`flex-grow p-2 border rounded-md ${showStudyFeedback ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-gray-300'}`}
                                        disabled={(mode==='test' && userAnswer && (userAnswer as Record<number,string>)[label.id] !== undefined) || isSolved}
                                    />
                                </label>
                                {showStudyFeedback && !isCorrect && (
                                     <p className="text-sm text-green-700 mt-1">
                                        {translations[language].correct_answer}: {label.correct[language]}
                                     </p>
                                )}
                            </div>
                        )
                    })}
                </div>
                 {mode === 'study' && q.explanation && <div className="mt-4 p-3 rounded-lg bg-blue-50 text-sm"><h4 className="font-bold">{translations[language].explanation_title}</h4><p>{q.explanation[language]}</p></div>}
            </div>
        );
    };

    const renderOrderingQuestion = (q: OrderingQuestion) => {
        const userOrders = (userAnswer as Record<number, number[]>) || {};
        
        const handleDrop = (subIndex: number, position: number) => {
            if (!draggedItem || draggedItem.subIndex !== subIndex) return;

            const currentOrder = userOrders[subIndex] || q.sub_questions[subIndex].steps.map(s => s.id);
            const draggedItemIndex = currentOrder.indexOf(draggedItem.stepId);
            
            const newOrder = [...currentOrder];
            newOrder.splice(draggedItemIndex, 1);
            newOrder.splice(position, 0, draggedItem.stepId);
            
            updateUserAnswer(q.id, { ...userOrders, [subIndex]: newOrder });

            if (mode === 'test') {
                const droppedItemCorrect = newOrder[position] === position;
                const wasCorrectBefore = currentOrder[draggedItemIndex] === draggedItemIndex;

                if (droppedItemCorrect && !wasCorrectBefore) {
                    applyAnswerEffect(true, progressPerCorrectAnswer);
                } else if (!droppedItemCorrect && wasCorrectBefore) {
                    applyAnswerEffect(false, 0); // Don't penalize for progress loss, just HP
                }
            }
            
            setDraggedItem(null);
        };

        return (
            <div>
                 <p className="mb-4">{q.question[language]}</p>
                 {q.sub_questions.map((sub, subIndex) => {
                     const currentOrderIds = userOrders[subIndex] || sub.steps.map(s => s.id);
                     const isAnswered = !!userOrders[subIndex];
                     const showStudyFeedback = mode === 'study' && isAnswered;

                     return (
                         <div key={subIndex} className="mt-4">
                             <h4 className="font-semibold mb-2">{sub.title[language]}</h4>
                             <div className="space-y-2">
                                 {currentOrderIds.map((stepId, index) => {
                                     const step = sub.steps.find(s => s.id === stepId);
                                     if (!step) return null;

                                     const isCorrectPosition = step.id === index;
                                     let itemClass = "p-3 border rounded-lg bg-white flex items-center justify-between";
                                     if (!isSolved) {
                                        itemClass += " cursor-grab";
                                     }
                                     if (showStudyFeedback) {
                                         itemClass += isCorrectPosition ? " border-green-500" : " border-red-500";
                                     }

                                     return (
                                        <div
                                            key={step.id}
                                            draggable={!isSolved}
                                            onDragStart={() => !isSolved && setDraggedItem({ subIndex, stepId: step.id })}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => !isSolved && handleDrop(subIndex, index)}
                                            onDragEnter={(e) => e.preventDefault()}
                                            className={itemClass}
                                        >
                                            <span>{step.text[language]}</span>
                                            <span className="text-gray-400">☰</span>
                                        </div>
                                     )
                                 })}
                             </div>
                             {showStudyFeedback && (
                                <div className="mt-4">
                                     <h5 className="font-bold">{translations[language].correct_answer}:</h5>
                                     <div className="space-y-1 text-sm">
                                         {sub.steps.map((step, pos) => (
                                             <div key={pos} className="p-2 bg-green-50 rounded-md">{pos + 1}. {step.text[language]}</div>
                                         ))}
                                     </div>
                                </div>
                             )}
                         </div>
                     );
                 })}
            </div>
        );
    };

    const renderContent = () => {
        switch (question.type) {
            case 'single-select':
            case 'multi-select':
                return renderSelectQuestion(question);
            case 'fill-in':
                return renderFillInQuestion(question);
            case 'ordering':
                return renderOrderingQuestion(question);
            default:
                return <div>Unsupported question type</div>;
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-blue-600 mb-4">
                Question {questionNumber}
            </h3>
            {renderContent()}
        </div>
    );
};

export default QuestionCard;

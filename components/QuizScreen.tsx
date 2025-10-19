import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { getAllQuestions } from '../services/quizData';
import { translations } from '../services/quizData';
import QuestionCard from './QuestionCard';
import type { Question } from '../types';
import GameUI from './GameUI';

const QuizScreen: React.FC = () => {
  const { setScreen, mode, language } = useAppContext();
  const allQuestions = getAllQuestions();

  const totalCorrectAnswers = useMemo(() => {
    return allQuestions.reduce((count, q) => {
        if (q.type === 'fill-in') {
            return count + q.labels.length;
        }
        if (q.type === 'ordering') {
            return count + q.sub_questions.reduce((subCount, sub) => subCount + sub.steps.length, 0);
        }
        return count + 1; // For single/multi-select
    }, 0);
  }, [allQuestions]);

  const questionsByPart = useMemo(() => {
    return allQuestions.reduce<Record<string, Question[]>>((acc, question) => {
      (acc[question.part] = acc[question.part] || []).push(question);
      return acc;
    }, {});
  }, [allQuestions]);

  const handleBackToMenu = () => {
    setScreen('menu');
  };
  
  const handleSubmit = () => {
      setScreen('results');
  }

  return (
    <div id="quiz-container">
      {mode === 'test' && <GameUI />}
      <div className="sticky top-0 z-20 bg-gray-100/80 backdrop-blur-sm p-4 rounded-b-xl shadow-md mb-6 -mx-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            onClick={handleBackToMenu}
            className="bg-white px-4 py-2 rounded-lg shadow-md font-semibold text-gray-700 hover:bg-gray-200 transition"
          >
            {translations[language].back_to_menu}
          </button>
          <h2 className="text-2xl font-bold text-gray-700 hidden sm:block">
            {translations[language][`${mode}_mode`]}
          </h2>
          {mode === 'test' && (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-green-600 transition shadow-md"
            >
              {translations[language].submit_button}
            </button>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {Object.entries(questionsByPart).map(([part, questions]) => (
          <div key={part}>
            <h3 className="text-2xl font-bold mt-8 mb-4 border-b-2 border-blue-300 pb-2">
              {translations[language][`${part}_title`]}
            </h3>
            <div className="space-y-6">
              {questions.map((q, index) => (
                <QuestionCard 
                    key={q.id} 
                    question={q} 
                    questionNumber={index + 1}
                    progressPerCorrectAnswer={100 / totalCorrectAnswers}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizScreen;

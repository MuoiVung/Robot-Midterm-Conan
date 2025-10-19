// Fix: Define all necessary types for the application.
export type Language = 'en' | 'vi';

export interface TranslatedText {
    en: string;
    vi: string;
}

interface BaseQuestion {
    id: string;
    part: string;
    question: TranslatedText;
    explanation?: TranslatedText;
    image?: string;
    alt?: TranslatedText;
}

export interface SelectQuestion extends BaseQuestion {
    type: 'single-select' | 'multi-select';
    options: TranslatedText[];
    correctAnswers: number[];
}

export interface FillInQuestion extends BaseQuestion {
    type: 'fill-in';
    labels: {
        id: number;
        correct: TranslatedText;
    }[];
}

export interface OrderingQuestion extends BaseQuestion {
    type: 'ordering';
    sub_questions: {
        title: TranslatedText;
        steps: {
            id: number;
            text: TranslatedText;
        }[];
    }[];
}

export type Question = SelectQuestion | FillInQuestion | OrderingQuestion;

export type UserAnswer = number[] | Record<number, string> | Record<number, number[]> | undefined;

export type UserAnswers = Record<string, UserAnswer>;

// Story related types
export interface NarrativeScene {
    type: 'narrative';
    characterId: 'conan' | 'haibara' | 'hattori' | 'megure' | 'takagi' | 'sato';
    dialogue: TranslatedText;
}

export interface QuestionScene {
    type: 'question';
    questionId: string;
    prompt: TranslatedText;
}

export interface ConclusionScene {
    type: 'conclusion';
    title: TranslatedText;
    summary: TranslatedText;
}

export type Scene = NarrativeScene | QuestionScene | ConclusionScene;

export interface StoryChapter {
    id: string;
    title: TranslatedText;
    description: TranslatedText;
    scenes: Scene[];
}

export interface StoryCharacter {
    id: string;
    name: string;
    image: string;
}

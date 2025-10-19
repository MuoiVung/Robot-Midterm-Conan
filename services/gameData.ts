// Character image assets will be managed by the bundler.
// For this example, we assume they are in the public/assets directory.

export interface Character {
  id: 'conan' | 'haibara' | 'hattori';
  name: string;
  description: string;
  images: {
    level1: string;
    level2: string;
    level3: string;
  };
}

export interface GameState {
  selectedCharacterId: Character['id'] | null;
  characterLevel: number; // 1, 2, or 3
  perfectRuns: number;
  currentHP: number;
  caseProgress: number; // 0-100
  currentChapterIndex: number;
  currentSceneIndex: number;
}


export const CHARACTERS: Character[] = [
  {
    id: 'conan',
    name: 'Conan Edogawa',
    description: 'A brilliant young detective with a keen eye for detail.',
    images: {
      level1: 'https://i.postimg.cc/zvXt0C1b/conan.jpg',
      level2: 'https://i.postimg.cc/zvXt0C1b/conan.jpg',
      level3: 'https://i.postimg.cc/zvXt0C1b/conan.jpg',
    },
  },
  {
    id: 'haibara',
    name: 'Ai Haibara',
    description: 'A cool-headed scientist whose logic is second to none.',
    images: {
      level1: 'https://i.postimg.cc/MKH3BmDr/haibara.jpg',
      level2: 'https://i.postimg.cc/MKH3BmDr/haibara.jpg',
      level3: 'https://i.postimg.cc/MKH3BmDr/haibara.jpg',
    },
  },
  {
    id: 'hattori',
    name: 'Heiji Hattori',
    description: 'The hot-blooded high school detective from Osaka.',
    images: {
      level1: 'https://i.postimg.cc/9Qqx8XsB/hatorri.png',
      level2: 'https://i.postimg.cc/9Qqx8XsB/hatorri.png',
      level3: 'https://i.postimg.cc/9Qqx8XsB/hatorri.png',
    },
  },
];
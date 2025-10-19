
import type { StoryChapter, StoryCharacter } from '../types';

// Define characters that appear in the story dialogues
export const storyCharacters: StoryCharacter[] = [
  { id: 'conan', name: 'Conan Edogawa', image: 'https://i.postimg.cc/zvXt0C1b/conan.jpg' },
  { id: 'haibara', name: 'Ai Haibara', image: 'https://i.postimg.cc/MKH3BmDr/haibara.jpg' },
  { id: 'hattori', name: 'Heiji Hattori', image: 'https://i.postimg.cc/9Qqx8XsB/hatorri.png' },
  { id: 'megure', name: 'Inspector Megure', image: 'https://i.postimg.cc/Y0yFpSct/megure.jpg' },
  { id: 'takagi', name: 'Officer Takagi', image: 'https://i.postimg.cc/prgLhBWM/takagi.jpg' },
  { id: 'sato', name: 'Officer Sato', image: 'https://i.postimg.cc/zXN0x74q/sato.jpg' },
];

// Helper function to get character data by ID
export const getCharacterById = (id: string): StoryCharacter => {
    const character = storyCharacters.find(c => c.id === id);
    if (!character) {
        // Return a default/fallback character to avoid crashes
        return { id: 'unknown', name: 'Unknown', image: '' };
    }
    return character;
};

// Define the story chapters and their scenes
export const storyChapters: StoryChapter[] = [
    {
        id: 'chapter1',
        title: { en: 'Chapter 1: The Case of the Missing Manual', vi: 'Chương 1: Vụ án Sổ tay bị mất' },
        description: { en: 'A crucial robot manual has vanished from the lab right before a major competition. Find the clues to locate it!', vi: 'Một cuốn sổ tay robot quan trọng đã biến mất khỏi phòng thí nghiệm ngay trước một cuộc thi lớn. Hãy tìm manh mối để xác định vị trí của nó!' },
        scenes: [
            {
                type: 'narrative',
                characterId: 'megure',
                dialogue: { en: "A crisis! The manual for the new VT-series robot is gone! We can't proceed with the competition preparations without it.", vi: 'Một cuộc khủng hoảng! Sổ tay hướng dẫn cho robot dòng VT mới đã biến mất! Chúng ta không thể tiếp tục chuẩn bị cho cuộc thi nếu không có nó.' },
            },
            {
                type: 'narrative',
                characterId: 'conan',
                dialogue: { en: "Don't worry, Inspector. Let's examine the facts. First, we need to know everything about the different types of robots in this lab.", vi: 'Đừng lo, thanh tra. Hãy xem xét các sự kiện. Trước tiên, chúng ta cần biết mọi thứ về các loại robot khác nhau trong phòng thí nghiệm này.' },
            },
            {
                type: 'question',
                questionId: 'p1q1', // This ID must exist in quizData.ts
                prompt: { en: "Let's start with the basics. If we can correctly identify which robot series doesn't belong with the others, we might find our first lead.", vi: 'Hãy bắt đầu với những điều cơ bản. Nếu chúng ta có thể xác định chính xác dòng robot nào không thuộc nhóm còn lại, chúng ta có thể tìm thấy manh mối đầu tiên.' },
            },
            {
                type: 'narrative',
                characterId: 'haibara',
                dialogue: { en: 'Excellent deduction. The G-series are SCARA robots, not 6-Axis. This means the manual was likely misplaced near the SCARA robot station, not the ProSix station.', vi: 'Suy luận xuất sắc. Dòng G là robot SCARA, không phải 6 trục. Điều này có nghĩa là cuốn sổ tay có thể đã bị đặt nhầm gần trạm robot SCARA, không phải trạm ProSix.' },
            },
            {
                type: 'conclusion',
                title: { en: 'Case Solved!', vi: 'Vụ án đã được giải quyết!' },
                summary: { en: 'By identifying the G-series as a SCARA robot, you narrowed down the search area and located the misplaced manual, saving the competition. Great work, detective!', vi: 'Bằng cách xác định dòng G là robot SCARA, bạn đã thu hẹp khu vực tìm kiếm và xác định vị trí cuốn sổ tay bị đặt sai chỗ, cứu vãn cuộc thi. Làm tốt lắm, thám tử!' },
            }
        ]
    },
    {
        id: 'chapter2',
        title: { en: 'Chapter 2: The Sabotaged Power Supply', vi: 'Chương 2: Nguồn điện bị phá hoại' },
        description: { en: 'A robot malfunctions during a critical test. Was it an accident, or sabotage? Investigate the power supply specifications.', vi: 'Một robot gặp trục trặc trong một bài kiểm tra quan trọng. Đó là tai nạn hay phá hoại? Hãy điều tra thông số kỹ thuật của nguồn điện.' },
        scenes: [
            {
                type: 'narrative',
                characterId: 'sato',
                dialogue: { en: 'The C4 robot just powered down unexpectedly! We need to figure out what went wrong with its power supply before we can continue.', vi: 'Robot C4 vừa tắt nguồn đột ngột! Chúng ta cần tìm ra điều gì đã xảy ra với nguồn điện của nó trước khi có thể tiếp tục.' },
            },
            {
                type: 'question',
                questionId: 'p2q12',
                prompt: { en: 'Look at the power supply specifications for the RC180 controller. One of these details is incorrect. Find the error to understand the problem.', vi: 'Hãy xem thông số kỹ thuật của nguồn điện cho bộ điều khiển RC180. Một trong những chi tiết này không chính xác. Hãy tìm ra lỗi để hiểu vấn đề.' },
            },
            {
                type: 'narrative',
                characterId: 'takagi',
                dialogue: { en: 'You found it! The specs say three-phase, but the RC180 uses a single-phase supply. Someone must have connected the wrong power source!', vi: 'Bạn đã tìm ra rồi! Thông số kỹ thuật nói là ba pha, nhưng RC180 sử-dụng nguồn một pha. Ai đó chắc chắn đã kết nối sai nguồn điện!' },
            },
            {
                type: 'conclusion',
                title: { en: 'Case Solved!', vi: 'Vụ án đã được giải quyết!' },
                summary: { en: 'You correctly identified that the robot was connected to the wrong power source (single-phase vs. three-phase), preventing further damage. The saboteur has been caught.', vi: 'Bạn đã xác định chính xác rằng robot đã được kết nối sai nguồn điện (một pha so với ba pha), ngăn ngừa thiệt hại thêm. Kẻ phá hoại đã bị bắt.' },
            }
        ]
    }
];

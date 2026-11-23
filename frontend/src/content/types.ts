export type HouseId = 'python' | 'mysql' | 'ai' | 'network' | 'multimedia';

export interface QuizQ { q: string; options: string[]; answer: number; explain: string; code?: string }

export interface Topic {
  id: string;
  house: 'python' | 'mysql';
  title: string;
  emoji: string;
  /** 1. STORY */
  story: { title: string; lines: string[]; pictures: string[] };
  /** 2. WATCH: key in animations/registry */
  animation: string;
  /** 3. PLAY */
  play: {
    task: string;
    starter: string;
    /** hidden SQL run before the student's code (MySQL topics) */
    setup?: string;
    /** sample lines for the Input box (Python topics using input()) */
    stdin?: string;
    /** show the live indentation-boxes view under the editor */
    indentBoxes?: boolean;
  };
  hints: [string, string, string];
  mistake: { wrong: string; right: string; why: string };
  seeTip: string;
  quiz: [QuizQ, QuizQ, QuizQ];
  badge: { emoji: string; name: string };
}

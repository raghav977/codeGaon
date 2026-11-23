import type { HouseId, Topic } from './types';
import { pythonTopics } from './python';
import { mysqlTopics } from './mysql';

export interface House {
  id: HouseId; name: string; emoji: string; tagline: string; color: string; roof: string; unlocked: boolean;
}

export const houses: House[] = [
  { id: 'python', name: 'Python House', emoji: '🐍', tagline: 'The Momo Factory', color: 'bg-yellow-300', roof: 'border-b-orange-500', unlocked: true },
  { id: 'mysql', name: 'MySQL House', emoji: '🗄️', tagline: 'The School Register', color: 'bg-sky-300', roof: 'border-b-blue-600', unlocked: true },
  { id: 'ai', name: 'AI & Tech House', emoji: '🤖', tagline: 'Smart machines', color: 'bg-violet-300', roof: 'border-b-violet-600', unlocked: false },
  { id: 'network', name: 'Networking House', emoji: '🌐', tagline: 'Talking computers', color: 'bg-emerald-300', roof: 'border-b-emerald-700', unlocked: false },
  { id: 'multimedia', name: 'Multimedia House', emoji: '🎬', tagline: 'Pictures, sound, video', color: 'bg-pink-300', roof: 'border-b-pink-600', unlocked: false },
];

export const topicsByHouse: Record<string, Topic[]> = { python: pythonTopics, mysql: mysqlTopics };
export const allTopics: Topic[] = [...pythonTopics, ...mysqlTopics];
export const findTopic = (id: string) => allTopics.find((t) => t.id === id);

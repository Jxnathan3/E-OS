import { create } from 'zustand';

export interface DailyTask {
  id: string;
  title: string;
  category: 'routine' | 'work' | 'health' | 'study' | 'discipline';
  completed: boolean;
  rescheduledTo?: string;
}

export interface DayRecord {
  date: string; // ISO String
  tasks: DailyTask[];
  productivityScore: number;
  disciplineScore: number;
  focusScore: number;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'motivational' | 'error';
  timestamp: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetMetric: string;
  targetValue?: number;
  currentValue?: number;
  type: 'short-term' | 'long-term';
  deadline: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: number;
  progress: number;
}

export interface JournalEntry {
  id: string;
  content: string;
  date: number;
  analysis?: {
    emotionalPattern: string;
    stressIndicator: 'low' | 'medium' | 'high';
    mindsetShift: string;
    confidenceScore: number; // 1-10
  };
}

interface AppState {
  tasks: DailyTask[];
  goals: Goal[];
  journalEntries: JournalEntry[];
  productivity: number;
  discipline: number;
  focus: number;
  userName: string;
  xp: number;
  level: number;
  streak: number;
  updateTask: (id: string, completed: boolean) => void;
  rescheduleTask: (id: string, date: string) => void;
  addTask: (title: string, category: DailyTask['category']) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'status' | 'createdAt' | 'progress' | 'currentValue'>) => void;
  updateGoalStatus: (id: string, status: Goal['status']) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  updateGoalMetricValue: (id: string, value: number) => void;
  deleteGoal: (id: string) => void;
  addJournalEntry: (content: string, analysis?: JournalEntry['analysis']) => void;
  setUserName: (name: string) => void;
  metrics: { name: string; focus: number; discipline: number }[];
  notifications: AppNotification[];
  addNotification: (message: string, type: AppNotification['type']) => void;
  dismissNotification: (id: string) => void;
  addXp: (amount: number) => void;
}

const initialTasks: DailyTask[] = [
  { id: '1', title: 'Wake up 5:00 AM', category: 'routine', completed: true },
  { id: '2', title: 'Cold Shower & Hydrate', category: 'routine', completed: true },
  { id: '3', title: 'Deep Work Session (90m)', category: 'work', completed: false },
  { id: '4', title: 'Gym - Hypertrophy', category: 'health', completed: false },
  { id: '5', title: 'Read 20 pages', category: 'study', completed: false },
  { id: '6', title: 'Zero Social Media', category: 'discipline', completed: false },
];

export const useStore = create<AppState>((set) => ({
  tasks: initialTasks,
  goals: [],
  journalEntries: [],
  productivity: 87,
  discipline: 92,
  focus: 74,
  userName: 'OPERATIVE_01',
  xp: 450,
  level: 3,
  streak: 5,
  metrics: [
    { name: 'Mon', focus: 40, discipline: 55 },
    { name: 'Tue', focus: 60, discipline: 65 },
    { name: 'Wed', focus: 55, discipline: 70 },
    { name: 'Thu', focus: 85, discipline: 80 },
    { name: 'Fri', focus: 75, discipline: 85 },
    { name: 'Sat', focus: 90, discipline: 95 },
    { name: 'Sun', focus: 95, discipline: 100 },
  ],
  updateTask: (id, completed) => set((state) => {
    const newTasks = state.tasks.map(t => t.id === id ? { ...t, completed } : t);
    const completedCount = newTasks.filter(t => t.completed).length;
    const progress = Math.round((completedCount / newTasks.length) * 100);
    
    // Add XP if newly completed
    const taskWasCompleted = state.tasks.find(t => t.id === id)?.completed;
    let newXp = state.xp;
    if (completed && !taskWasCompleted) {
      newXp += 10;
    } else if (!completed && taskWasCompleted) {
      newXp = Math.max(0, newXp - 10);
    }
    
    const newLevel = Math.floor(newXp / 200) + 1;

    return {
      tasks: newTasks,
      discipline: 50 + (progress / 2), // mock dynamic score change
      xp: newXp,
      level: newLevel
    };
  }),
  rescheduleTask: (id, date) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, rescheduledTo: date } : t)
  })),
  addTask: (title, category) => set((state) => {
    const newTask: DailyTask = {
      id: Math.random().toString(36).substring(7),
      title,
      category,
      completed: false,
    };
    return {
      tasks: [...state.tasks, newTask]
    };
  }),
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, { ...goal, id: Math.random().toString(36).substring(7), status: 'active', createdAt: Date.now(), progress: 0, currentValue: goal.targetValue !== undefined ? 0 : undefined }]
  })),
  updateGoalStatus: (id, status) => set((state) => {
    const goalWasCompleted = state.goals.find(g => g.id === id)?.status === 'completed';
    let newXp = state.xp;
    
    if (status === 'completed' && !goalWasCompleted) {
      newXp += 50;
    } else if (status !== 'completed' && goalWasCompleted) {
      newXp = Math.max(0, newXp - 50);
    }
    
    const newLevel = Math.floor(newXp / 200) + 1;

    return {
      goals: state.goals.map(g => g.id === id ? { ...g, status } : g),
      xp: newXp,
      level: newLevel
    };
  }),
  updateGoalProgress: (id, progress) => set((state) => ({
    goals: state.goals.map(g => g.id === id ? { ...g, progress } : g)
  })),
  updateGoalMetricValue: (id, value) => set((state) => {
    return {
      goals: state.goals.map(g => {
        if (g.id === id) {
          const target = g.targetValue || 1;
          const progress = Math.min(100, Math.max(0, Math.round((value / target) * 100)));
          return { ...g, currentValue: value, progress };
        }
        return g;
      })
    };
  }),
  deleteGoal: (id) => set((state) => ({
    goals: state.goals.filter(g => g.id !== id)
  })),
  addJournalEntry: (content, analysis) => set((state) => ({
    journalEntries: [{ id: Math.random().toString(36).substring(7), content, date: Date.now(), analysis }, ...state.journalEntries]
  })),
  setUserName: (name) => set({ userName: name }),
  notifications: [],
  addNotification: (message, type) => set((state) => ({
    notifications: [...state.notifications, { id: Math.random().toString(36).substring(7), message, type, timestamp: Date.now() }]
  })),
  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    const newLevel = Math.floor(newXp / 200) + 1;
    return { xp: newXp, level: newLevel };
  }),
}));

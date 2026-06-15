export interface Student {
  id: number;
  name: string;
  code: string;
  field: string;
  grade: string;
  city?: string | null;
  age?: number | null;
  mainGoal?: string | null;
  subscriptionType?: string | null;
  currentTraz?: number | null;
  targetTraz?: number | null;
  studyHoursPerDay?: number | null;
  academicProfile?: {
    currentTraz?: number;
    targetTraz?: number;
    studyHoursPerDay?: number;
  };
}

export interface TestTrap {
  id: string;
  questionTitle: string;
  subject: string;
  category: string;
  trapType: string;
  correctAnswer: string;
  userMistake: string;
  educationalNote: string;
  importance: "high" | "medium" | "low";
  createdAt: string;
}

export interface SystemLog {
  id: string;
  action: string;
  username: string;
  timestamp: string;
  detail: string;
}

export interface DailyPlan {
  day: string;
  morningPlan: string;
  afternoonPlan: string;
  totalQuestions: number;
  completed: boolean;
}

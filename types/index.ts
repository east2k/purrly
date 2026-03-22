export type MoodOption = {
  emoji: string;
  label: string;
};

export type Comment = {
  id: number;
  text: string;
  timestamp: number;
};

export type Post = {
  id: number;
  text: string;
  mood: string | null;
  commentsEnabled: boolean;
  comments: Comment[];
  timestamp: number;
  anonymous: boolean;
};

export type SelfCareKey = "water" | "sleep";

export type SelfCareConfig = {
  label: string;
  icon: string;
  goal: number;
  unit: string;
};

export type CareState = Record<SelfCareKey, number>;

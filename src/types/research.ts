
export interface ResearchData {
  product: string;
  targetAudience: string;
  ageRange: string;
  gender: string;
  occupation: string;
  additionalContext: string;
}

export interface CloneProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  personality: string;
  avatar: string;
  background: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'open' | 'rating' | 'choice';
}

export interface Response {
  cloneId: string;
  questionId: string;
  answer: string;
  reasoning?: string;
}

export type AcademicLevel = 'High School' | 'Bachelor' | 'Master' | 'PhD';

export interface Scholarship {
  id: string;
  title: string;
  country: string;
  level: AcademicLevel;
  gpaRequired: number;
  deadline: string;
  description: string;
  link: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  tags: string[];
  context: string;
  objective: string;
  solution: string;
  result: string;
  imageSeed: number;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  details: string[];
  iconName: 'users' | 'compass' | 'rocket';
  color: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HOME = 'home',
  SERVICES = 'services',
  PORTFOLIO = 'portfolio',
  CONTACT = 'contact'
}
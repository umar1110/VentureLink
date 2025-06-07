export interface User {
  id: string;
  name: string;
  email: string;
  role: 'entrepreneur' | 'investor';
  avatar?: string;
}

export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  industry: string;
  targetMarket: string;
  uniqueSellingProposition: string;
  problem: string;
  solution: string;
  traction: string;
  businessModel: string;
  teamDescription: string;
  fundingRequired: number;
  equityOffered: number;
  createdAt: string;
  userId: string;
  userName: string;
  status: 'pending' | 'evaluated' | 'connected';
  score?: number;
  evaluationDetails?: EvaluationDetails;
}

export interface EvaluationDetails {
  overallScore: number;
  categories: {
    marketFit: number;
    scalability: number;
    innovation: number;
    teamCapability: number;
    financialViability: number;
    investmentPotential: number;
  };
  feedback: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'entrepreneur' | 'investor';
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SubmitIdeaFormData {
  title: string;
  description: string;
  industry: string;
  targetMarket: string;
  uniqueSellingProposition: string;
  problem: string;
  solution: string;
  traction: string;
  businessModel: string;
  teamDescription: string;
  fundingRequired: number;
  equityOffered: number;
}
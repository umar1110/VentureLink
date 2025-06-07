import { BusinessIdea, SubmitIdeaFormData } from '../types';

// Mock data
const MOCK_IDEAS: BusinessIdea[] = [
  {
    id: 'idea-1',
    title: 'EcoDelivery',
    description: 'Carbon-neutral last-mile delivery service using electric vehicles and optimized routes.',
    industry: 'Logistics',
    targetMarket: 'Urban areas, e-commerce businesses',
    uniqueSellingProposition: 'Zero-emission delivery with competitive pricing',
    problem: 'Last-mile delivery is a significant contributor to urban carbon emissions.',
    solution: 'Fleet of electric vehicles with AI-optimized routes to reduce environmental impact.',
    traction: 'Pilot launched in two cities with 15 vehicles.',
    businessModel: 'B2B subscription model with volume-based pricing.',
    teamDescription: 'Founded by logistics experts with experience at major shipping companies.',
    fundingRequired: 750000,
    equityOffered: 12,
    createdAt: '2023-11-15T10:30:00Z',
    userId: '1',
    userName: 'John Entrepreneur',
    status: 'evaluated',
    score: 87,
    evaluationDetails: {
      overallScore: 87,
      categories: {
        marketFit: 90,
        scalability: 85,
        innovation: 75,
        teamCapability: 92,
        financialViability: 88,
        investmentPotential: 91
      },
      feedback: 'Strong concept with excellent market fit and scalability. The team\'s background is a significant advantage.'
    }
  },
  {
    id: 'idea-2',
    title: 'HealthSync',
    description: 'AI-powered health monitoring platform that integrates with wearable devices.',
    industry: 'Healthcare',
    targetMarket: 'Health-conscious consumers, elderly care facilities',
    uniqueSellingProposition: 'Personalized health insights with predictive analytics',
    problem: 'Health tracking data is fragmented and rarely provides actionable insights.',
    solution: 'Unified platform that aggregates data from multiple devices and provides AI-driven recommendations.',
    traction: 'Beta program with 500 users, partnership with 2 senior living facilities.',
    businessModel: 'Freemium model with subscription for premium features.',
    teamDescription: 'Medical professionals and software engineers with healthcare experience.',
    fundingRequired: 1200000,
    equityOffered: 15,
    createdAt: '2023-10-20T14:15:00Z',
    userId: '1',
    userName: 'John Entrepreneur',
    status: 'evaluated',
    score: 92,
    evaluationDetails: {
      overallScore: 92,
      categories: {
        marketFit: 95,
        scalability: 90,
        innovation: 88,
        teamCapability: 93,
        financialViability: 91,
        investmentPotential: 95
      },
      feedback: 'Excellent market opportunity with a solution that addresses a clear need. The team\'s background in both healthcare and technology is ideal.'
    }
  },
  {
    id: 'idea-3',
    title: 'CyberShield',
    description: 'Cybersecurity solution for small businesses using automated threat detection.',
    industry: 'Cybersecurity',
    targetMarket: 'Small and medium businesses',
    uniqueSellingProposition: 'Enterprise-grade security made accessible and affordable',
    problem: 'Small businesses lack resources for robust cybersecurity but face increasing threats.',
    solution: 'Automated security system that detects and responds to threats without requiring in-house expertise.',
    traction: '50 paying customers with 95% retention rate.',
    businessModel: 'Monthly subscription based on company size.',
    teamDescription: 'Founded by former cybersecurity consultants from leading firms.',
    fundingRequired: 900000,
    equityOffered: 10,
    createdAt: '2023-12-05T09:45:00Z',
    userId: '1',
    userName: 'John Entrepreneur',
    status: 'pending',
    score: undefined,
    evaluationDetails: undefined
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get all business ideas
export const getAllBusinessIdeas = async (): Promise<BusinessIdea[]> => {
  await delay(800);
  return [...MOCK_IDEAS];
};

// Get business idea by ID
export const getBusinessIdeaById = async (id: string): Promise<BusinessIdea> => {
  await delay(500);
  
  const idea = MOCK_IDEAS.find(idea => idea.id === id);
  
  if (!idea) {
    throw new Error('Business idea not found');
  }
  
  return { ...idea };
};

// Get business ideas by user ID
export const getBusinessIdeasByUserId = async (userId: string): Promise<BusinessIdea[]> => {
  await delay(700);
  
  const ideas = MOCK_IDEAS.filter(idea => idea.userId === userId);
  
  return [...ideas];
};

// Submit new business idea
export const submitBusinessIdea = async (
  userId: string, 
  userName: string,
  ideaData: SubmitIdeaFormData
): Promise<BusinessIdea> => {
  await delay(1200);
  
  const newIdea: BusinessIdea = {
    id: `idea-${Date.now()}`,
    ...ideaData,
    createdAt: new Date().toISOString(),
    userId,
    userName,
    status: 'pending'
  };
  
  // In a real implementation, this would be added to a database
  
  return newIdea;
};

// Get ranked business ideas
export const getRankedBusinessIdeas = async (): Promise<BusinessIdea[]> => {
  await delay(900);
  
  // Filter evaluated ideas and sort by score
  const rankedIdeas = MOCK_IDEAS
    .filter(idea => idea.status === 'evaluated' && idea.score !== undefined)
    .sort((a, b) => (b.score || 0) - (a.score || 0));
  
  return [...rankedIdeas];
};
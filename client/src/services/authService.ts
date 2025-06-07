import { User } from '../types';

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Entrepreneur',
    email: 'john@example.com',
    role: 'entrepreneur',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    name: 'Jane Investor',
    email: 'jane@example.com',
    role: 'investor',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Get current user (from local storage in mock implementation)
export const getCurrentUser = async (): Promise<User | null> => {
  await delay(800);
  const storedUser = localStorage.getItem('currentUser');
  return storedUser ? JSON.parse(storedUser) : null;
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
  await delay(1000);
  
  // Mock validation
  const user = MOCK_USERS.find(user => user.email === email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, we would validate the password here
  
  // Store in localStorage for our mock implementation
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  return user;
};

// Register user
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: 'entrepreneur' | 'investor'
): Promise<User> => {
  await delay(1200);
  
  // Check if user already exists
  if (MOCK_USERS.some(user => user.email === email)) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    avatar: role === 'entrepreneur' 
      ? 'https://randomuser.me/api/portraits/men/3.jpg'
      : 'https://randomuser.me/api/portraits/women/4.jpg'
  };
  
  // In a real app, we would save this to the database
  // For mock, we'll just return the new user
  
  // Store in localStorage
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  
  return newUser;
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await delay(500);
  localStorage.removeItem('currentUser');
};
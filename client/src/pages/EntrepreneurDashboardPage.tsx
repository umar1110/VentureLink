import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, FileText, MessageSquare, User, Settings, ChevronRight, AlertTriangle } from 'lucide-react';
import { BusinessIdea } from '../types';
import { Button } from '../components/ui/Button';
import { BusinessIdeaCard } from '../components/common/BusinessIdeaCard';
import { useAuth } from '../contexts/AuthContext';
import { getBusinessIdeasByUserId } from '../services/businessIdeaService';

export const EntrepreneurDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [businessIdeas, setBusinessIdeas] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Redirect if not an entrepreneur
    if (user && user.role !== 'entrepreneur') {
      navigate('/', { replace: true });
      return;
    }
    
    // Fetch business ideas
    const fetchIdeas = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const ideas = await getBusinessIdeasByUserId(user.id);
        setBusinessIdeas(ideas);
      } catch (err) {
        console.error('Error fetching business ideas:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIdeas();
  }, [user, isAuthenticated, navigate]);
  
  if (!isAuthenticated || (user && user.role !== 'entrepreneur')) {
    return null; // Will redirect via useEffect
  }
  
  const pendingIdeas = businessIdeas.filter(idea => idea.status === 'pending');
  const evaluatedIdeas = businessIdeas.filter(idea => idea.status === 'evaluated');
  const connectedIdeas = businessIdeas.filter(idea => idea.status === 'connected');
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Entrepreneur Dashboard</h1>
            <p className="mt-1 text-lg text-gray-500">
              Manage your business ideas and investor connections
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link to="/submit-idea">
              <Button leftIcon={<PlusCircle className="h-5 w-5" />}>
                Submit New Idea
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold text-xl">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-medium text-gray-900">{user?.name}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200">
                <nav className="flex-1">
                  <a href="#" className="flex items-center py-3 px-6 bg-primary-50 border-l-4 border-primary-500 text-primary-700 hover:bg-primary-50 transition-colors">
                    <FileText className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">My Ideas</span>
                  </a>
                  <a href="#" className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors">
                    <MessageSquare className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Messages</span>
                    <span className="ml-auto bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs font-medium">3</span>
                  </a>
                  <a href="#" className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors">
                    <User className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Profile</span>
                  </a>
                  <a href="#" className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors">
                    <Settings className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Settings</span>
                  </a>
                </nav>
              </div>
            </div>
            
            {/* Stats */}
            <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-primary-600">{businessIdeas.length}</span>
                    <span className="block text-sm text-gray-500">Total Ideas</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-green-600">{connectedIdeas.length}</span>
                    <span className="block text-sm text-gray-500">Connections</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-purple-600">{evaluatedIdeas.length}</span>
                    <span className="block text-sm text-gray-500">Evaluated</span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-yellow-600">{pendingIdeas.length}</span>
                    <span className="block text-sm text-gray-500">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Ideas List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Business Ideas</h2>
              </div>
              
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-gray-600">Loading your business ideas...</p>
                  </div>
                ) : businessIdeas.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <FileText className="h-12 w-12" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No business ideas yet</h3>
                    <p className="mt-1 text-gray-500">Get started by submitting your first business idea.</p>
                    <div className="mt-6">
                      <Link to="/submit-idea">
                        <Button leftIcon={<PlusCircle className="h-5 w-5" />}>
                          Submit New Idea
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    {pendingIdeas.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Evaluation</h3>
                        <div className="space-y-6">
                          {pendingIdeas.map((idea) => (
                            <BusinessIdeaCard key={idea.id} idea={idea} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {evaluatedIdeas.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluated Ideas</h3>
                        <div className="space-y-6">
                          {evaluatedIdeas.map((idea) => (
                            <BusinessIdeaCard key={idea.id} idea={idea} showEvaluation />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {connectedIdeas.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Connected with Investors</h3>
                        <div className="space-y-6">
                          {connectedIdeas.map((idea) => (
                            <BusinessIdeaCard key={idea.id} idea={idea} showEvaluation />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">View all</a>
              </div>
              
              <div className="divide-y divide-gray-200">
                <div className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">New message from an investor</p>
                      <p className="text-sm text-gray-500">Investor Jane is interested in your HealthSync idea</p>
                    </div>
                    <div className="ml-auto">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Idea evaluation completed</p>
                      <p className="text-sm text-gray-500">Your EcoDelivery idea has been evaluated</p>
                    </div>
                    <div className="ml-auto">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Profile view</p>
                      <p className="text-sm text-gray-500">An investor viewed your profile</p>
                    </div>
                    <div className="ml-auto">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
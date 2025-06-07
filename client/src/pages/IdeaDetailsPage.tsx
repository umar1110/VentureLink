import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, DollarSign, Users, Percent, Calendar, Briefcase, Share2 } from 'lucide-react';
import { BusinessIdea } from '../types';
import { Button } from '../components/ui/Button';
import { EvaluationChart } from '../components/common/EvaluationChart';
import { getBusinessIdeaById } from '../services/businessIdeaService';
import { useAuth } from '../contexts/AuthContext';

export const IdeaDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [idea, setIdea] = useState<BusinessIdea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchIdea = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const fetchedIdea = await getBusinessIdeaById(id);
        setIdea(fetchedIdea);
      } catch (err) {
        console.error('Error fetching business idea:', err);
        setError('Failed to load business idea details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIdea();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-600">Loading business idea details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !idea) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Business idea not found.'}</p>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Check if the current user is the creator of this idea
  const isCreator = user?.id === idea.userId;
  
  // Check if the user is an investor
  const isInvestor = user?.role === 'investor';
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'evaluated':
        return 'bg-success-100 text-success-800';
      case 'connected':
        return 'bg-secondary-100 text-secondary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to={isCreator ? '/entrepreneur-dashboard' : isInvestor ? '/investor-dashboard' : '/'} className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <Briefcase className="h-5 w-5 mr-2" />
                  <span className="text-primary-100">{idea.industry}</span>
                  {idea.status && (
                    <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(idea.status)}`}>
                      {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{idea.title}</h1>
                <p className="mt-2 text-primary-100">By {idea.userName} • Submitted on {formatDate(idea.createdAt)}</p>
              </div>
              
              {idea.score && (
                <div className="mt-4 md:mt-0 flex items-center bg-white bg-opacity-20 rounded-lg px-4 py-2">
                  <span className="text-sm font-medium mr-2">Evaluation Score:</span>
                  <span className="text-2xl font-bold">{idea.score}/100</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Idea Details */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Business Description</h2>
                  <p className="text-gray-700">{idea.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Problem</h2>
                    <p className="text-gray-700">{idea.problem}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Solution</h2>
                    <p className="text-gray-700">{idea.solution}</p>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Target Market</h2>
                  <p className="text-gray-700">{idea.targetMarket}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Unique Selling Proposition</h2>
                  <p className="text-gray-700">{idea.uniqueSellingProposition}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Business Model</h2>
                  <p className="text-gray-700">{idea.businessModel}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Current Traction</h2>
                  <p className="text-gray-700">{idea.traction}</p>
                </div>
                
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Team</h2>
                  <p className="text-gray-700">{idea.teamDescription}</p>
                </div>
                
                {idea.evaluationDetails && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Evaluation Results</h2>
                    <EvaluationChart evaluation={idea.evaluationDetails} />
                  </div>
                )}
              </div>
              
              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Funding Details</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Funding Required</p>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(idea.fundingRequired)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Percent className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Equity Offered</p>
                        <p className="text-lg font-semibold text-gray-900">{idea.equityOffered}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Submitted On</p>
                        <p className="text-lg font-semibold text-gray-900">{formatDate(idea.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                  
                  <div className="space-y-3">
                    {isInvestor && (
                      <Button 
                        variant="primary" 
                        leftIcon={<MessageSquare className="h-5 w-5" />}
                        fullWidth
                      >
                        Contact Entrepreneur
                      </Button>
                    )}
                    
                    {isCreator && idea.status === 'pending' && (
                      <Button 
                        variant="primary" 
                        fullWidth
                      >
                        Edit Idea
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      leftIcon={<Share2 className="h-5 w-5" />}
                      fullWidth
                    >
                      Share Idea
                    </Button>
                    
                    {isInvestor && (
                      <Button 
                        variant="outline" 
                        fullWidth
                      >
                        Save for Later
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* About the Entrepreneur */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">About the Entrepreneur</h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xl">
                      {idea.userName?.[0]?.toUpperCase() || 'E'}
                    </div>
                    <div className="ml-3">
                      <p className="text-md font-medium text-gray-900">{idea.userName}</p>
                      <p className="text-sm text-gray-500">Entrepreneur</p>
                    </div>
                  </div>
                  
                  {isInvestor && (
                    <Button 
                      variant="outline" 
                      leftIcon={<Users className="h-5 w-5" />}
                      fullWidth
                    >
                      View Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
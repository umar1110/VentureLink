import React, { useState, useEffect } from 'react';
import { Search, ListFilter, TrendingUp } from 'lucide-react';
import { BusinessIdea } from '../types';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { BusinessIdeaCard } from '../components/common/BusinessIdeaCard';
import { getRankedBusinessIdeas } from '../services/businessIdeaService';

export const RankedIdeasPage: React.FC = () => {
  const [businessIdeas, setBusinessIdeas] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [minFunding, setMinFunding] = useState('');
  const [maxFunding, setMaxFunding] = useState('');
  const [sortBy, setSortBy] = useState('score');
  
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const ideas = await getRankedBusinessIdeas();
        setBusinessIdeas(ideas);
      } catch (err) {
        console.error('Error fetching business ideas:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchIdeas();
  }, []);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedIndustry(e.target.value);
  };
  
  const handleMinFundingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinFunding(e.target.value);
  };
  
  const handleMaxFundingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxFunding(e.target.value);
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };
  
  // Filter and sort business ideas
  const filteredIdeas = businessIdeas.filter(idea => {
    const matchesSearch = searchTerm === '' || 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === '' || idea.industry === selectedIndustry;
    
    const matchesMinFunding = minFunding === '' || idea.fundingRequired >= parseInt(minFunding);
    
    const matchesMaxFunding = maxFunding === '' || idea.fundingRequired <= parseInt(maxFunding);
    
    return matchesSearch && matchesIndustry && matchesMinFunding && matchesMaxFunding;
  }).sort((a, b) => {
    if (sortBy === 'score') {
      return (b.score || 0) - (a.score || 0);
    } else if (sortBy === 'funding_low') {
      return a.fundingRequired - b.fundingRequired;
    } else if (sortBy === 'funding_high') {
      return b.fundingRequired - a.fundingRequired;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });
  
  const industryOptions = [
    { value: '', label: 'All Industries' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Logistics', label: 'Logistics' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
  ];
  
  const sortOptions = [
    { value: 'score', label: 'Highest Rated' },
    { value: 'funding_low', label: 'Funding: Low to High' },
    { value: 'funding_high', label: 'Funding: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Top Ranked Business Ideas</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Browse through our highest-rated business ideas, evaluated by our machine learning algorithm for market fit, scalability, and investment potential.
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-8 p-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 md:mb-0">Filter and Sort</h2>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={handleSortChange}
              className="w-full md:w-64"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input 
              label="Search Ideas"
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            
            <Select
              label="Industry"
              options={industryOptions}
              value={selectedIndustry}
              onChange={handleIndustryChange}
            />
            
            <Input 
              label="Min Funding ($)"
              type="number"
              placeholder="Minimum funding"
              value={minFunding}
              onChange={handleMinFundingChange}
            />
            
            <Input 
              label="Max Funding ($)"
              type="number"
              placeholder="Maximum funding"
              value={maxFunding}
              onChange={handleMaxFundingChange}
            />
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedIndustry('');
                setMinFunding('');
                setMaxFunding('');
                setSortBy('score');
              }}
            >
              Clear Filters
            </Button>
            
            <div className="text-sm text-gray-500">
              Showing {filteredIdeas.length} of {businessIdeas.length} ideas
            </div>
          </div>
        </div>
        
        {/* Ideas List */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600">Loading business ideas...</p>
              </div>
            ) : filteredIdeas.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto h-12 w-12 text-gray-400">
                  <Search className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No matching ideas</h3>
                <p className="mt-1 text-gray-500">Try adjusting your search or filters to find ideas.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIdeas.map((idea) => (
                  <BusinessIdeaCard key={idea.id} idea={idea} showEvaluation />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
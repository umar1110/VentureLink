import axios from "axios";
import { ListFilter, Search, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BusinessIdeaCard } from "../../components/common/BusinessIdeaCard";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
function DiscoverIdeas() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [businessIdeas, setBusinessIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleIndustryChange = (e) => {
    setSelectedIndustry(e.target.value);
  };

  // Filter business ideas based on search and industry filter
  const filteredIdeas = businessIdeas.filter((idea) => {
    const matchesSearch =
      searchTerm === "" ||
      idea.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.businessDescription.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry =
      selectedIndustry === "" || idea.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  const industryOptions = [
    { value: "", label: "All Industries" },
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Logistics", label: "Logistics" },
    { value: "E-commerce", label: "E-commerce" },
    { value: "Cybersecurity", label: "Cybersecurity" },
  ];

  useEffect(() => {
    // Fetch business ideas
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("http://localhost:4000/api/v1/ideas", {
          withCredentials: true,
        });
        setBusinessIdeas(data.data);
        console.log("Fetched Business Ideas:", data.data);
      } catch (err) {
        console.error("Error fetching business ideas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  if (!isAuthenticated || (user && user.role !== 1)) {
    return null; // Will redirect via useEffect
  }
  return (
    <div className="lg:col-span-3">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Investor Dashboard
          </h1>
          <p className="mt-1 text-lg text-gray-500">
            Discover promising business ideas and connect with entrepreneurs
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          {/* <Link to="/ranked-ideas">
            <Button
              variant="outline"
              leftIcon={<TrendingUp className="h-5 w-5" />}
              className="mr-3"
            >
              View All Ranked Ideas
            </Button>
          </Link> */}
          <Button
            leftIcon={<ListFilter className="h-5 w-5" />}
            onClick={toggleFilters}
          >
            Filters
          </Button>
        </div>
      </div>
      {showFilters && (
        <div className="bg-white shadow rounded-lg mb-8 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Search Ideas"
                placeholder="Search by title or description"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <div>
              <Select
                label="Filter by Industry"
                options={industryOptions}
                value={selectedIndustry}
                onChange={handleIndustryChange}
              />
            </div>
          </div>
        </div>
      )}
      {/* Top Ranked Ideas */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-primary-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-2 text-gray-600">Loading business ideas...</p>
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No matching ideas
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filters to find ideas.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredIdeas.map((idea) => (
                <BusinessIdeaCard
                  key={idea.id}
                  idea={idea}
                  showEvaluation
                  statusChangeAvailable={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      {/* <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <a
            href="#"
            className="text-sm text-primary-600 hover:text-primary-500"
          >
            View all
          </a>
        </div>

        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  New highly-rated idea available
                </p>
                <p className="text-sm text-gray-500">
                  HealthSync scored 92/100 in evaluation
                </p>
              </div>
              <div className="ml-auto">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  New message from entrepreneur
                </p>
                <p className="text-sm text-gray-500">
                  John responded to your inquiry about EcoDelivery
                </p>
              </div>
              <div className="ml-auto">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Connection request
                </p>
                <p className="text-sm text-gray-500">
                  An entrepreneur wants to connect with you
                </p>
              </div>
              <div className="ml-auto">
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default DiscoverIdeas;

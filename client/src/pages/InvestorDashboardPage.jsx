import {
  Bell,
  ChevronRight,
  ListFilter,
  MessageSquare,
  Search,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BusinessIdeaCard } from "../components/common/BusinessIdeaCard";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { getRankedBusinessIdeas } from "../services/businessIdeaService";

export const InvestorDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [businessIdeas, setBusinessIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // Redirect if not an investor
    if (user && user.role !== 1) {
      navigate("/", { replace: true });
      return;
    }

    // Fetch business ideas
    const fetchIdeas = async () => {
      try {
        setIsLoading(true);
        const ideas = await getRankedBusinessIdeas();
        setBusinessIdeas(ideas);
      } catch (err) {
        console.error("Error fetching business ideas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated || (user && user.role !== "investor")) {
    return null; // Will redirect via useEffect
  }

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
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchTerm.toLowerCase());

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Link to="/ranked-ideas">
              <Button
                variant="outline"
                leftIcon={<TrendingUp className="h-5 w-5" />}
                className="mr-3"
              >
                View All Ranked Ideas
              </Button>
            </Link>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 font-semibold text-xl">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-medium text-gray-900">
                      {user?.name}
                    </h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200">
                <nav className="flex-1">
                  <a
                    href="#"
                    className="flex items-center py-3 px-6 bg-primary-50 border-l-4 border-primary-500 text-primary-700 hover:bg-primary-50 transition-colors"
                  >
                    <TrendingUp className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Discover Ideas</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Messages</span>
                    <span className="ml-auto bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs font-medium">
                      5
                    </span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Notifications</span>
                    <span className="ml-auto bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs font-medium">
                      2
                    </span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Profile</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Settings</span>
                  </a>
                </nav>
              </div>
            </div>

            {/* Investment Preferences */}
            <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Your Investment Preferences
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Preferred Industries
                    </h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Healthcare
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Technology
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Fintech
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        SaaS
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Investment Range
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      $250,000 - $1,000,000
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Target Equity
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">10% - 25%</p>
                  </div>

                  <div className="pt-3">
                    <a
                      href="#"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      Edit Preferences
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Top Ranked Ideas */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Top Ranked Business Ideas
                </h2>
                <Link
                  to="/ranked-ideas"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  View all
                </Link>
              </div>

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
                    <p className="mt-2 text-gray-600">
                      Loading business ideas...
                    </p>
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
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h2>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

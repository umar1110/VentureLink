import { Bell, MessageSquare, Settings, TrendingUp, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { getRankedBusinessIdeas } from "../services/businessIdeaService";

export const InvestorDashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [businessIdeas, setBusinessIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated && !loading) {
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

  if (!isAuthenticated || (user && user.role !== 1)) {
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
              <div className="m-3  ">
                <h2 className="text-lg font-medium text-gray-900">
                  {user?.fullName}
                </h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <div className="border-t border-gray-200">
                <nav className="flex-1">
                  <NavLink
                    end
                    to="/investor-dashboard"
                    className={({ isActive }) =>
                      `flex items-center py-3 px-6 transition-colors ${
                        isActive
                          ? "bg-primary-50 border-l-4 border-primary-500 text-primary-700 hover:bg-primary-50"
                          : "hover:bg-gray-50"
                      }`
                    }
                  >
                    <TrendingUp className="h-5 w-5 mr-3" />
                    <span className="text-sm">Discover Ideas</span>
                  </NavLink>
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
                  {/* <a
                    href="#"
                    className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Bell className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Notifications</span>
                    <span className="ml-auto bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs font-medium">
                      2
                    </span>
                  </a> */}
                  <NavLink
                    to="/investor-dashboard/profile"
                    className={({ isActive }) =>
                      `flex items-center py-3 px-6 transition-colors ${
                        isActive
                          ? "bg-primary-50 border-l-4 border-primary-500 text-primary-700 hover:bg-primary-50"
                          : "hover:bg-gray-50"
                      }`
                    }
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Profile</span>
                  </NavLink>
                  {/* <a
                    href="#"
                    className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Settings</span>
                  </a> */}
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
          <Outlet />
        </div>
      </div>
    </div>
  );
};

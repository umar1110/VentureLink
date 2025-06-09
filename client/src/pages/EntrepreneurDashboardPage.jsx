import { FileText, MessageSquare, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getBusinessIdeasByUserId } from "../services/businessIdeaService";

export const EntrepreneurDashboardPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  const [businessIdeas, setBusinessIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated && !loading) {
      navigate("/login", { replace: true });
      return;
    }

    // Redirect if not an entrepreneur
    if (user && user.role !== 0) {
      navigate("/", { replace: true });
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
        console.error("Error fetching business ideas:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeas();
  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated || (user && user.role !== 0)) {
    return null; // Will redirect via useEffect
  }

  const pendingIdeas = businessIdeas.filter(
    (idea) => idea.status === "pending"
  );
  const evaluatedIdeas = businessIdeas.filter(
    (idea) => idea.status === "evaluated"
  );
  const connectedIdeas = businessIdeas.filter(
    (idea) => idea.status === "connected"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="m-3">
                <h2 className="text-lg font-medium text-gray-900">
                  {user?.fullName}
                </h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <div className="border-t border-gray-200">
                <nav className="flex-1">
                  <NavLink
                    end
                    to="/entrepreneur-dashboard"
                    className={({ isActive }) =>
                      `flex items-center py-3 px-6 transition-colors ${
                        isActive
                          ? "bg-primary-50 border-l-4 border-primary-500 text-primary-700 hover:bg-primary-50"
                          : "hover:bg-gray-50"
                      }`
                    }
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">My Ideas</span>
                  </NavLink>
                  <NavLink
                    to="/entrepreneur-dashboard/messages"
                    className="flex items-center py-3 px-6 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    <span className="text-sm font-medium">Messages</span>
                    <span className="ml-auto bg-primary-100 text-primary-600 py-0.5 px-2 rounded-full text-xs font-medium">
                      3
                    </span>
                  </NavLink>
                  <NavLink
                    to="/entrepreneur-dashboard/profile"
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
                </nav>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Your Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-primary-600">
                      {businessIdeas.length}
                    </span>
                    <span className="block text-sm text-gray-500">
                      Total Ideas
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-green-600">
                      {connectedIdeas.length}
                    </span>
                    <span className="block text-sm text-gray-500">
                      Connections
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-purple-600">
                      {evaluatedIdeas.length}
                    </span>
                    <span className="block text-sm text-gray-500">
                      Evaluated
                    </span>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 text-center">
                    <span className="block text-2xl font-bold text-yellow-600">
                      {pendingIdeas.length}
                    </span>
                    <span className="block text-sm text-gray-500">Pending</span>
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

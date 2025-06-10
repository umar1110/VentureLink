import {
  ChevronRight,
  FileText,
  MessageSquare,
  PlusCircle,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BusinessIdeaCard } from "../../components/common/BusinessIdeaCard";
import { Button } from "../../components/ui/Button";
import axios from "axios";
function MyIdeas() {
  const [businessIdeas, setBusinessIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [MyIdeas, setMyIdeas] = useState([]);
  const fetchMyIdeas = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://localhost:4000/api/v1/my/ideas",
        {
          withCredentials: true,
        }
      );

      setMyIdeas(response.data.data);
      console.log("My Ideas:", response.data.data);
    } catch (error) {
      console.error("Error fetching my ideas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyIdeas();
  }, []);
  const pendingIdeas = MyIdeas.filter((idea) => idea.status === "pending");
  return (
    <div className="lg:col-span-3">
      {/* Ideas List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Your Business Ideas
          </h2>
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
                Loading your business ideas...
              </p>
            </div>
          ) : MyIdeas.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FileText className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No business ideas yet
              </h3>
              <p className="mt-1 text-gray-500">
                Get started by submitting your first business idea.
              </p>
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
              {MyIdeas.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Pending Evaluation
                  </h3>
                  <div className="space-y-6">
                    {MyIdeas.map((idea) => (
                      <BusinessIdeaCard key={idea._id} idea={idea} />
                    ))}
                  </div>
                </div>
              )}

              {/* {evaluatedIdeas.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Evaluated Ideas
                  </h3>
                  <div className="space-y-6">
                    {evaluatedIdeas.map((idea) => (
                      <BusinessIdeaCard key={idea._id} idea={idea} />
                    ))}
                  </div>
                </div>
              )} */}

              {/* {connectedIdeas.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Connected with Investors
                  </h3>
                  <div className="space-y-6">
                    {connectedIdeas.map((idea) => (
                      <BusinessIdeaCard
                        key={idea.id}
                        idea={idea}
                        showEvaluation
                      />
                    ))}
                  </div>
                </div>
              )} */}
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
                  <MessageSquare className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    New message from an investor
                  </p>
                  <p className="text-sm text-gray-500">
                    Investor Jane is interested in your HealthSync idea
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
                  <FileText className="h-5 w-5 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    Idea evaluation completed
                  </p>
                  <p className="text-sm text-gray-500">
                    Your EcoDelivery idea has been evaluated
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
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">
                    Profile view
                  </p>
                  <p className="text-sm text-gray-500">
                    An investor viewed your profile
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

export default MyIdeas;

import { CheckCircle, Clock, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

export const BusinessIdeaCard = ({
  idea,
  showEvaluation = false,
  statusChangeAvailable = false,
}) => {
  const [ideaState, setIdeaState] = useState(idea);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedDropdownStatus, setSelectedDropdownStatus] = useState(
    idea.status
  );

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [investorEmail, setInvestorEmail] = useState("");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statuses = ["pending", "evaluated"];
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning-100 text-warning-800";
      case "evaluated":
        return "bg-success-100 text-success-800";
      case "connected":
        return "bg-secondary-100 text-secondary-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "evaluated":
        return <CheckCircle className="h-4 w-4" />;
      case "connected":
        return <Users className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderScore = () => {
    if (!ideaState.successRate) return null;

    let scoreColor = "text-gray-700";
    if (ideaState.successRate >= 90) scoreColor = "text-success-600";
    else if (ideaState.successRate >= 70) scoreColor = "text-primary-600";
    else if (ideaState.successRate >= 50) scoreColor = "text-warning-600";
    else scoreColor = "text-error-600";

    return (
      <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-gray-100">
        <span className={`text-xl font-bold ${scoreColor}`}>
          {ideaState.successRate}
        </span>
      </div>
    );
  };

  const updateStatus = async (status, email = null) => {
    try {
      toast.loading("Changing status...");
      const response = await axios.put(
        "http://localhost:4000/api/v1/status/change",
        {
          email,
          ideaId: ideaState._id,
          status,
        },
        { withCredentials: true }
      );
      toast.dismiss();
      toast.success("Updated successfully");
      setIdeaState(response.data.data);
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const handleStatusChange = (event) => {
    const newStatus = event.target.value;
    if (newStatus === "evaluated") {
      setSelectedStatus(newStatus);
      setShowEmailModal(true); // Open modal
      return;
    }
    updateStatus(newStatus);
  };
  useEffect(() => {
    setSelectedDropdownStatus(ideaState.status);
  }, [ideaState.status]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg">
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Enter Investor's Email
            </h3>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="example@email.com"
              value={investorEmail}
              onChange={(e) => setInvestorEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowEmailModal(false);
                  setInvestorEmail("");
                  setSelectedDropdownStatus(ideaState.status); // Reset dropdown to original
                }}
              >
                Cancel
              </Button>

              <Button
                onClick={() => {
                  setShowEmailModal(false);
                  updateStatus(selectedStatus, investorEmail);
                  setInvestorEmail("");
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {ideaState.businessName}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              {ideaState.industry} • {formatDate(ideaState.createdAt)}
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            {ideaState.status && (
              <div
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                  ideaState.status
                )}`}
              >
                {getStatusIcon(ideaState.status)}
                <span className="ml-1 capitalize">{ideaState.status}</span>
              </div>
            )}

            {statusChangeAvailable && (
              <select
                value={selectedDropdownStatus}
                onChange={(e) => {
                  const newStatus = e.target.value;

                  if (newStatus === "evaluated") {
                    setSelectedStatus(newStatus);
                    setShowEmailModal(true);
                  } else {
                    updateStatus(newStatus);
                  }

                  // Prevent visual change unless confirmed
                  setSelectedDropdownStatus(ideaState.status);
                }}
                name="status"
                id="status"
                className="border rounded px-2 py-1 text-sm"
              >
                {[
                  ideaState.status,
                  ...statuses.filter((s) => s !== ideaState.status),
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">
          {ideaState.businessDescription}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Funding Required</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatCurrency(ideaState.fundingRequired)}
            </p>
          </div>
          <div className="col-span-1">
            <p className="text-sm text-gray-500">Equity Offered</p>
            <p className="text-lg font-semibold text-gray-900">
              {ideaState.equityOffered.$numberDecimal}%
            </p>
          </div>
        </div>

        {ideaState.successRate && (
          <div className="mb-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-md font-medium text-gray-800">
                Evaluation Summary
              </h4>
              {renderScore()}
            </div>

            {/* <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-primary-500 mr-1" />
                  <span className="text-sm text-gray-600">Market Fit</span>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500"
                    style={{
                      width: `${ideaState.evaluationDetails.categories.marketFit}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="col-span-1">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-primary-500 mr-1" />
                  <span className="text-sm text-gray-600">Innovation</span>
                </div>
                <div className="mt-1 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500"
                    style={{
                      width: `${ideaState.evaluationDetails.categories.innovation}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div> */}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <img
                src={ideaState.submitter?.profilePicture?.url || ""}
                alt=""
                className="w-full h-full object-cover rounded-full "
              />
            </div>
            <div className="ml-2 text-sm text-gray-500">
              {ideaState.submitter.fullName}
            </div>
          </div>

          <Link to={`/ideas/${ideaState._id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

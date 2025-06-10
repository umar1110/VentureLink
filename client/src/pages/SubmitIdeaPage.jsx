import { AlertTriangle, Send } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { toast } from "react-toastify";
import { submitBusinessIdea } from "../services/businessIdeaService";
import axios from "axios";
export const SubmitIdeaPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const industryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "E-commerce", label: "E-commerce" },
    { value: "Entertainment", label: "Entertainment" },
    { value: "Food & Beverage", label: "Food & Beverage" },
    { value: "Real Estate", label: "Real Estate" },
    { value: "Transportation", label: "Transportation" },
    { value: "Energy", label: "Energy" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Agriculture", label: "Agriculture" },
    { value: "Other", label: "Other" },
  ];

  const onSubmit = async (data) => {
    if (!user) return;
    try {
      toast.loading("Submitting your business idea...");
      const dataToBackend = {
        businessName: data.title,
        industry: data.industry,
        businessDescription: data.description,
        targetMarket: data.targetMarket,
        targetMarketSize: data.targetMarketSize,
        uniqueSellingProposition: data.uniqueSellingProposition,
        problem: data.problem,
        solution: data.solution,
        businessModel: data.businessModel,
        fundingRequired: data.fundingRequired,
        equityOffered: data.equityOffered,
        foundedYear: data.foundedYear,
        uspStrength: data.uspStrengthRate,
        teamExperience: data.teamExperience,
        targetMarketSize: data.targetMarketSize,
      };

      dataToBackend.problemImportance = 10;
      dataToBackend.solutionUniqueness = 10;
      dataToBackend.businessModelClarity = 10;

      const response = await axios.post(
        "http://localhost:4000/api/v1/idea/create",
        dataToBackend,
        {
          withCredentials: true,
        }
      );
      toast.dismiss();

      console.log("Response from backend:", response.data);

      toast.success("Business idea submitted successfully!");
      // navigate("/ideas", { replace: true });
    } catch (error) {
      toast.dismiss();
      toast.error("An error occurred while submitting your idea.");
      console.error(
        "Error submitting idea:",
        error.response?.data?.message || error.message
      );
    }
  };

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Redirect if not an entrepreneur
  React.useEffect(() => {
    if (user && user.role !== 0) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!isAuthenticated || (user && user.role !== 0)) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Submit Your Business Idea
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete the form below to submit your business idea for evaluation.
            The more information you provide, the better our AI can evaluate
            your idea.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6 bg-primary-50 border-l-4 border-primary-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-primary-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-primary-700">
                    Your information is protected. Only investors who match your
                    criteria will be able to see your idea after it has been
                    evaluated.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Business Name / Title"
                    error={errors.title?.message}
                    {...register("title", {
                      required: "Business name is required",
                      minLength: {
                        value: 2,
                        message: "Business name must be at least 2 characters",
                      },
                    })}
                  />

                  <Select
                    label="Industry"
                    options={industryOptions}
                    error={errors.industry?.message}
                    {...register("industry", {
                      required: "Industry is required",
                    })}
                  />
                </div>

                <Textarea
                  label="Business Description"
                  rows={3}
                  maxLength={500}
                  error={errors.description?.message}
                  {...register("description", {
                    required: "Description is required",
                    maxLength: {
                      value: 500,
                      message: "Description cannot exceed 500 characters",
                    },
                  })}
                />
              </div>

              {/* Market & Business Model */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Market & Business Model
                </h2>

                <Textarea
                  label="Target Market"
                  rows={3}
                  maxLength={250}
                  error={errors.targetMarket?.message}
                  {...register("targetMarket", {
                    required: "Target market information is required",
                    maxLength: {
                      value: 250,
                      message: "Target market cannot exceed 250 characters",
                    },
                  })}
                />

                <Textarea
                  label="Unique Selling Proposition"
                  rows={3}
                  maxLength={250}
                  error={errors.uniqueSellingProposition?.message}
                  {...register("uniqueSellingProposition", {
                    required: "Unique selling proposition is required",
                    maxLength: {
                      value: 250,
                      message: "USP cannot exceed 250 characters",
                    },
                  })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Textarea
                    label="Problem"
                    rows={3}
                    maxLength={250}
                    error={errors.problem?.message}
                    {...register("problem", {
                      required: "Problem statement is required",
                      maxLength: {
                        value: 250,
                        message: "Problem cannot exceed 250 characters",
                      },
                    })}
                  />

                  <Textarea
                    label="Solution"
                    rows={3}
                    maxLength={250}
                    error={errors.solution?.message}
                    {...register("solution", {
                      required: "Solution description is required",
                      maxLength: {
                        value: 250,
                        message: "Solution cannot exceed 250 characters",
                      },
                    })}
                  />
                </div>

                <Textarea
                  label="Business Model"
                  rows={3}
                  maxLength={500}
                  error={errors.businessModel?.message}
                  {...register("businessModel", {
                    required: "Business model is required",
                    maxLength: {
                      value: 500,
                      message: "Business model cannot exceed 500 characters",
                    },
                  })}
                />
              </div>

              {/* Funding Requirements */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Funding Requirements
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Funding Required (USD)"
                    type="number"
                    error={errors.fundingRequired?.message}
                    {...register("fundingRequired", {
                      required: "Funding amount is required",
                      min: {
                        value: 1000,
                        message: "Minimum funding amount is $1,000",
                      },
                    })}
                  />

                  <Input
                    label="Equity Offered (%)"
                    type="number"
                    step="0.01"
                    error={errors.equityOffered?.message}
                    {...register("equityOffered", {
                      required: "Equity percentage is required",
                      min: { value: 1, message: "Minimum equity is 1%" },
                      max: { value: 100, message: "Maximum equity is 100%" },
                    })}
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Founded Year"
                    type="number"
                    error={errors.foundedYear?.message}
                    {...register("foundedYear", {
                      required: "Founded year is required",
                      min: {
                        value: 1900,
                        message: "Founded year must be after 1900",
                      },
                    })}
                  />

                  <Input
                    label="USP Strength Rate (1-5)"
                    type="number"
                    max={5}
                    error={errors.uspStrengthRate?.message}
                    {...register("uspStrengthRate", {
                      required: "USP strength rate is required",
                      min: {
                        value: 1,
                        message: "Minimum strength rate is 1",
                      },
                      max: {
                        value: 5,
                        message: "Maximum strength rate is 5",
                      },
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Target Market Size"
                    type="number"
                    error={errors.targetMarketSize?.message}
                    {...register("targetMarketSize", {
                      required: "Target market size is required",
                    })}
                  />

                  <Input
                    label="Team Experience (Years)"
                    type="number"
                    error={errors.teamExperience?.message}
                    {...register("teamExperience", {
                      required: "Team experience is required",
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="h-5 w-5" />}
                  size="lg"
                >
                  Submit Business Idea
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

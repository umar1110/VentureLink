import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { SignupUser } from "../redux/slices/authSlice";

export const SignUpPage = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const profilePictureRef = useRef(null);
  const [previewProfilePicture, setPreviewProfilePicture] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password", "");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append(
        "role",
        data.role === "entrepreneur" ? 0 : 1 // from Backend constants
      );
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      dispatch(SignupUser(formData));
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to dashboard based on role
      const userRole = user?.role; // Assuming user object has a role property
      if (userRole === 0) {
        navigate("/entrepreneur-dashboard");
      } else if (userRole === 1) {
        navigate("/investor-dashboard");
      }
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Profile PIC */}
            <div
              onClick={() => profilePictureRef.current.click()}
              className="flex cursor-pointer items-center justify-center mb-6"
            >
              {previewProfilePicture ? (
                <img
                  src={previewProfilePicture}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-3xl">+</span>
                  </div>
                </>
              )}
            </div>

            {/* input for profile picture */}

            <input
              ref={profilePictureRef}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfilePicture(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewProfilePicture(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              type="file"
              id="profilePicture"
              accept="image/*"
              className="hidden w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />

            {/* Input Fields */}

            <Input
              label="Full Name"
              error={errors.name?.message}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
            />

            <Input
              label="Email Address"
              type="email"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                error={errors.confirmPassword?.message}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I am a<span className="ml-1 text-error-600">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`
                  flex items-center justify-center p-4 border rounded-md cursor-pointer
                  ${
                    watch("role") === "entrepreneur"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                `}
                >
                  <input
                    type="radio"
                    value="entrepreneur"
                    className="sr-only"
                    {...register("role", { required: "Please select a role" })}
                  />
                  <span className="ml-2">Entrepreneur</span>
                </label>

                <label
                  className={`
                  flex items-center justify-center p-4 border rounded-md cursor-pointer
                  ${
                    watch("role") === "investor"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }
                `}
                >
                  <input
                    type="radio"
                    value="investor"
                    className="sr-only"
                    {...register("role", { required: "Please select a role" })}
                  />
                  <span className="ml-2">Investor</span>
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-error-600">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

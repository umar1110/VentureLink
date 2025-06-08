import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../contexts/AuthContext";
import { LoginUser } from "../redux/slices/authSlice";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth); // Assuming you have an auth slice in Redux

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data) => {
    try {
      dispatch(
        LoginUser({
          email: data.email,
          password: data.password,
        })
      );
    } catch (err) {
      console.error("Login error:", err);
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
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Sign In
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

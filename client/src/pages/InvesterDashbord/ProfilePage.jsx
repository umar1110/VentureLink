import React, { useRef, useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../redux/slices/authSlice";
import { Eye, EyeOff, EyeOffIcon } from "lucide-react";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [hidePassword, setHidePassword] = useState({
    password: true,
    confirmPassword: true,
  });
  const [fullName, setFullName] = useState(user.fullName);
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const profilePictureRef = useRef(null);
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture?.url
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    try {
      // TODO: Add form submission logic here
      if (password && password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      if (newProfilePicture) {
        formData.append("profilePicture", newProfilePicture);
      }
      if (password) {
        formData.append("password", password);
      }
      formData.append("id", user._id);

      dispatch(updateUserProfile(formData));
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Profile update failed");
    }
  };

  return (
    <form
      onSubmit={handleSave}
      className="bg-white shadow rounded-lg p-6 space-y-6 lg:col-span-3 "
    >
      <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>

      {/* Profile Picture */}
      <div
        onClick={() => {
          profilePictureRef.current.click();
        }}
        className=" cursor-pointer w-fit mx-auto"
      >
        <img
          src={profilePicture}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <input
          type="file"
          accept="image/*"
          ref={profilePictureRef}
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              setNewProfilePicture(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                setProfilePicture(reader.result);
              };
              reader.readAsDataURL(file);
            }
          }}
          className="hidden"
          id="profilePictureInput"
        />
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <div className="relative">
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            onClick={() =>
              setHidePassword({
                ...hidePassword,
                password: !hidePassword.password,
              })
            }
          >
            {hidePassword.password ? (
              <>
                {" "}
                <Eye />{" "}
              </>
            ) : (
              <>
                <EyeOff />
              </>
            )}
          </button>

          <Input
            type={hidePassword.password ? "password" : "text"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Leave blank to keep current password
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="relative">
          <button
            type="button"
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
            onClick={() =>
              setHidePassword({
                ...hidePassword,
                confirmPassword: !hidePassword.confirmPassword,
              })
            }
          >
            {hidePassword.confirmPassword ? (
              <>
                {" "}
                <Eye />{" "}
              </>
            ) : (
              <>
                <EyeOff />
              </>
            )}
          </button>
          <Input
            type={hidePassword.confirmPassword ? "password" : "text"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button
          type="submit"
          disabled={
            fullName.trim() === user?.fullName?.trim() &&
            !password &&
            !newProfilePicture
          }
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default Profile;

import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const Profile = () => {
  const user = {
    fullName: "John Doe",
    profilePicture: {
      url: "https://via.placeholder.com/150",
    },
  };

  const [fullName, setFullName] = useState(user.fullName);
  const [profilePicture, setProfilePicture] = useState(
    user.profilePicture?.url
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    // TODO: Add form submission logic here
    console.log("Saving:", {
      fullName,
      profilePicture,
      password,
      confirmPassword,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6 lg:col-span-3 ">
      <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>

      {/* Profile Picture */}
      <div className="flex items-center space-x-4">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Change Profile Picture
          </label>
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Image URL"
          />
        </div>
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
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
        />
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default Profile;

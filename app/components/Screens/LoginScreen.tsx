"use client"
import { useState } from "react";

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "Admin@123") {
      onLogin();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col justify-center items-center text-white">
      {/* Profile Section */}
      <div className="text-center">
        <img
          src="/profile.png"
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-white mb-4"
        />
        <h1 className="text-lg font-semibold">User Name</h1>
      </div>

      {/* Password Input */}
      <div className="mt-6 w-64">
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded-md text-black"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="mt-4 bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Login
      </button>

      {/* Footer Actions */}
      <div className="absolute bottom-10 flex space-x-6">
        <button className="text-gray-300 hover:text-white">Sleep</button>
        <button className="text-gray-300 hover:text-white">Restart</button>
        <button className="text-gray-300 hover:text-white">Shut Down</button>
      </div>
    </div>
  );
};

export default LoginScreen;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userInfo } from "../axios/user";
import {
  FaSun,
  FaMoon,
  FaSignOutAlt,
  FaUser,
  FaLock,
  FaChartBar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Settings = () => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [actionStatus, setActionStatus] = useState("");
  const [sectionStatus, setSectionStatus] = useState({});
  const navigate = useNavigate();

  const settingsData = [
    {
      icon: "👤",
      title: "Account Center",
      items: [
        "Account Info",
        "Your Activity",
        "Account Privacy",
        "Active Sessions",
        "Account Security",
      ],
    },
    {
      icon: "⏰",
      title: "Time Management",
      items: ["Screen Time", "Usage Insights", "Recent Account Activity"],
    },
    {
      icon: "🔐",
      title: "Permissions",
      items: [
        "Muted Accounts",
        "Device Permissions",
        "App & Website Permissions",
      ],
    },
    {
      icon: "📍",
      title: "Location Settings",
      items: ["Saved Locations", "Allow Location Access"],
    },
    {
      icon: "🗄",
      title: "Data & Archiving",
      items: ["Archive & Download Data", "Delete Account Data"],
    },
    {
      icon: "🛡",
      title: "Privacy Center",
      items: ["Manage Privacy Settings", "Security Checkup"],
    },
  ];

  const chartData = [
    { name: "Mon", usage: 3 },
    { name: "Tue", usage: 5 },
    { name: "Wed", usage: 4 },
    { name: "Thu", usage: 6 },
    { name: "Fri", usage: 5 },
    { name: "Sat", usage: 3 },
    { name: "Sun", usage: 2 },
  ];

  useEffect(() => {
    getUser();
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
  }, []);

  const getUser = async () => {
    const userData = await userInfo();
    if (!userData?.found) navigate("/login");
    else setUser(userData.user);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };

  // 🎨 Updated brown-peach color scheme
  const brownPrimary = "#B07A52";
  const bg = darkMode ? "bg-[#B07A52]" : "bg-[#FAF3ED]";
  const text = darkMode ? "text-[#FFF6F0]" : "text-[#4B3A2E]";
  const card = darkMode ? "bg-[#C6936D]" : "bg-[#F2E4D4]";
  const border = darkMode ? "border-[#D8AA85]" : "border-[#D2B89B]";

  const accountActions = [
    { label: "Change Password", color: "#f97316" },
    { label: "Update Email", color: "#a16207" },
    { label: "Deactivate Account", color: "#7c4a0a" },
    { label: "Logout", color: "#5c4033", icon: <FaSignOutAlt size={18} /> },
  ];

  const handleAction = (label) => {
    setActionStatus(`Processing ${label}...`);
    setTimeout(() => {
      switch (label) {
        case "Change Password":
          setActionStatus("✅ Password changed successfully");
          break;
        case "Update Email":
          setActionStatus("✉️ Email updated successfully");
          break;
        case "Deactivate Account":
          setActionStatus("⚠️ Account deactivated temporarily");
          break;
        case "Logout":
          setActionStatus("🔒 Logging out...");
          setTimeout(() => navigate("/login"), 1000);
          break;
        default:
          setActionStatus("");
      }
    }, 1200);
  };

  const handleSectionClick = (section, item) => {
    setSectionStatus({
      ...sectionStatus,
      [section]: `Updated "${item}" successfully ✅`,
    });
    setTimeout(() => {
      setSectionStatus((prev) => ({ ...prev, [section]: "" }));
    }, 1500);
  };

  return (
    <div
      className={`${bg} ${text} flex flex-col w-full min-h-screen gap-8 p-6 transition-all duration-300`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center p-6 rounded-2xl shadow-lg transition-all duration-300 ${
          darkMode
            ? "bg-[#B07A52] text-[#FFF6F0]"
            : "bg-[#9B6B43] text-[#FAF3ED]"
        }`}
      >
        <div>
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-[#FAF3ED]/80 mt-1">
            Manage your account preferences
          </p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold bg-[#FAF3ED]/20 text-[#FAF3ED] hover:bg-[#FAF3ED]/30 transition"
        >
          {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* User Info Section */}
      {user && (
        <div
          className={`p-5 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border ${border} ${card}`}
        >
          {/* Left: Profile Info */}
          <div className="flex items-center gap-4">
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-[#B07A52] object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#B07A52] flex items-center justify-center text-2xl font-bold text-white">
                {user.name.charAt(0)}
              </div>
            )}

            <div>
              <p className="font-semibold text-lg">{user.name}</p>
              <p
                className={`${
                  darkMode ? "text-[#FFF6F0]" : "text-[#4B3A2E]"
                } text-sm`}
              >
                {user.email}
              </p>
              <label className="text-sm text-[#B07A52] cursor-pointer hover:underline">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                />
                Change Photo
              </label>
            </div>
          </div>

          {/* Right: Role Display */}
          <div className="relative group mt-4 sm:mt-0">
            <div
              className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-inner transition-all duration-300 cursor-pointer ${
                user.email.toLowerCase().endsWith("@civix.gov.in")
                  ? darkMode
                    ? "bg-[#C6936D] hover:bg-[#B07A52] text-white"
                    : "bg-[#F2D6BF] hover:bg-[#E8C4A9] text-[#4B3A2E]"
                  : darkMode
                  ? "bg-[#B07A52] hover:bg-[#A06A46] text-white"
                  : "bg-[#F5E0CC] hover:bg-[#EBD0B5] text-[#4B3A2E]"
              }`}
            >
              {user.email.toLowerCase().endsWith("@civix.gov.in")
                ? "🛡️ Official"
                : "👤 Citizen"}
            </div>

            <div className="absolute right-0 mt-2 w-max bg-black text-white text-xs rounded-md px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              {user.email.toLowerCase().endsWith("@civix.gov.in")
                ? "You are logged in as an authorized government official."
                : "You are logged in as a registered citizen user."}
            </div>
          </div>
        </div>
      )}

      {/* Two-Factor Authentication */}
      <div className={`p-6 rounded-2xl border shadow-lg ${card} ${border}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaLock size={20} /> Two-Factor Authentication
        </h3>
        <p
          className={`${
            darkMode ? "text-[#FFF6F0]/70" : "text-[#4B3A2E]"
          } mb-5 text-sm`}
        >
          Manage your two-factor authentication preferences below.
        </p>
        {[
          { key: "email", label: "Email Verification" },
          { key: "sms", label: "SMS Code Authentication" },
          { key: "backup", label: "Backup Codes" },
        ].map((method, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center justify-between p-4 mb-3 rounded-xl border ${border} ${card} transition`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{method.label}</span>
              <span
                className={`text-xs mt-1 ${
                  method.key === "email" && twoFactorEnabled
                    ? "text-green-300"
                    : "text-gray-400"
                }`}
              >
                {method.key === "email" && twoFactorEnabled
                  ? "Enabled"
                  : method.key === "sms"
                  ? "Setup Pending"
                  : "Generate to Activate"}
              </span>
            </div>

            {method.key === "email" ? (
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={() => {
                    setTwoFactorEnabled(!twoFactorEnabled);
                    const status = !twoFactorEnabled ? "enabled" : "disabled";
                    alert(`Email verification ${status}`);
                  }}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#B07A52] transition-all duration-300">
                  <div
                    className={`absolute top-0.5 left-[2px] bg-white w-5 h-5 rounded-full transition-transform ${
                      twoFactorEnabled ? "translate-x-full" : ""
                    }`}
                  ></div>
                </div>
              </label>
            ) : method.key === "sms" ? (
              <button
                onClick={() => alert("SMS 2FA setup simulated!")}
                className="px-5 py-2 rounded-xl text-white font-medium text-sm bg-[#B07A52] hover:bg-[#A06A46] transition"
              >
                Setup
              </button>
            ) : (
              <button
                onClick={() => {
                  const codes = Array.from({ length: 3 }, () =>
                    Math.random().toString(36).substring(2, 8).toUpperCase()
                  );
                  alert(`Backup Codes Generated:\n${codes.join("\n")}`);
                }}
                className="px-5 py-2 rounded-xl text-white font-medium text-sm bg-[#A06A46] hover:bg-[#8C5838] transition"
              >
                Generate
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Account Actions */}
      <div className={`p-6 rounded-2xl border shadow-lg ${card} ${border}`}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaUser size={20} /> Account Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          {accountActions.map((action, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleAction(action.label)}
              className="px-4 py-2 rounded-2xl font-semibold text-white transition flex items-center gap-2"
              style={{ backgroundColor: action.color }}
            >
              {action.icon && action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>
        {actionStatus && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-sm font-medium"
          >
            {actionStatus}
          </motion.p>
        )}
      </div>

      {/* Settings Overview */}
      <div>
        <h3
          className={`text-2xl font-bold mb-4 pb-2 border-b ${
            darkMode ? "border-[#D8AA85]" : "border-[#9B6B43]"
          }`}
        >
          ⚙ Settings Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsData.map((section, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-2xl shadow-lg border ${border} ${card} transition`}
            >
              <h4 className="flex items-center gap-2 text-lg font-semibold border-b pb-2 border-gray-600">
                <span className="text-xl">{section.icon}</span>
                {section.title}
              </h4>
              <ul
                className={`mt-3 text-sm space-y-2 ${
                  darkMode ? "text-[#FFF6F0]" : "text-[#4B3A2E]"
                }`}
              >
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => handleSectionClick(section.title, item)}
                    className="hover:text-[#B07A52] cursor-pointer transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {sectionStatus[section.title] && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs mt-2 text-green-300"
                >
                  {sectionStatus[section.title]}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`rounded-2xl shadow-lg p-5 border ${card} ${border}`}
      >
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <FaChartBar /> Weekly Usage Analytics
        </h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="usage"
              stroke={brownPrimary}
              strokeWidth={3}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? "#C6936D" : "#B4875A"}
            />
            <XAxis dataKey="name" stroke={darkMode ? "#FFF6F0" : "#4B3A2E"} />
            <YAxis stroke={darkMode ? "#FFF6F0" : "#4B3A2E"} />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Footer */}
      <footer
        className={`text-center py-4 text-sm mt-auto border-t ${
          darkMode
            ? "border-[#D8AA85] text-[#FFF6F0]"
            : "border-[#9B6B43] text-[#4B3A2E]"
        }`}
      >
        © 2025 Civix. All rights reserved.
      </footer>
    </div>
  );
};

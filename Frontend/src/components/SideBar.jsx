import { useState } from "react";
import { FaHome, FaFileAlt, FaClock, FaUserTie, FaChartBar, FaCog, FaQuestionCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export const SideBar = () => {
  const colors = {
    dashboard: false,
    petitions: false,
    polls: false,
    officials: false,
    reports: false,
    settings: false,
    help: false,
  }
  const location = useLocation().pathname.split("\/");
  const [active, setActive] = useState({ ...colors, [location[location.length - 1]]: true });

  const handleClick = (name) => {
    setActive({ ...colors, [name]: true });
  }

  return (
    <div className="fixed min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white flex flex-col p-2 space-y-6 w-15 md:w-50 transition-all duration-300 pt-4 shadow-lg">

      <nav className="flex flex-col space-y-2">
        <Link
          to="/home/dashboard"
          className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-colors duration-200
      ${active.dashboard
              ? "bg-[#2563eb] text-white shadow-md"
              : "hover:bg-[#1e3a8a] hover:text-white text-gray-300"}`}
          onClick={() => handleClick("dashboard")}
        >
          <FaHome className="text-xl" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>

        <Link
          to="/home/petitions"
          className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-colors duration-200
      ${active.petitions
              ? "bg-[#2563eb] text-white shadow-md"
              : "hover:bg-[#1e3a8a] hover:text-white text-gray-300"}`}
          onClick={() => handleClick("petitions")}
        >
          <FaFileAlt className="text-xl" />
          <span className="hidden md:inline">Petitions</span>
        </Link>

        <Link
          to="/home/polls"
          className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-colors duration-200
      ${active.polls
              ? "bg-[#2563eb] text-white shadow-md"
              : "hover:bg-[#1e3a8a] hover:text-white text-gray-300"}`}
          onClick={() => handleClick("polls")}
        >
          <FaClock className="text-xl" />
          <span className="hidden md:inline">Polls</span>
        </Link>

        <Link
          to="/home/officials"
          className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-colors duration-200
      ${active.officials
              ? "bg-[#2563eb] text-white shadow-md"
              : "hover:bg-[#1e3a8a] hover:text-white text-gray-300"}`}
          onClick={() => handleClick("officials")}
        >
          <FaUserTie className="text-xl" />
          <span className="hidden md:inline">Officials</span>
        </Link>

        <Link
          to="/home/reports"
          className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-colors duration-200
      ${active.reports
              ? "bg-[#2563eb] text-white shadow-md"
              : "hover:bg-[#1e3a8a] hover:text-white text-gray-300"}`}
          onClick={() => handleClick("reports")}
        >
          <FaChartBar className="text-xl" />
          <span className="hidden md:inline">Reports</span>
        </Link>

        <Link
          to="/home/settings"
          className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-colors duration-200
      ${active.settings
              ? "bg-[#2563eb] text-white shadow-md"
              : "hover:bg-[#1e3a8a] hover:text-white text-gray-300"}`}
          onClick={() => handleClick("settings")}
        >
          <FaCog className="text-xl" />
          <span className="hidden md:inline">Settings</span>
        </Link>

        <Link
          to="#"
          className={`flex items-center space-x-3 p-2 rounded-lg font-medium transition-colors duration-200
      ${active.help
              ? "bg-[#2563eb] text-white shadow-md"
              : "hover:bg-[#1e3a8a] hover:text-white text-gray-300"}`}
          onClick={() => handleClick("help")}
        >
          <FaQuestionCircle className="text-xl" />
          <span className="hidden md:inline">Help & Support</span>
        </Link>
      </nav>
    </div>

  );
};


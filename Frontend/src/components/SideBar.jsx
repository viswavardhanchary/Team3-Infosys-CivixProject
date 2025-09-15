import { FaHome, FaFileAlt, FaClock, FaUserTie, FaChartBar, FaCog, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export const SideBar = () => {
  return (
    <div className="h-screen bg-[#5a2320] text-white flex flex-col p-4 space-y-6 w-20 md:w-64 transition-all duration-300">
      
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaHome className="text-xl" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>
        <Link to="/petitions" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaFileAlt className="text-xl" />
          <span className="hidden md:inline">Petitions</span>
        </Link>
        <Link to="/polls" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaClock className="text-xl" />
          <span className="hidden md:inline">Polls</span>
        </Link>
        <Link to="/officials" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaUserTie className="text-xl" />
          <span className="hidden md:inline">Officials</span>
        </Link>
        <Link to="/reports" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaChartBar className="text-xl" />
          <span className="hidden md:inline">Reports</span>
        </Link>
        <Link to="/settings" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaCog className="text-xl" />
          <span className="hidden md:inline">Settings</span>
        </Link>
      </nav>


      <div className="mt-auto">
        <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaQuestionCircle className="text-xl" />
          <span className="hidden md:inline">Help & Support</span>
        </Link>
      </div>
    </div>
  );
};


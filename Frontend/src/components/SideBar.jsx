import { FaHome, FaFileAlt, FaClock, FaUserTie, FaChartBar, FaCog, FaQuestionCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export const SideBar = () => {
  return (
    <div className="fixed min-h-screen bg-[#5a2320] text-white flex flex-col p-1 space-y-6 w-14 md:w-50 transition-all duration-300 pt-2">
      
      <nav className="flex flex-col space-y-2">
        <Link to="/home/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaHome className="text-xl" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>
        <Link to="/home/petitions" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaFileAlt className="text-xl" />
          <span className="hidden md:inline">Petitions</span>
        </Link>
        <Link to="/home/polls" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaClock className="text-xl" />
          <span className="hidden md:inline">Polls</span>
        </Link>
        <Link to="/home/officials" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaUserTie className="text-xl" />
          <span className="hidden md:inline">Officials</span>
        </Link>
        <Link to="/home/reports" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaChartBar className="text-xl" />
          <span className="hidden md:inline">Reports</span>
        </Link>
        <Link to="/home/settings" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaCog className="text-xl" />
          <span className="hidden md:inline">Settings</span>
        </Link>
        <Link to="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#c19a6b] hover:text-[#5a2320]">
          <FaQuestionCircle className="text-xl" />
          <span className="hidden md:inline">Help & Support</span>
        </Link>
      </nav>
    </div>
  );
};


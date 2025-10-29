import { useEffect, useState } from "react";
import {
  FaHome,
  FaFileAlt,
  FaClock,
  FaUserTie,
  FaChartBar,
  FaCog,
  FaQuestionCircle,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userInfo } from "../axios/user";

export const SideBar = () => {
  const location = useLocation();
  const [active, setActive] = useState({
    dashboard: false,
    petitions: false,
    polls: false,
    officials: false,
    reports: false,
    settings: false,
    help: false,
  });

  const updateActiveFromURL = (path) => {
    const current = {
      dashboard: path.includes("dashboard"),
      petitions: path.includes("petitions"),
      polls: path.includes("polls"),
      officials: path.includes("officials"),
      reports: path.includes("reports"),
      settings: path.includes("settings"),
      help: path.includes("help"),
    };
    const isAnyTrue = Object.values(current).some(Boolean);
    if (!isAnyTrue) current.dashboard = true;
    setActive(current);
  };

  useEffect(() => {
    updateActiveFromURL(location.pathname);
  }, [location]);

  const handleClick = (name) => {
    setActive({
      dashboard: false,
      petitions: false,
      polls: false,
      officials: false,
      reports: false,
      settings: false,
      help: false,
      [name]: true,
    });
  };

  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const getUser = async () => {
    const userData = await userInfo();
    if (!userData.found) {
      navigate("/login");
    } else {
      setData(userData.user);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="fixed min-h-screen flex flex-col space-y-6 pl-3 pt-1 w-18 md:w-48 transition-all duration-300 shadow-md bg-[#fdf3e7] border-r border-[#d6bfa6] text-[#3a2e28]">
      <nav className="flex flex-col space-y-2 items-center md:items-start w-full p-1">
        {[
          { to: "/home/dashboard", icon: FaHome, label: "Dashboard", key: "dashboard" },
          { to: "/home/petitions", icon: FaFileAlt, label: "Petitions", key: "petitions" },
          { to: "/home/polls", icon: FaClock, label: "Polls", key: "polls" },
          { to: "/home/officials", icon: FaUserTie, label: "Officials", key: "officials" },
          { to: "/home/reports", icon: FaChartBar, label: "Reports", key: "reports" },
          { to: "/home/settings", icon: FaCog, label: "Settings", key: "settings" },
          { to: "/home/help-support", icon: FaQuestionCircle, label: "Help & Support", key: "help" },
        ].map(
          (item) =>
            ((item.key === "officials" && data?.email.endsWith("@civix.gov.in")) ||
              item.key !== "officials") && (
              <Link
                key={item.key}
                to={item.to}
                className={`flex items-center space-x-3 p-2 rounded-lg w-full font-medium transition-all duration-200 ${
                  active[item.key]
                    ? "bg-[#8B5E3C] text-white shadow-md"
                    : "hover:bg-[#a18464] hover:text-white text-[#4a2c2a]"
                }`}
                onClick={() => handleClick(item.key)}
              >
                <item.icon
                  className={`text-xl transition ${
                    active[item.key] ? "text-white" : "text-[#8B5E3C]"
                  }`}
                />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            )
        )}
      </nav>
    </div>
  );
};

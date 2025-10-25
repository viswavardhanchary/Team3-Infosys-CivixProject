import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPollsData, remove } from "../axios/poll";
import { userInfo } from "../axios/user";
import { Bounce, toast } from "react-toastify";
import { PollsCard } from "../components/PollsCard";

export const Polls = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [data, setData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activeTab, selectedLocation, polls, data]);

  const getUser = async () => {
    const userData = await userInfo();
    if (!userData?.found) {
      navigate("/login");
    } else {
      setData(userData.user);
      setIsAdmin(userData.user.email.endsWith("@civix.gov.in"));
      getPolls();
    }
  };

  const getPolls = async () => {
    const pollsData = await getPollsData();
    if (!pollsData.found) {
      toast.error(pollsData.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    setPolls(pollsData.data);
  };

  const handleDelete = async (cur) => {
    const response = await remove(cur._id);
    if (response.found) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
      getPolls();
    } else {
      toast.error(response.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    }
  };


  const applyFilters = () => {
    if (!data) return;

    let filtered = [...polls];


    if (selectedLocation !== "All") {
      filtered = filtered.filter((p) => p.location === selectedLocation);
    }


    switch (activeTab) {
      case "active":
        filtered = filtered.filter((p) => !p.isClosed); 
        break;
      case "voted":
        filtered = filtered.filter((p) =>
          p.options.some((opt) => opt.votes.includes(data._id))
        );
        break;
      case "mine":
        filtered = filtered.filter((p) => p.created_user_id === data._id);
        break;
      case "closed":
        filtered = filtered.filter((p) => p.isClosed);
        break;
      default:
        break;
    }

    setFilteredPolls(filtered);
  };


  const clearFilters = () => {
    setActiveTab("active");
    setSelectedLocation("All");
  };

  const tabs = [
    { key: "active", label: "Active Polls" },
    { key: "voted", label: "Polls I Voted On" },
    { key: "mine", label: "My Polls" },
    { key: "closed", label: "Closed Polls" },
  ];

  return (
    <div className="flex flex-col w-full h-full text-white gap-3">


  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#0055A4] to-[#0073E6] p-4 rounded-md shadow-lg text-white">
    <div className="flex flex-col">
      <h2 className="text-2xl md:text-3xl font-bold">Polls</h2>
      <p className="opacity-90 text-[#E5E5E5]">
        Participate in community polls and make your voice heard.
      </p>
    </div>
    <Link
      to="/home/polls/form"
      className="px-4 py-2 md:text-lg rounded-md bg-[#4CAF50] hover:bg-white hover:text-[#4CAF50] transition font-semibold"
    >
      Create Poll
    </Link>
  </div>

  {/* Tabs + Location Filter */}
  <div className="flex justify-between items-center flex-wrap gap-2">
    <div className="flex gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`px-4 py-2 rounded-md text-white font-semibold transition cursor-pointer ${
            activeTab === tab.key ? "bg-[#003f7f]" : "bg-[#0055A4]"
          } hover:bg-[#003366]`}
        >
          {tab.label}
        </button>
      ))}
    </div>

    <select
      value={selectedLocation}
      onChange={(e) => setSelectedLocation(e.target.value)}
      className="p-2 rounded-md border border-[#0055A4] bg-[#1e293b] text-white outline-none cursor-pointer"
    >
      <option value="All">All Locations</option>
      <option value="Telangana">Telangana</option>
      <option value="Andhra Pradesh">Andhra Pradesh</option>
      <option value="New Delhi">New Delhi</option>
      <option value="Kerala">Kerala</option>
      <option value="Tamil Nadu">Tamil Nadu</option>
    </select>
  </div>

  {/* Poll Cards */}
  {filteredPolls.length !== 0 ? (
    filteredPolls.map((curPoll, idx) => (
      <PollsCard
        key={idx}
        poll={curPoll}
        currentUserId={data._id}
        getPolls={getPolls}
        data={data}
        handleDelete={handleDelete}
      />
    ))
  ) : (
    <div className="flex flex-col items-center justify-center gap-3 p-6 bg-[#1e293b] rounded-md shadow-md border border-[#333333] text-center">
      <p className="text-[#E5E5E5] font-semibold text-lg">
        No Polls Found with the current filters
      </p>
      <button
        onClick={clearFilters}
        className="px-4 py-2 rounded-md bg-[#0055A4] hover:bg-[#003366] text-white font-semibold transition"
      >
        Clear Filters
      </button>
    </div>
  )}
</div>

  );
};

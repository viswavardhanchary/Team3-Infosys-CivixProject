import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPollsData, remove } from "../axios/poll";
import { userInfo } from "../axios/user";
import { Bounce, toast } from "react-toastify";
import { PollsCard } from "../components/PollsCard";

export const Polls = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [polls, setPolls] = useState([]);
  const [data, setData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    getUser();
  }, []);


  const getUser = async () => {
    const userData = await userInfo();
    if (!userData?.found) {
      navigate('/login');
    } else {
      setData(userData.user);
      setIsAdmin(userData.user.email.endsWith("@civix.gov.in"));
      getPolls();
    }
  }

  const getPolls = async () => {
    const pollsData = await getPollsData();
    if (!pollsData.found) {
      toast.error(pollsData.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    setPolls(pollsData.data);
  }

  const handleDelete = async (cur) => {
    const response = await remove(cur._id);
    if (response.found) {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      getPolls();
      return ;
    } else {
      toast.error(response.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return ;
    }
  }

  const tabs = [
    { key: "active", label: "Active Polls" },
    { key: "voted", label: "Polls I Voted On" },
    { key: "mine", label: "My Polls" },
    { key: "closed", label: "Closed Polls" },
  ];

  return (
    <div className="flex flex-col w-full h-full text-white gap-3 ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#2563eb] to-[#436df7] p-4 rounded-md shadow-lg text-white">
        <div className="flex flex-col">
          <h2 className="text-2xl md:text-3xl font-bold">Polls</h2>
          <p className="opacity-90">
            Participate in community polls and make your voice heard.
          </p>
        </div>
        <Link
          to="/home/polls/form"
          className="px-4 py-2 md:text-lg rounded-md bg-[#067704] hover:bg-white hover:text-[#067704] transition font-semibold"
        >
          Create Poll
        </Link>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-2 ">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-md hover:bg-[#1e40af] text-white font-semibold transition cursor-pointer ${activeTab === tab.key ?
                "bg-[#000561]" : "bg-[#2563eb]"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select className="p-2 rounded-md border border-[#2563eb] bg-[#0f172a] text-white outline-none cursor-pointer">
          <option value="All">All Locations</option>
          <option value="Telangana">Telangana</option>
          <option value="Andhra Pradesh">Andhra Pradesh</option>
          <option value="New Delhi">New Delhi</option>
          <option value="Kerala">Kerala</option>
          <option value="Tamil Nadu">Tamil Nadu</option>
        </select>
      </div>

      {polls.length !== 0 ? polls.map((curPoll, idx) => {
        return <div key={idx}>
          <PollsCard
            poll={curPoll}
            currentUserId={data._id}
            getPolls={getPolls}
            data={data}
            handleDelete={handleDelete}
          />
        </div>
      }) : <div className="flex flex-col items-center justify-center gap-3 p-6 bg-[#0f172a] rounded-md shadow-md border border-[#1e293b] text-center">
        <p className="text-gray-300 font-semibold text-lg">No Polls Found with the current filters</p>
        <button className="px-4 py-2 rounded-md bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold transition">
          Clear Filters
        </button>
      </div>
      }



    </div>
  );
};
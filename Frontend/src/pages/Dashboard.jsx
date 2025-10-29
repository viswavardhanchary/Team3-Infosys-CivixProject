import { useEffect, useState } from "react";
import { MdEditNote } from "react-icons/md";
import { FaSignature, FaTasks, FaClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { userInfo } from "../axios/user";
import { Bounce, toast } from "react-toastify";
import { PetitionsCard } from "../components/PetitionsCard";
import { getPetitionsData, remove } from "../axios/petition";
import { addSignToPetition, removeSignToPetition } from "../axios/sign";
import { getPollsData } from "../axios/poll";
import { Api } from "../axios/api";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [userPetitions, setUserPetitions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [acOrUrPet, setAcOrUrPet] = useState(0);
  const [pollsCountByMe, setPollsCountByMe] = useState(0);
  const [polls, setPolls] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [filters, setFilters] = useState({
    type: "All",
    location: "All",
    category: "All",
    status: "All",
  });
  const [buttons, setButtons] = useState({
    All: true,
    environment: false,
    infrastructure: false,
    education: false,
    "public safety": false,
    transportation: false,
    healthcare: false,
    housing: false,
  });

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const userData = await userInfo();
    if (!userData?.found) {
      navigate("/login");
    } else {
      setData(userData.user);
      const adminCheck = userData.user.email.endsWith("@civix.gov.in");
      setIsAdmin(adminCheck);
      getPetitions(userData.user);
      getPolls(userData.user);
      if (!adminCheck) getActivityLogs(userData.user._id);
    }
  };

  const getPetitions = async (userData) => {
    const petitionsData = await getPetitionsData();
    if (!petitionsData.found) {
      toast.error(petitionsData.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
      return;
    }
    setPetitions(petitionsData.data);
    const userPetitionsData = petitionsData.data.filter(
      (pet) => pet.created_user_id === userData._id
    );
    setUserPetitions(userPetitionsData);
    setAcOrUrPet(updateAcOrUr(userPetitionsData));
  };

  const getPolls = async (userData) => {
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
    const count = pollsData.data.filter(
      (c) => c.created_user_id === userData._id
    ).length;
    setPollsCountByMe(count);
  };

  const getActivityLogs = async (userId) => {
    try {
      const res = await Api.get(`/log/${userId}`);
      if (res.data?.found) {
        setActivityLogs(res.data.logs.slice(0, 5)); // show only latest 5
      }
    } catch (err) {
      console.error("Error fetching activity logs:", err);
    }
  };

  const updateAcOrUr = (petData) => {
    return petData.filter(
      (c) => c.status === "Under Review" || c.status === "Closed"
    ).length;
  };

  const handleSignPetition = async (pet, signed_user_id) => {
    if (!data) return;
    const found = isSigned(pet);
    if (found) {
      await removeSignToPetition({
        user_id: signed_user_id,
        petition_id: pet._id,
        id: found,
      });
      await getUser();
      return;
    }
    const sign = await addSignToPetition({
      user_id: data._id,
      petition_id: pet._id,
      signed_user_id,
    });
    if (sign.found) {
      await getUser();
    } else {
      toast.error(sign.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const isSigned = (curPet) => {
    if (!data) return null;
    for (let i = 0; i < curPet.signedBy.length; i++) {
      if (data.signedByMe.includes(curPet.signedBy[i]))
        return curPet.signedBy[i];
    }
    return null;
  };

  const handleDelete = async (id) => {
    await remove({ id });
    getUser();
  };

  const handleFilterClick = (e, name) => {
    if (filters[name] === e.target.value) return;
    if (name === "category")
      setButtons({
        All: false,
        environment: false,
        infrastructure: false,
        education: false,
        "public safety": false,
        transportation: false,
        healthcare: false,
        housing: false,
        [e.target.value]: true,
      });
    setFilters((prev) => ({ ...prev, [name]: e.target.value }));
  };

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Welcome Card */}
      <div className="rounded-md bg-[#A67C52] p-4 shadow-lg min-w-[300px]">
        <div className="flex flex-col text-[#333333] break-all">
          <h1 className="text-md md:text-3xl font-bold break-all text-white">
            Welcome Back, {data ? data.name : "User"}!
          </h1>
          <p className="m-0 p-0 break-all text-[#5A3E1B]">
            See what’s happening in our community and make your voice heard.
          </p>
        </div>
      </div>

      {/* Dashboard Cards */}
      {!isAdmin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col p-4 bg-[#A67C52] rounded-lg shadow-md border border-[#333333]">
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-[#333333]">
                  My Petitions
                </p>
                <Link to="/home/petitions" className="text-2xl text-white">
                  <MdEditNote />
                </Link>
              </div>
              <div className="text-3xl font-bold text-white">
                {userPetitions.length}
              </div>
              <p className="text-md text-[#333333]">petitions</p>
            </div>

            <div className="flex flex-col p-4 bg-[#A67C52] rounded-lg shadow-md border border-[#333333]">
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-[#333333]">
                  Successful Petitions
                </p>
                <Link to="/home/petitions" className="text-2xl text-white">
                  <FaSignature />
                </Link>
              </div>
              <div className="text-3xl font-bold text-white">{acOrUrPet}</div>
              <p className="text-md text-[#333333]">or under review</p>
            </div>

            <div className="flex flex-col p-4 bg-[#A67C52] rounded-lg shadow-md border border-[#333333]">
              <div className="flex justify-between items-center">
                <p className="text-xl font-semibold text-[#333333]">
                  Polls Created
                </p>
                <Link to="/home/polls" className="text-xl text-white">
                  <FaTasks />
                </Link>
              </div>
              <div className="text-3xl font-bold text-white">
                {pollsCountByMe}
              </div>
              <p className="text-md text-[#333333]">polls</p>
            </div>
          </div>

          {/* Recent Activity Logs */}
          <div className="bg-[#A67C52] p-4 rounded-lg shadow-md border border-[#333333] mt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FaClock /> Recent Activity
              </h2>
            </div>
            {activityLogs.length > 0 ? (
              <ul className="space-y-2">
                {activityLogs.map((log, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-[#E6D5B8] text-[#333333] px-3 py-2 rounded-md"
                  >
                    <span>{log.activity}</span>
                    <span className="text-sm text-[#5A3E1B]">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white text-sm">No recent activity found.</p>
            )}
          </div>
        </>
      )}

      {/* Petitions List */}
      <div className="flex flex-col gap-4 p-3">
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <p className="text-md lg:text-2xl font-semibold text-[#333333]">
            Active Petitions Near You
          </p>
        </div>

        {petitions.length !== 0 && data && (
          <PetitionsCard
            petitions={petitions}
            isSigned={isSigned}
            handleDelete={handleDelete}
            data={data}
            handleSignPetition={handleSignPetition}
            filters={filters}
            setFilters={setFilters}
            setButtons={setButtons}
            isAdmin={isAdmin}
            getUser={getUser}
          />
        )}
      </div>
    </div>
  );
};

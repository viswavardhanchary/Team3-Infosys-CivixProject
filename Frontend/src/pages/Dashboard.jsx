import { useEffect, useState } from "react";
import { MdEditNote, MdLocationOn } from "react-icons/md";
import { FaSignature, FaTasks, FaClock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { get, userInfo } from "../axios/user";
import { Bounce, toast } from "react-toastify";
import { PetitionsCard } from "../components/PetitionsCard";
import { getPetitionsData, remove } from "../axios/petition";
import { addSignToPetition, removeSignToPetition } from "../axios/sign";
import { getPollsData } from "../axios/poll";
import { getUserLogs } from "../axios/adminLogs";
import {Spinner} from "../components/Spinner";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [userPetitions, setUserPetitions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [acOrUrPet, setAcOrUrPet] = useState(0);
  const [pollsCountByMe, setPollsCountByMe] = useState(0);
  const [polls, setPolls] = useState([]);
  const [activityLogs, setActivityLogs] = useState(null);
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
  const [loading, setLoading] = useState(false); // 🔹 Loading state

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      setLoading(true);
      const userData = await userInfo();
      if (!userData?.found) {
        navigate("/login");
      } else {
        setData(userData.user);
        const adminCheck = userData.user.email.endsWith("@civix.gov.in");
        setIsAdmin(adminCheck);
        await Promise.all([
          getPetitions(userData.user),
          getPolls(userData.user),
          !adminCheck ? getActivityLogs(userData.user._id) : Promise.resolve(),
        ]);
      }
    } catch (error) {
      toast.error("Failed to fetch user info.", {
        position: "top-right",
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const getPetitions = async (userData) => {
    const petitionsData = await getPetitionsData();
    if (!petitionsData.found) {
      toast.error(petitionsData.message, { theme: "dark", transition: Bounce });
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
      toast.error(pollsData.message, { theme: "dark", transition: Bounce });
      return;
    }
    setPolls(pollsData.data);
    const count = pollsData.data.filter(
      (c) => c.created_user_id === userData._id
    ).length;
    setPollsCountByMe(count);
  };

  const getActivityLogs = async (userId) => {
    const userLogs = await getUserLogs(userId);
    if (userLogs.found) {
      setActivityLogs(userLogs.data);
    } else {
      toast.error(userLogs.message, { theme: "dark", transition: Bounce });
    }
  };

  const updateAcOrUr = (petData) => {
    return petData.filter(
      (c) => c.status === "Under Review" || c.status === "Closed"
    ).length;
  };

  const handleSignPetition = async (pet, signed_user_id) => {
    try {
      setLoading(true);
      if (!data) return;
      const found = isSigned(pet);
      if (found) {
        await removeSignToPetition({
          user_id: signed_user_id,
          petition_id: pet._id,
          id: found,
        });
      } else {
        const sign = await addSignToPetition({
          user_id: data._id,
          petition_id: pet._id,
          signed_user_id,
        });
        if (!sign.found) {
          toast.error(sign.message, { theme: "dark", transition: Bounce });
        }
      }
      await getUser();
    } catch {
      toast.error("Error updating signature.", {
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
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
    try {
      setLoading(true);
      await remove({ id });
      await getUser();
    } catch {
      toast.error("Error deleting petition.", {
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
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

  // 🔹 Show spinner when loading
  if (loading) return <Spinner />;

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="rounded-md bg-[#A67C52] p-4 shadow-lg min-w-[200px]">
        <div className="flex flex-col text-[#333333] break-all">
          <h1 className="text-md md:text-3xl font-bold break-all text-white">
            Welcome Back, {data ? data.name : "User"}!
          </h1>
          <p className="m-0 p-0 break-all text-[#5A3E1B]">
            See what’s happening in our community and make your voice heard.
          </p>
        </div>
      </div>

      {!isAdmin && (
        <>
          {/* stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col p-4 bg-[#f3b87d] rounded-lg shadow-md border border-[#333333]">
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

            <div className="flex flex-col p-4 bg-[#f3b87d] rounded-lg shadow-md border border-[#333333]">
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

            <div className="flex flex-col p-4 bg-[#f3b87d] rounded-lg shadow-md border border-[#333333]">
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

          {/* activity logs */}
          <div className="bg-[#A67C52] p-4 rounded-lg shadow-md border border-[#333333] mt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FaClock /> Recent Activity
              </h2>
            </div>
            {activityLogs ? (
              <ul className="space-y-4">
                {activityLogs.activity
                  .slice(0, 5)
                  .reverse()
                  .map((log, i) =>
                    log.text !== "Logined In to Account" ? (
                      <li
                        key={i}
                        className="bg-[#F4EDE4] border border-[#C4975A] p-4 rounded-xl hover:bg-[#FFF1E0] hover:shadow-md transition-all duration-200"
                      >
                        <p className="text-sm text-[#8B5E34]">
                          {log.timestamp}
                        </p>
                        <div className="mt-1">
                          {(() => {
                            const lines = log.text
                              .split("\n")
                              .filter((l) => l.trim() !== "");
                            const heading = lines[0];
                            const details = lines.slice(1);

                            return (
                              <>
                                <h2 className="text-lg font-semibold text-[#8B5E34] mb-2">
                                  {heading} by Officials
                                </h2>

                                {details.map((line, idx) => {
                                  const [key, ...rest] = line.split(":");
                                  const value = rest.join(":").trim();
                                  return (
                                    <p key={idx} className="text-sm">
                                      <span className="font-medium text-[#A67843]">
                                        {key.trim()}:
                                      </span>{" "}
                                      <span className="text-[#3B2A1A]">
                                        {value}
                                      </span>
                                    </p>
                                  );
                                })}
                              </>
                            );
                          })()}
                        </div>
                      </li>
                    ) : null
                  )}
              </ul>
            ) : (
              <p className="text-[#000000] text-center py-8">
                No logs found for the selected date.
              </p>
            )}
          </div>
        </>
      )}

      {/* petitions list */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <p className="text-md lg:text-2xl font-semibold text-[#333333]">
            Active Petitions Near You
          </p>
          <div className="flex gap-2 flex-wrap items-center justify-end">
            <div className="m-0 p-0 text-md font-semibold text-gray-900">
              Showing for:
            </div>
            <div
              className="flex bg-[#ff9100] border border-[#ff8000] rounded-md items-center p-2 text-white cursor-pointer"
              onClick={(e) => {
                handleFilterClick(e, "location");
              }}
            >
              <div className="text-xl text-[#ffffff]">
                <MdLocationOn />
              </div>
              <select
                className="border-none outline-none bg-[#ff9100] text-white"
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
                value={filters.status}
              >
                <option value="All">All Locations</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>
          </div>
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

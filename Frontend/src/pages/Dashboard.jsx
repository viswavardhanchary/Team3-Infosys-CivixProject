import { useEffect, useState } from "react";
import { MdEditNote, MdLocationOn } from 'react-icons/md';
import { FaSignature, FaTasks } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { userInfo } from "../axios/user";
import { Bounce, toast } from "react-toastify";
import { PetitionsCard } from "../components/PetitionsCard";
import { getPetitionsData, remove } from "../axios/petition";

import { addSignToPetition, removeSignToPetition } from "../axios/sign";
import { getPollsData } from "../axios/poll";


export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [userPetitions, setUserPetitions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [acOrUrPet, setAcOrUrPet] = useState(0);
  const [pollsCountByMe, setPollsCountByMe] = useState(0);
  const [polls, setPolls] = useState([]);
  const [filters, setFilters] = useState({
    type: "All",
    location: "All",
    category: "All",
    status: "All"
  });
  const [buttons, setButtons] = useState({
    'All': true,
    "environment": false,
    "infrastructure": false,
    "education": false,
    "public safety": false,
    "transportation": false,
    "healthcare": false,
    "housing": false
  })

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
      getPetitions(userData.user);
      getPolls(userData.user);

    }
  }

  const getPetitions = async (userData) => {
    const petitionsData = await getPetitionsData();
    if (!petitionsData.found) {
      toast.error(petitionsData.message, {
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
    setPetitions(petitionsData.data);
    const userPetitionsData = petitionsData.data.filter((pet) => {
      return pet.created_user_id === userData._id;
    });
    setUserPetitions(userPetitionsData);
    setAcOrUrPet(updateAcOrUr(userPetitionsData));

  }

  const getPolls = async (userData) => {
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
    const curPoll = pollsData.data;
    let count = 0;
    curPoll.map((c) => {
      c.created_user_id === userData._id && count++;
    });
    setPollsCountByMe(count);
  }

  const updateAcOrUr = (petData) => {
    let count = 0;
    petData.map((c) => {
      (c.status === "Under Review" || c.status === "Closed") && count++
    });
    return count;

  }

  const handleSignPetition = async (pet, signed_user_id, e) => {
    const found = isSigned(pet);
    if (found) {
      const response = await removeSignToPetition({ user_id: signed_user_id, petition_id: pet._id, id: found });
      await getUser();
      return;
    }
    const sign = await addSignToPetition({ user_id: data._id, petition_id: pet._id, signed_user_id });
    if (sign.found) {
      await getUser();
      return;
    } else {
      toast.error(sign.message, {
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
  }
  const isSigned = (curPet) => {
    for (let i = 0; i < curPet.signedBy.length; i++) {
      if (data.signedByMe.includes(curPet.signedBy[i])) return curPet.signedBy[i];
    }
    return null;
  }


  const handleDelete = async (id) => {
    await remove({ id });
    getUser();
  }

  const handleFilterClick = async (e, name) => {
    if (filters[name] === e.target.value) return;
    if (name === "category")
      setButtons({
        'All': false,
        "environment": false,
        "infrastructure": false,
        "education": false,
        "public safety": false,
        "transportation": false,
        "healthcare": false,
        "housing": false,
        [e.target.value]: true
      })
    setFilters((prev) => ({ ...prev, [name]: e.target.value }));
  }

  return <>
    <div className="flex flex-col flex-1 gap-6">
      <div className="rounded-md bg-[#eedddb] p-1 md:p-4 shadow-lg min-w-[300px]">
        <div className="flex flex-col text-black break-all">
          <h1 className="text-md md:text-3xl font-bold break-all">
            Welcome Back, {data ? data.name : "User"}!
          </h1>
          <p className="m-0 p-0 break-all">
            See what’s happening in our community and make your voice heard.
          </p>
        </div>

      </div>

      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col p-4 bg-[#f0d8a7] rounded-lg shadow-md border border-[#333333]">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold text-[#333333]">My Petitions</p>
              <Link to="/home/petitions" className="text-2xl text-[#0055A4]">
                <MdEditNote />
              </Link>
            </div>
            <div className="text-3xl font-bold text-[#333333]">{userPetitions.length}</div>
            <p className="text-md text-[#333333]">petitions</p>
          </div>

          <div className="flex flex-col p-4 bg-[#a0f5b9] rounded-lg shadow-md border border-[#333333]">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold text-[#333333]">Successful Petitions</p>
              <Link to="/home/petitions" className="text-2xl text-[#0055A4]">
                <FaSignature />
              </Link>
            </div>
            <div className="text-3xl font-bold text-[#333333]">{acOrUrPet}</div>
            <p className="text-md text-[#333333]">or under review</p>
          </div>

          <div className="flex flex-col p-4 bg-[#fab5b5] rounded-lg shadow-md border border-[#333333]">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold text-[#333333]">Polls Created</p>
              <Link to="/home/polls" className="text-xl text-[#0055A4]">
                <FaTasks />
              </Link>
            </div>
            <div className="text-3xl font-bold text-[#333333]">{pollsCountByMe}</div>
            <p className="text-md text-[#333333]">polls</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 p-3">
        <div className="flex justify-between items-start gap-2 flex-wrap">
          <p className="text-md lg:text-2xl font-semibold text-[#333333]">
            Active Petitions Near You
          </p>
          <div className="flex gap-2 flex-wrap items-center justify-end">
            <div className="m-0 p-0 text-md font-semibold text-[#333333]">Showing for:</div>
            <div
              className="flex bg-[#E5E5E5] border border-[#0055A4] rounded-md items-center p-2 text-[#333333] cursor-pointer"
              onClick={(e) => {
                handleFilterClick(e, "location");
              }}
            >
              <div className="text-xl text-[#0055A4]">
                <MdLocationOn />
              </div>
              <select
                className="border-none outline-none bg-[#E5E5E5] text-[#333333]"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
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

        <div className="flex items-center lg:justify-between font-semibold gap-2 flex-wrap">
          {[
            "All Categories",
            "Environment",
            "Infrastructure",
            "Education",
            "Public Safety",
            "Transportation",
            "Health Care",
            "Housing",
          ].map((cat) => (
            <button
              key={cat}
              value={cat === "All Categories" ? "All" : cat.toLowerCase()}
              onClick={(e) => {
                handleFilterClick(e, "category");
              }}
              className={`rounded-md px-4 py-2 ${buttons[cat === "All Categories" ? "All" : cat.toLowerCase()]
                ? "bg-[#1D0A69]"
                : "bg-[#0055A4]"
                } hover:bg-[#1D0A69] text-white cursor-pointer transition-colors duration-200`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex w-full gap-5 items-start">
          {petitions.length === 0 && (
            <div className="bg-[#E5E5E5] rounded-xl shadow-lg p-5 flex gap-2 flex-col justify-between border border-[#333333] hover:shadow-xl transition w-full items-center">
              <div className="font-semibold text-xl text-[#333333] text-center">
                No Petitions Found with the current filters
              </div>
              <button className="bg-[#0055A4] hover:bg-[#1D0A69] text-white px-4 py-2 rounded-md font-semibold w-max cursor-pointer">
                Clear Filters
              </button>
            </div>
          )}
          {petitions?.length !== 0 && (
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
    </div>;



  </>
}
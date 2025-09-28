import { useEffect, useState } from "react";
import { MdEditNote, MdLocationOn } from 'react-icons/md';
import { FaSignature, FaTasks } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { userInfo } from "../axios/user";
import { Bounce, toast } from "react-toastify";
import { PetitionsCard } from "../components/PetitionsCard";
import { getPetitionsData, remove } from "../axios/petition";

import { addSignToPetition, removeSignToPetition } from "../axios/sign";


export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [userPetitions, setUserPetitions] = useState([]);
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
      getPetitions(userData.user);
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
      <div className="flex flex-col rounded-md bg-gradient-to-r from-[#2563eb] to-[#436df7] p-4 text-white shadow-lg">
        <h1 className="text-md md:text-3xl font-bold">
          Welcome Back, {data ? data.name : "User"}!
        </h1>
        <p className="opacity-90">
          See what’s happening in our community and make your voice heard.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col p-4 bg-[#0f172a] rounded-lg shadow-md border border-[#1e293b]">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-white">My Petitions</p>
            <Link to="/home/petitions" className="text-2xl text-[#2563eb]">
              <MdEditNote />
            </Link>
          </div>
          <div className="text-3xl font-bold text-white">{userPetitions.length}</div>
          <p className="text-md text-gray-400">petitions</p>
        </div>

        <div className="flex flex-col p-4 bg-[#0f172a] rounded-lg shadow-md border border-[#1e293b]">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-white">Successful Petitions</p>
            <Link to="/home/petitions" className="text-2xl text-[#2563eb]">
              <FaSignature />
            </Link>
          </div>
          <div className="text-3xl font-bold text-white">0</div>
          <p className="text-md text-gray-400">or under review</p>
        </div>

        <div className="flex flex-col p-4 bg-[#0f172a] rounded-lg shadow-md border border-[#1e293b]">
          <div className="flex justify-between items-center">
            <p className="text-xl font-semibold text-white">Polls Created</p>
            <Link to="/home/polls" className="text-xl text-[#2563eb]">
              <FaTasks />
            </Link>
          </div>
          <div className="text-3xl font-bold text-white">0</div>
          <p className="text-md text-gray-400">polls</p>
        </div>
      </div>


      <div className="flex flex-col gap-4 p-3">
        <div className="flex justify-between items-start gap-2">
          <p className="text-lg lg:text-2xl font-semibold text-dark">
            Active Petitions Near You
          </p>
          <div className="flex gap-2 flex-wrap items-center justify-end">
            <div className="m-0 p-0 text-md font-semibold text-gray-900">Showing for:</div>
            <div className="flex bg-[#0f172a] border border-[#2563eb] rounded-md items-center p-2 text-white cursor-pointer" onClick={(e) => { handleFilterClick(e, "location") }}>
              <div className="text-xl text-[#2563eb]">
                <MdLocationOn />
              </div>
              <select className="border-none outline-none bg-[#0f172a] text-white" onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} value={filters.status}>
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
              value={cat === 'All Categories' ? 'All' : cat.toLowerCase()}
              onClick={(e) => { handleFilterClick(e, "category") }}
              className={`rounded-md px-4 py-2 ${buttons[cat === 'All Categories' ? 'All' : cat.toLowerCase()] ? "bg-[#000561]" : "bg-[#2563eb]"} hover:bg-[#1e40af] text-white cursor-pointer transition-colors duration-200`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex w-full gap-5 items-start">
          {petitions.length === 0 && (
            <div className="bg-[#0f172a] rounded-xl shadow-lg p-5 flex gap-2 flex-col justify-between border border-[#1e293b] hover:shadow-xl transition w-full items-center">
              <div className="font-semibold text-xl text-gray-300 text-center">
                No Petitions Found with the current filters
              </div>
              <button className="bg-[#2563eb] hover:bg-[#1e40af] text-white px-4 py-2 rounded-md font-semibold w-max cursor-pointer">
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
            />
          )}
        </div>
      </div>
    </div>


  </>
}

// Lorem ipsum dolor sit, amet consectetur adipisicing elit. Neque temporibus, similique exercitationem architecto repellat natus nobis, suscipit, quaerat sequi eius laborum dolores! Voluptate nostrum sint molestiae exercitationem, aut quisquam possimus.
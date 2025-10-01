import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPetitionsData, remove } from "../axios/petition";
import { userInfo } from "../axios/user";
import { addSignToPetition, removeSignToPetition } from "../axios/sign";
import { toast, Bounce } from 'react-toastify';
import { PetitionsCard } from "../components/PetitionsCard";


export const Petitions = () => {
  const [data, setData] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [userPetitions, setUserPetitions] = useState([]);
  const [isAdmin , setIsAdmin] = useState(false);
  const [filters, setFilters] = useState({
    type: "All",
    location: "All",
    category: "All",
    status: "All"
  });
  const [buttonsColor, setButtonsColor] = useState({
    "All": true,
    "My Petitions": false,
    "Signed by Me": false
  });

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
    if(name === "type" ) 
      setButtonsColor({
        "All": false,
        "My Petitions": false,
        "Signed by Me": false,
        [e.target.value]: true
      })
    setFilters((prev) => ({ ...prev, [name]: e.target.value }));
  }

  return <>
    <div className="flex flex-col flex-1 gap-4">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#2563eb] to-[#436df7] p-4 rounded-md shadow-lg text-white">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold">Petitions</h1>
          <p className="opacity-90">Browse, sign, and track petitions in your community</p>
        </div>
        {!isAdmin && <Link
          to="/home/petitions/form"
          state={{
            title: "",
            category: "",
            location: "",
            goal: 100,
            description: "",
            acknowledge: false,
          }}
          className="px-4 py-2 md:text-lg rounded-md bg-[#067704] hover:bg-white hover:text-[#067704] transition font-semibold"
        >
          Create Petition
        </Link>}
      </div>


      <div className="flex items-center justify-between flex-wrap">
        <div className="flex flex-wrap gap-2 items-center">
          {["All Petitions", "My Petitions", "Signed by Me"].map((filter) => (
            ((isAdmin && filter !== "My Petitions") || !isAdmin) && <button
              key={filter}
              value={filter === "All Petitions" ? "All" : filter}
              onClick={(e) => handleFilterClick(e, "type")}
              className={`px-4 py-2 rounded-md ${buttonsColor[filter === "All Petitions" ? "All" : filter] ? "bg-[#000561]" : "bg-[#2563eb]"} hover:bg-[#1e40af] text-white font-semibold transition cursor-pointer`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <select className="p-2 rounded-md border border-[#2563eb] bg-[#0f172a] text-white outline-none cursor-pointer" onClick={(e) => handleFilterClick(e, "location")} onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))} value={filters.location}>
            <option value="All">All Locations</option>
            <option value="Telangana">Telangana</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="New Delhi">New Delhi</option>
            <option value="Kerala">Kerala</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
          </select>
          <select className="p-2 rounded-md border border-[#2563eb] bg-[#0f172a] text-white outline-none cursor-pointer" onClick={(e) => handleFilterClick(e, "category")} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))} value={filters.category}>
            <option value="All">All Category</option>
            <option value="environment">Environment</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="education">Education</option>
            <option value="public safety">Public Safety</option>
            <option value="transportation">Transportation</option>
            <option value="healthcare">Health Care</option>
            <option value="housing">Housing</option>
          </select>
          <select className="p-2 rounded-md border border-[#2563eb] bg-[#0f172a] text-white outline-none cursor-pointer" onClick={(e) => handleFilterClick(e, "status")} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} value={filters.status}>
            <option value="All">Status: All</option>
            <option value="Active">Status: Active</option>
            <option value="Under Review">Status: Under Review</option>
            <option value="Closed">Status: Closed</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {petitions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 p-6 bg-[#0f172a] rounded-md shadow-md border border-[#1e293b] text-center">
            <p className="text-gray-300 font-semibold text-lg">No Petitions Found with the current filters</p>
            <button className="px-4 py-2 rounded-md bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold transition">
              Clear Filters
            </button>
          </div>
        ) : (
          <PetitionsCard
            petitions={petitions}
            isSigned={isSigned}
            handleDelete={handleDelete}
            data={data}
            handleSignPetition={handleSignPetition}
            filters={filters}
            setFilters={setFilters}
            setButtonsColor={setButtonsColor}
            isAdmin={isAdmin}
            getUser={getUser}
          />
        )}
      </div>
    </div>

  </>
}
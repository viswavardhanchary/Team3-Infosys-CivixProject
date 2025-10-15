import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PetitionModal } from "./PetitionModal";
import { useEffect, useState } from "react";
import { get } from '../axios/user';
import { update } from "../axios/petition";
import { Bounce, toast } from "react-toastify";


export function PetitionsCard({
  petitions,
  isSigned,
  handleDelete,
  data,
  handleSignPetition,
  filters,
  setFilters,
  setButtons,
  setButtonsColor,
  isAdmin,
  getUser
}) {
  const [selectedPet, setSelectedPet] = useState(null);
  const [name, setName] = useState("");
  const [petitionsFilters, setPetitionsFilters] = useState(petitions);

  if (petitions.length === 0) {
    return (
      <div className="flex items-center flex-col gap-3">
        <div className="font-semibold text-xl text-center">
          No Petitions Found with the current filters
        </div>
        <button className="bg-[#c19a6b] p-2 rounded-md font-semibold">
          clear filters
        </button>
      </div>
    );
  }

  useEffect(() => {
    if (filters) {
      const newPet = petitions.filter((pet) => {
        return (
          (pet.location === filters.location || filters.location === "All") &&
          (pet.category === filters.category || filters.category === "All") &&
          (pet.status === filters.status || filters.status === "All") &&
          (filters.type === "All" ||
            (filters.type === "My Petitions" &&
              pet.created_user_id === data._id) ||
            (filters.type === "Signed by Me" && isSigned(pet)))
        );
      });
      setPetitionsFilters(newPet);
    }
  }, [filters, petitions]);

  const userName = async (id) => {
    const d = await get(id);
    return d.found ? d.user.name : null;
  };


  const handleChangeStatus = async (petitionId, newStatus) => {
    const response = await update(petitionId, newStatus);
    if (!response.found) {
      toast.error(response.message, {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      return;
    } else {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 1000,
        theme: "dark",
        transition: Bounce,
      });
      getUser();

    }

  };

  return (
    <>
      <div className="grid md:grid-cols-1 gap-6 w-full">
        {petitionsFilters.length === 0 && (
          <div className="bg-[#0f172a] rounded-xl shadow-lg p-5 flex gap-2 flex-col justify-between border border-[#1e293b] hover:shadow-xl transition w-full items-center">
            <div className="font-semibold text-xl text-gray-300 text-center">
              No Petitions Found with the current filters
            </div>
            <button
              className="bg-[#2563eb] hover:bg-[#1e40af] text-white px-4 py-2 rounded-md font-semibold w-max cursor-pointer"
              onClick={() => {
                setFilters({
                  type: "All",
                  location: "All",
                  category: "All",
                  status: "All",
                });
                if (setButtons) {
                  setButtons({
                    All: true,
                    environment: false,
                    infrastructure: false,
                    education: false,
                    "public safety": false,
                    transportation: false,
                    healthcare: false,
                    housing: false,
                  });
                }
                if (setButtonsColor) {
                  setButtonsColor({
                    All: true,
                    "My Petitions": false,
                    "Signed by Me": false,
                  });
                }
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {petitionsFilters?.slice().reverse().map((pet, idx) => (
          <div
            key={idx}
            className="bg-[#0f172a] rounded-xl shadow-lg p-5 flex flex-col justify-between border border-[#1e293b] hover:shadow-xl transition w-full"
          >
            <div className="flex flex-wrap items-center justify-between">
              <h3 className="font-bold text-lg mb-2 text-white pl-1">
                {pet.title}
              </h3>
              <p className="text-sm text-[#2563eb] mb-1">
                {pet.created_on.split("T")[0].split("-").reverse().join("-") +
                  "  - " +
                  pet.created_on.split("T")[1].split(".")[0] +
                  " IST"}
              </p>
            </div>

            <p className="text-sm text-gray-300 mb-2 line-clamp-3 pl-1 break-all">
              {pet.description}
            </p>

            <div className="flex justify-between items-center mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b] border border-[#2563eb]/50">
                <FaUsers className="text-[#2563eb]" />
                <span className="text-sm font-medium text-white">
                  {pet.signedBy.length} / {pet.goal}
                </span>
              </div>

              {!isAdmin && (
                <p
                  className={`text-md font-semibold ${pet.status === "Active"
                    ? "text-green-500"
                    : pet.status === "Under Review"
                      ? "text-yellow-500"
                      : "text-red-500"
                    }`}
                >
                  {pet.status}
                </p>
              )}


              {isAdmin && (
                <select
                  className="bg-[#1e293b] text-white px-2 py-1 rounded-md border border-[#2563eb]/50"
                  value={pet.status}
                  onChange={(e) =>
                    handleChangeStatus(pet._id, e.target.value)
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Closed">Closed</option>
                </select>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 w-50 flex-wrap">
                <button
                  className="flex-1 bg-[#2563eb] text-white py-2 rounded-lg text-sm hover:bg-[#1e40af] transition cursor-pointer"
                  onClick={async () => {
                    setSelectedPet(pet);
                    setName(await userName(pet.created_user_id));
                  }}
                >
                  View Details
                </button>
                <button
                  disabled={pet.status === "Closed"}
                  className={`flex-1 py-2 rounded-lg text-sm transition
                  ${isSigned(pet)
                      ? "bg-red-500 hover:bg-red-400 text-white"
                      : "bg-[#067704] hover:bg-[#1f531e] text-white"}
                  ${pet.status === "Closed" ? "opacity-50 cursor-not-allowed hover:bg-gray-400" : "cursor-pointer"}
                  `}
                  onClick={(e) => handleSignPetition(pet, data._id, e)}
                >
                  {pet.status === "Closed"
                    ? "Closed"
                    : isSigned(pet)
                      ? "Unsign it"
                      : "Sign it"}
                </button>

              </div>

              <div className="flex gap-3 items-center flex-wrap">

                {pet.created_user_id === data._id && (
                  <Link
                    to={
                      pet.status === "Closed"
                        ? "#" 
                        : "/home/petitions/form"
                    }
                    state={
                      pet.status === "Closed"
                        ? null
                        : {
                          id: pet._id,
                          title: pet.title,
                          category: pet.category,
                          location: pet.location,
                          goal: pet.goal,
                          description: pet.description,
                          acknowledge: false,
                        }
                    }
                    className={`py-2 rounded-lg text-md text-center w-15 transition
        ${pet.status === "Closed"
                        ? "bg-orange-500 text-white cursor-not-allowed opacity-60"
                        : "bg-orange-500 hover:bg-orange-400 text-white cursor-pointer"
                      }`}
                    onClick={(e) => {
                      if (pet.status === "Closed") e.preventDefault(); 
                    }}
                  >
                    Edit
                  </Link>
                )}

                
                {(isAdmin || pet.created_user_id === data._id) && (
                  <button
                    onClick={() => {
                      if (pet.status !== "Closed" || isAdmin) handleDelete(pet._id);
                    }}
                    disabled={pet.status === "Closed" && !isAdmin}
                    className={`py-2 rounded-lg text-md w-15 transition
        ${pet.status === "Closed" && !isAdmin
                        ? "bg-red-600 text-white cursor-not-allowed opacity-60"
                        : "bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                      }`}
                  >
                    Delete
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {selectedPet && (
        <PetitionModal
          pet={selectedPet}
          creatorName={name}
          onClose={() => setSelectedPet(null)}
        />
      )}
    </>
  );
}

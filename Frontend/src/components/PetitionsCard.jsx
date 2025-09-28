import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PetitionModal } from "./PetitionModal";
import { useEffect, useState } from "react";
export function PetitionsCard({ petitions, isSigned, handleDelete, data, handleSignPetition, filters, setFilters, setButtons, setButtonsColor }) {
  const [selectedPet, setSelectedPet] = useState(null);
  const [petitionsFilters, setPetitionsFilters] = useState(petitions);
  if (petitions.length === 0) {
    return (
      <>
        {
          petitions.length === 0 && <div className="flex items-center flex-col gap-3">
            <div className="font-semibold text-xl text-center">No Petitons Found with the current filters</div>
            <button className="bg-[#c19a6b] p-2 rounded-md font-semibold">clear filters</button>
          </div>
        }
      </>
    )
  }
  useEffect(() => {
    if (filters) {
      const newPet = petitions.filter((pet, idx) => {
        return (pet.location === filters.location || filters.location === 'All') &&
          (pet.category === filters.category || filters.category === 'All') &&
          (pet.status === filters.status || filters.status === 'All') &&
          (filters.type === 'All' ||
            (filters.type === 'My Petitions' && pet.created_user_id === data._id) ||
            (filters.type === 'Signed by Me' && isSigned(pet))
          )
      });
      setPetitionsFilters(newPet);
    }
  }, [filters, petitions]);

  return (
    <>

      <div className="grid md:grid-cols-1 gap-6 w-full">
        {
          petitionsFilters.length == 0 && <div className="bg-[#0f172a] rounded-xl shadow-lg p-5 flex gap-2 flex-col justify-between border border-[#1e293b] hover:shadow-xl transition w-full items-center">
            <div className="font-semibold text-xl text-gray-300 text-center">
              No Petitions Found with the current filters
            </div>
            <button className="bg-[#2563eb] hover:bg-[#1e40af] text-white px-4 py-2 rounded-md font-semibold w-max cursor-pointer" onClick={() => {
              setFilters({
                type: "All",
                location: "All",
                category: "All",
                status: "All"
              });
              if (setButtons) {
                setButtons({
                  'All': true,
                  "environment": false,
                  "infrastructure": false,
                  "education": false,
                  "public safety": false,
                  "transportation": false,
                  "healthcare": false,
                  "housing": false
                })
              }
              if (setButtonsColor) {
                setButtonsColor({
                  "All": true,
                  "My Petitions": false,
                  "Signed by Me": false
                })
              }
            }}>
              Clear Filters
            </button>
          </div>
        }
        {petitionsFilters?.slice().reverse().map((pet, idx) => (
          <div
            key={idx}
            className="bg-[#0f172a] rounded-xl shadow-lg p-5 flex flex-col justify-between border border-[#1e293b] hover:shadow-xl transition"
          >
            <div className="flex flex-wrap items-center justify-between">
              <h3 className="font-bold text-lg mb-2 text-white pl-1">{pet.title}</h3>
              <p className="text-sm text-[#2563eb] mb-1">
                {pet.created_on.split("T")[0].split("-").reverse().join("-") +
                  "  - " +
                  pet.created_on.split("T")[1].split(".")[0] +
                  " IST"}
              </p>
            </div>

            <p className="text-sm text-gray-300 mb-2 line-clamp-3 pl-1 text-wrap">
              {pet.description}
            </p>

            <div className="flex justify-between items-center mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b] border border-[#2563eb]/50">
                <FaUsers className="text-[#2563eb]" />
                <span className="text-sm font-medium text-white">
                  {pet.signedBy.length} / {pet.goal}
                </span>
              </div>
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
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2 w-50 flex-wrap">
                <button
                  className="flex-1 bg-[#2563eb] text-white py-2 rounded-lg text-sm hover:bg-[#1e40af] transition cursor-pointer"
                  onClick={() => setSelectedPet(pet)}
                >
                  View Details
                </button>
                <button
                  className={`flex-1 py-2 rounded-lg text-sm cursor-pointer transition ${isSigned(pet)
                    ? "bg-red-500 hover:bg-red-400 text-white"
                    : "bg-[#067704] hover:bg-[#1f531e] text-white"
                    }`}
                  onClick={(e) => handleSignPetition(pet, data._id, e)}
                >
                  {isSigned(pet) ? "Unsign it" : "Sign it"}
                </button>
              </div>

              <div className="flex gap-3 items-center flex-wrap">
                {pet.created_user_id === data._id && (
                  <Link
                    to="/home/petitions/form"
                    state={{
                      id: pet._id,
                      title: pet.title,
                      category: pet.category,
                      location: pet.location,
                      goal: pet.goal,
                      description: pet.description,
                      acknowledge: false,
                    }}
                    className="bg-orange-500 text-white py-2 rounded-lg text-md cursor-pointer w-15 hover:bg-orange-400 text-center transition"
                  >
                    Edit
                  </Link>
                )}
                {pet.created_user_id === data._id && (
                  <button
                    onClick={() => handleDelete(pet._id)}
                    className="bg-red-600 text-white py-2 rounded-lg text-md hover:bg-red-500 transition cursor-pointer w-15"
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
          creatorName={data?.name}
          onClose={() => setSelectedPet(null)}
        />
      )}

    </>
  )
}
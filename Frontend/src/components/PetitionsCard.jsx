import { Link } from "react-router-dom";
import { PetitionModal } from "./PetitionModal";
import { useEffect, useState } from "react";
import { get } from "../axios/user";
import { update } from "../axios/petition";
import { Bounce, toast } from "react-toastify";
import { addPost, getPost, updatePost, deletePost } from "../axios/comments";
import { FaEdit, FaTrash, FaRegCommentDots, FaHeart, FaEye, FaPaperPlane, FaStar } from "react-icons/fa";
import { FaCheck, FaTimes } from "react-icons/fa";

function Comment({ userId, message, userCache, setUserCache, data, petitionId, onEdit, onDelete }) {
  const [name, setName] = useState("");
  const [email , setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message);

  useEffect(() => {
    let isMounted = true;
    const fetchName = async () => {
      if (!userCache[userId]) {
        const n = await get(userId);
        if (isMounted) {
          setName(n.found ? n.user.name : "UnKnown");
          setEmail(n.found ? n.user.email : "Unknown");
          setUserCache((prev) => ({ ...prev, [userId]: n.user.name }));
        }
      } else {
        setName(userCache[userId]);
      }
    };
    fetchName();
    return () => { isMounted = false; };
  }, [userId, userCache, setUserCache]);

  const handleSaveEdit = async () => {
    if (editText.trim() !== message) {
      await onEdit(petitionId, userId, message, editText);
      setIsEditing(false);
    } else {
      toast.info("No changes made", { position: "top-right", theme: "dark", transition: Bounce });
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-start justify-between gap-3 bg-[#F3E8DC] p-3 rounded-lg shadow-sm text-[#333333]">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5A3E1B] text-white font-bold">
          {name ? name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="flex flex-col">
          <span className="flex gap-2 text-sm font-semibold"><span>{name}</span> 
          {email.endsWith("@civix.gov.in") && <span className="text-red-600" title={`Commented By Offical ${name}`}><FaStar/></span>}</span>
          {isEditing ? (
            <div className="flex gap-2 items-center mt-1">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="bg-white border border-[#A67C52] rounded px-2 py-1 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#5A3E1B] w-64"
              />
              <button onClick={handleSaveEdit} className="text-[#5A3E1B] hover:text-[#A67C52] text-lg flex items-center justify-center cursor-pointer" title="Save">
                <FaCheck />
              </button>
              <button onClick={() => { setIsEditing(false); setEditText(message); }} className="text-red-600 hover:text-red-500 text-lg flex items-center justify-center cursor-pointer" title="Cancel">
                <FaTimes />
              </button>
            </div>
          ) : (
            <span className="text-[#333333] text-sm break-words mt-1">{message}</span>
          )}
        </div>
      </div>

      {data._id === userId && !isEditing && (
        <div className="flex gap-2 items-center">
          <button onClick={() => setIsEditing(true)} className="text-[#5A3E1B] hover:text-[#A67C52] text-lg cursor-pointer" title="Edit">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(petitionId, userId, message)} className="text-red-600 hover:text-red-500 text-lg cursor-pointer" title="Delete">
            <FaTrash />
          </button>
        </div>
      )}
    </div>
  );
}

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
  getPetitions,
  getUser
}) {
  const [selectedPet, setSelectedPet] = useState(null);
  const [name, setName] = useState("");
  const [petitionsFilters, setPetitionsFilters] = useState(petitions);
  const [allComments, setAllComments] = useState([]);
  const [showCommentsClick, setShowCommentsClick] = useState([]);
  const [newComments, setNewComments] = useState({});
  const [userCache, setUserCache] = useState({});

  useEffect(() => {
    if (filters) {
      const newPet = petitions.filter((pet) => {
        return (
          (pet.location === filters.location || filters.location === "All") &&
          (pet.category === filters.category || filters.category === "All") &&
          (pet.status === filters.status || filters.status === "All") &&
          (filters.type === "All" ||
            (filters.type === "My Petitions" && pet.created_user_id === data._id) ||
            (filters.type === "Signed by Me" && isSigned(pet)))
        );
      });
      setPetitionsFilters(newPet);
    }
  }, [filters, petitions]);

  const getComments = async (newIds) => {
    let foundData = [];
    for (let id of newIds) {
      const response = await getPost(id);
      if (response.message instanceof Array && response.found) {
        const current = response.message.length > 0 ? [...response.message] : [];
        foundData = [...foundData, ...current];
      }
    }
    setAllComments(foundData);
  };

  const userName = async (id) => {
    const d = await get(id);
    return d.found ? d.user.name : "Unknown";
  };

  const handleChangeStatus = async (petitionId, newStatus) => {
    const response = await update(petitionId, newStatus);
    if (!response.found) {
      toast.error(response.message, { position: "top-right", autoClose: 1000, theme: "dark", transition: Bounce });
      return;
    } else {
      toast.success(response.message, { position: "top-right", autoClose: 1000, theme: "dark", transition: Bounce });
      getUser();
    }
  };

  useEffect(() => {
    if (showCommentsClick.length > 0) {
      getComments(showCommentsClick);
    } else {
      setAllComments([]);
    }
  }, [showCommentsClick]);

  const display = (id) => {
    let newIds = [];
    if (showCommentsClick.includes(id)) {
      newIds = showCommentsClick.filter((cur) => cur !== id);
    } else {
      newIds = [...showCommentsClick, id];
    }
    setShowCommentsClick(newIds);
  };

  const handleAddComment = async (petition_id, comment) => {

    let toSend = comment;
    try {
      if (!Array.isArray(comment)) toSend = [comment];
      if (toSend.length < 3) {

        toSend = [...toSend, new Date().toISOString()];
      }
    } catch (e) {
      toSend = [...comment, new Date().toISOString()];
    }

    const response = await addPost(petition_id, toSend);
    if (response.found) {
      toast.success(response.message, { position: "top-right", autoClose: 1000, theme: "dark", transition: Bounce });
      let getIds = [...showCommentsClick];
      if (!getIds.includes(petition_id)) getIds = [...getIds, petition_id];
      getComments(getIds);
    } else {
      toast.error(response.message, { position: "top-right", autoClose: 1000, theme: "dark", transition: Bounce });
    }
  };

  const handleEditComment = async (petitionId, userId, oldMessage, newMessage) => {
    const response = await updatePost(petitionId, [userId, oldMessage], [userId, newMessage]);
    if (response.found) {
      toast.success("Comment updated successfully!", { position: "top-right", autoClose: 1000, theme: "dark", transition: Bounce });
      let getIds = [...showCommentsClick];
      if (!getIds.includes(petitionId)) getIds = [...getIds, petitionId];
      getComments(getIds);
    } else {
      toast.error("Failed to update comment", { position: "top-right", autoClose: 1000, theme: "dark", transition: Bounce });
    }
  };

  const handleDeleteComment = async (petitionId, userId, message) => {
    const response = await deletePost(petitionId, [userId, message]);
    if (response.found) {
      toast.success("Comment deleted successfully!", { position: "top-right", autoClose: 1000, theme: "dark", transition: Bounce });
      let getIds = [...showCommentsClick];
      if (!getIds.includes(petitionId)) getIds = [...getIds, petitionId];
      getComments(getIds);
    } else {
      toast.error("Failed to delete comment", { position: "top-right", autoClose: 1000, theme: "dark", transition: Bounce });
    }
  };

  return (
    <>
      <div className="grid md:grid-cols-1 gap-6 w-full">
        {petitionsFilters.length === 0 && (
          <div className="bg-[#F3E8DC] rounded-xl shadow-md p-5 flex gap-2 flex-col justify-between border border-[#333333] hover:shadow-lg transition w-full items-center">
            <div className="font-semibold text-xl text-center text-[#333333]">
              No Petitions Found with the current filters
            </div>
            <button
              className="bg-[#A67C52] hover:bg-[#5A3E1B] text-white px-4 py-2 rounded-md font-semibold w-max cursor-pointer"
              onClick={() => {
                setFilters({ type: "All", location: "All", category: "All", status: "All" });
                if (setButtons) {
                  setButtons({ All: true, environment: false, infrastructure: false, education: false, "public safety": false, transportation: false, healthcare: false, housing: false });
                }
                if (setButtonsColor) {
                  setButtonsColor({ All: true, "My Petitions": false, "Signed by Me": false });
                }
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {petitionsFilters?.slice().reverse().map((pet, idx) => (
          <div key={idx} className="bg-[#F3E8DC] rounded-xl shadow-md p-5 flex flex-col justify-between border border-[#333333] hover:shadow-lg transition w-full">
            <div className="flex items-center justify-between flex-wrap">
              <h3 className="font-bold text-lg mb-2 text-[#333333] pl-1">{pet.title}</h3>
              <p className="text-sm text-[#5A3E1B] mb-1">
                {pet.created_on.split("T")[0].split("-").reverse().join("-") + "  - " + pet.created_on.split("T")[1].split(".")[0] + " IST"}
              </p>
            </div>

            <div className="flex item-center gap-3 w-full justify-between">
              <p className="text-sm text-[#333333] mb-2 line-clamp-3 pl-1 break-all">{pet.description}</p>
              <div className="flex justify-end items-center mb-2">
                {!isAdmin && <p className={`text-md font-semibold ${pet.status === "Active" ? "text-[#5A3E1B]" : pet.status === "Under Review" ? "text-[#A67C52]" : "text-red-600"}`}>{pet.status}</p>}
                {isAdmin && (
                  <select
                    className="bg-[#F3E8DC] text-[#333333] px-2 py-1 rounded-md border border-[#A67C52]/50"
                    value={pet.status}
                    onChange={(e) => handleChangeStatus(pet._id, e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Closed">Closed</option>
                  </select>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4 mt-2">
              <div className="flex items-center gap-1 flex-wrap">
                <button title="View Details" className="text-[#5A3E1B] hover:text-[#A67C52] text-xl cursor-pointer" onClick={async () => { setSelectedPet(pet); setName(await userName(pet.created_user_id)); }}>
                  <FaEye />
                </button>
                <button
                  title={pet.status === "Closed" ? "Closed" : isSigned(pet) ? "Unsign" : "Sign Petition"}
                  disabled={pet.status === "Closed"}
                  onClick={(e) => handleSignPetition(pet, data._id, e)}
                  className={`flex items-center gap-2 text-md transition ${isSigned(pet) ? "text-green-500" : "text-black"} ${pet.status === "Closed" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} px-3 py-1 rounded-md`}
                >
                  <FaHeart />
                  <span className="inline-flex items-center gap-2 text-black border-none">{pet.signedBy.length} / {pet.goal}</span>
                </button>
                <button title={showCommentsClick.includes(pet._id) ? "Hide Comments" : "View Comments"} onClick={() => {getUser();display(pet._id)}} className="text-[#A67C52] hover:text-[#5A3E1B] text-xl cursor-pointer">
                  <FaRegCommentDots />
                </button>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {pet.created_user_id === data._id && (
                  <Link
                    to={pet.status === "Closed" || pet.status === "Under Review" ? "#" : "/home/petitions/form"}
                    state={pet.status === "Closed" ? null : { id: pet._id, title: pet.title, category: pet.category, location: pet.location, goal: pet.goal, description: pet.description, acknowledge: false }}
                    onClick={(e) => { if (pet.status === "Closed" || pet.status === "Under Review") e.preventDefault(); }}
                    title="Edit Petition"
                    className={`text-[#A67C52] hover:text-[#5A3E1B] text-xl transition ${pet.status === "Closed" || pet.status === "Under Review" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <FaEdit />
                  </Link>
                )}

                {(isAdmin || pet.created_user_id === data._id) && (
                  <button
                    title="Delete Petition"
                    onClick={() => { if (pet.status !== "Closed" || isAdmin) handleDelete(pet._id); }}
                    disabled={(pet.status === "Closed" || pet.status === "Under Review") && !isAdmin}
                    className={`text-red-600 hover:text-red-500 text-xl transition ${(pet.status === "Closed" || pet.status === "Under Review") && !isAdmin ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-5">
              <div className="flex gap-3 items-center flex-wrap">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#5A3E1B] text-white font-bold">
                  {data ? data.name.toUpperCase().charAt(0) : "U"}
                </div>

                <input
                  type="text"
                  value={newComments[pet._id] || ""}
                  onChange={(e) => setNewComments((prev) => ({ ...prev, [pet._id]: e.target.value }))}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter" && newComments[pet._id]?.trim()) {
                      await handleAddComment(pet._id, [data._id, newComments[pet._id].trim()]);
                      setNewComments((prev) => ({ ...prev, [pet._id]: "" }));
                    }
                  }}
                  placeholder="Add a comment..."
                  className="flex-1 border-b border-[#333333] py-2 placeholder-[#555555] text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#5A3E1B] bg-[#F3E8DC]"
                />

                <button
                  title="Post Comment"
                  disabled={pet.status === "Closed"}
                  onClick={async () => {
                    if (newComments[pet._id]?.trim()) {
                      await handleAddComment(pet._id, [data._id, newComments[pet._id].trim()]);
                      setNewComments((prev) => ({ ...prev, [pet._id]: "" }));
                      
                    }
                  }}
                  className={`${pet.status === "Closed" ? "cursor-not-allowed opacity-50" : "cursor-pointer opacity-100"} text-[#5A3E1B] hover:text-[#A67C52] text-xl`}
                >
                  <FaPaperPlane />
                </button>
              </div>


              <div className={`flex flex-col gap-3 ${showCommentsClick.includes(pet._id) ? "max-h-60" : "h-0"} overflow-y-auto`}>
                {allComments.map((curComments, idx) => {
                  if (String(curComments.petition_id) === String(pet._id)) {
                    return curComments.comment.map((allcomp, i) => (
                      <Comment
                        key={i}
                        userId={allcomp[0]}
                        message={allcomp[1]}
                        userCache={userCache}
                        setUserCache={setUserCache}
                        data={data}
                        petitionId={pet._id}
                        onEdit={handleEditComment}
                        onDelete={handleDeleteComment}
                      />
                    ));
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedPet && <PetitionModal pet={selectedPet} creatorName={name} onClose={() => setSelectedPet(null)} />}
    </>
  );
}

import { useState } from "react";
import { update } from "../axios/poll";

export const PollsCard = ({ poll, currentUserId, getPolls, data ,handleDelete}) => {
  const [options, setOptions] = useState(poll.options);
  const [showDescription, setShowDescription] = useState(false);

  const handleVote = async (index) => {
    const updatedOptions = options.map((opt, i) => {
      const hasVoted = opt.votes.includes(currentUserId);

      if (i === index) {
        if (hasVoted) {
          return {
            ...opt,
            votes: opt.votes.filter((id) => id !== currentUserId),
          };
        } else {
          return {
            ...opt,
            votes: [...opt.votes, currentUserId],
          };
        }
      }

      if (!poll.allowMultiple && opt.votes.includes(currentUserId)) {
        return {
          ...opt,
          votes: opt.votes.filter((id) => id !== currentUserId),
        };
      }

      return opt;
    });

    const response = await update({ id: poll._id, options: updatedOptions });
    if (!response.found) {
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
      return;
    }
    setOptions(updatedOptions);
  };



  return (
    <div className="bg-[#0f172a] p-6 rounded-xl shadow-xl text-white mb-6 w-full border  border-gray-700 hover:shadow-2xl transition-all duration-300">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{poll.title}</h2>
        <p className="text-sm text-gray-400 mt-1 sm:mt-0">
          <span className="text-blue-400">{poll.category}</span> • {poll.location}
        </p>
      </div>


      <div className="flex flex-col gap-3 mt-3">
        {options.map((opt, i) => {
          const hasVoted = opt.votes.includes(currentUserId);
          const totalVotes = options.reduce((a, b) => a + b.votes.length, 0);
          const percent =
            totalVotes === 0 ? 0 : Math.round((opt.votes.length / totalVotes) * 100);

          return (
            <button
              key={i}
              onClick={() => handleVote(i)}
              className={`relative group text-left w-full p-3 rounded-lg border 
                transition-all duration-300 overflow-hidden cursor-pointer 
                ${hasVoted
                  ? "border-blue-500 bg-gradient-to-r from-blue-600/20 to-blue-500/10"
                  : "border-gray-700 hover:border-blue-500 hover:bg-blue-600/10"
                }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-base">{opt.text}</span>
                <span className="text-xs text-gray-400">{opt.votes.length} votes</span>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              <span className="absolute right-2 bottom-2 text-[10px] text-white">
                {percent}%
              </span>
            </button>
          );
        })}
        {poll.allowMultiple && <p className="text-gray-400 text-md"><span className="text-red-600">*</span>Can Vote Multiple Answers</p>}
      </div>

      <div className="mt-5 flex items-center gap-2 justify-between flex-wrap">
        <button
          onClick={() => setShowDescription((prev) => !prev)}
          className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-all"
        >
          {showDescription ? "Hide Description ▲" : "View Description ▼"}
        </button>
        {(data._id === poll.created_user_id) &&
          <div className="flex gap-2 items-center">
            <button
              onClick={() => handleDelete(poll)}
              className="bg-red-600 text-white py-2 rounded-lg text-md hover:bg-red-500 transition cursor-pointer w-15"
            >
              Delete
            </button>
            <button
              // onClick={() => handleDelete(pet._id)}
              className="bg-orange-600 text-white py-2 rounded-lg text-md hover:bg-red-500 transition cursor-pointer w-20"
            >
              Close Poll
            </button>
          </div>

        }

      </div>
      {showDescription && (
        <p className="mt-3 text-gray-300 text-sm leading-relaxed border-t border-gray-700 pt-3 w-full break-all cursor-pointer">
          {poll.description}
        </p>
      )}
    </div>
  );
};

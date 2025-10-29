import { useState } from "react";
import { update, updateClose } from "../axios/poll";
import { Pie } from "react-chartjs-2";
import { FaEdit, FaTrash, FaLock, FaUnlock, FaChartBar, FaEye } from "react-icons/fa";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Link } from "react-router-dom";
import { Bounce, toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const PollsCard = ({ poll, currentUserId, getPolls, data, handleDelete }) => {
  const [options, setOptions] = useState(poll.options);
  const [showDescription, setShowDescription] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const handleVote = async (index) => {
    const updatedOptions = options.map((opt, i) => {
      const hasVoted = opt.votes.includes(currentUserId);

      if (i === index) {
        return hasVoted
          ? { ...opt, votes: opt.votes.filter((id) => id !== currentUserId) }
          : { ...opt, votes: [...opt.votes, currentUserId] };
      }

      if (!poll.allowMultiple && opt.votes.includes(currentUserId)) {
        return { ...opt, votes: opt.votes.filter((id) => id !== currentUserId) };
      }

      return opt;
    });

    const response = await update({ id: poll._id, options: updatedOptions });
    if (!response.found) return;
    setOptions(updatedOptions);
  };

  const pieData = {
    labels: options.map((opt) => opt.text),
    datasets: [
      {
        data: options.map((opt) => opt.votes.length),
        backgroundColor: [
          "#8B4513", 
          "#D2B48C", 
          "#C19A6B", 
          "#A0522D", 
          "#D2691E", 
          "#CD853F", 
          "#E9967A", 
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleClose = async (id) => {
    const res = await updateClose(id, !poll.isClosed);
    if (res.found) {
      await getPolls();
    } else {
      toast.error(res.message, {
        position: "top-right",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="bg-[#fdf3e7] p-6 rounded-xl shadow-md text-[#2e2e2e] mb-6 w-full border border-[#d4b998] hover:shadow-lg transition-all duration-300">

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-bold text-[#5A3E1B]">{poll.title}</h2>
        <p className="text-sm text-[#7a6b5a] mt-1 sm:mt-0">
          <span className="text-[#A67C52] font-semibold">{poll.category}</span> • {poll.location}
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
              disabled={poll.isClosed}
              onClick={() => handleVote(i)}
              className={`relative text-left w-full p-3 rounded-lg border transition-all duration-300 overflow-hidden ${
                hasVoted
                  ? "border-[#5A3E1B] bg-[#5A3E1B] text-white"
                  : "border-[#A67C52] bg-white text-[#2e2e2e] hover:bg-[#A67C52] hover:text-white"
              } ${poll.isClosed ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-base">{opt.text}</span>
                <span className="text-xs">{opt.votes.length} votes</span>
              </div>

              <div className="w-full bg-[#e6d7c3] rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#5A3E1B] to-[#A67C52] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>

              <span className="absolute right-2 bottom-2 text-[10px] text-[#5A3E1B]">
                {percent}%
              </span>
            </button>
          );
        })}

        {poll.allowMultiple && (
          <p className="text-sm mt-2 text-[#7a6b5a]">
            <span className="text-[#A67C52]">*</span> Can vote multiple answers
          </p>
        )}
      </div>

      <div className="mt-5 flex items-center gap-4 justify-between flex-wrap">
        <button
          onClick={() => setShowDescription((prev) => !prev)}
          title="View Description"
          className="text-[#A67C52] text-xl hover:text-[#5A3E1B] transition"
        >
          <FaEye />
        </button>

        <button
          onClick={() => {
            getPolls();
            setShowReport(true);
          }}
          title="View Report"
          className="text-green-700 text-2xl hover:text-green-600 transition"
        >
          <FaChartBar />
        </button>

        {data._id === poll.created_user_id && (
          <div className="flex gap-4 items-center">
            <Link
              to={poll.isClosed ? "#" : "/home/polls/form"}
              disabled={poll.isClosed}
              state={{
                id: poll._id,
                title: poll.title,
                description: poll.description,
                options: poll.options.map((cur) => cur.text),
                category: poll.category,
                location: poll.location,
                allowMultiple: poll.allowMultiple,
                isClosed: poll.isClosed,
              }}
              title="Edit Poll"
              className={`text-[#A67C52] text-xl hover:text-[#5A3E1B] transition ${
                poll.isClosed ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <FaEdit />
            </Link>

            <button
              onClick={() => handleDelete(poll)}
              disabled={poll.isClosed}
              title="Delete Poll"
              className={`text-red-600 text-xl hover:text-red-500 transition ${
                poll.isClosed ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              <FaTrash />
            </button>


            <button
              onClick={() => handleClose(poll._id)}
              title={poll.isClosed ? "Open Poll" : "Close Poll"}
              className={`text-xl transition ${
                poll.isClosed
                  ? "text-[#FF0000] hover:text-[#DAA520]"
                  : "text-[#008000] hover:text-[#00A000]" 
              }`}
            >
              {poll.isClosed ? <FaUnlock /> : <FaLock />}
            </button>
          </div>
        )}
      </div>

 
      {showDescription && (
        <p className="mt-3 text-[#7a6b5a] text-sm leading-relaxed border-t border-[#d4b998] pt-3 w-full break-all">
          {poll.description}
        </p>
      )}


      {showReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div
            onClick={() => setShowReport(false)}
            className="flex justify-center items-center w-full h-full"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#fffdf8] p-6 rounded-xl w-11/12 max-w-md shadow-lg border border-[#d4b998]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#5A3E1B]">Poll Report</h3>
                <button
                  onClick={() => setShowReport(false)}
                  className="text-[#A67C52] text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-lg font-semibold text-[#2e2e2e] mb-3">
                {poll.title}
              </h3>

              <div className="flex gap-8 flex-wrap items-center w-full">
                <div className="flex justify-center w-full">
                  <div className="w-60 h-60">
                    {options.some((o) => o.votes.length !== 0) ? (
                      <Pie
                        data={pieData}
                        options={{
                          plugins: {
                            legend: { labels: { color: "#333", font: { size: 12 } } },
                          },
                          maintainAspectRatio: false,
                        }}
                      />
                    ) : (
                      <h3 className="text-[#A67C52] text-center text-lg">No Data</h3>
                    )}
                  </div>
                </div>

                <ul className="mt-4 text-[#2e2e2e] text-sm w-full">
                  {options.map((opt, i) => (
                    <li key={i} className="flex justify-between mb-1">
                      <span className="text-[#5A3E1B] font-medium">{opt.text}</span>
                      <span>{opt.votes.length} votes</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { userInfo } from "../axios/user";
import { getLogs } from "../axios/adminLogs";
import { Link } from "react-router-dom";
import { Bounce, toast } from "react-toastify"

export const Officials = () => {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [secondAttempt, setSecondAttempt] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await userInfo();
      if (data.found) {
        setUser(data.user);
        if (data.user.email.endsWith("@civix.gov.in")) {
          setIsAdmin(true);
          fetchLogs(data.user._id);
        } else {
          handleNonAdminAccess();
        }
      } else {
        setErrorMsg("Failed to verify user.");
      }
    };
    fetchUser();
  }, []);

  const handleNonAdminAccess = () => {
    const accessCount = localStorage.getItem("adminAccessCount") || 0;
    const newCount = parseInt(accessCount) + 1;
    localStorage.setItem("adminAccessCount", newCount);

    if (newCount >= 2) {
      setErrorMsg("⚠️ Server action will be taken due to unauthorized access attempt!");
      setSecondAttempt(true);
    } else {
      setErrorMsg("🚫 Access Denied: This page is for Civix Admins only.");
    }
  };

  const fetchLogs = async (adminId) => {
    const res = await getLogs(adminId);
    if (res.found) {
      setLogs(res.data);
      const today = new Date().toLocaleDateString("en-GB"); 
      const todayLogs = res.data.filter((log) => log.timestamp.startsWith(today));
      setFilteredLogs(todayLogs);
      setSelectedDate(today);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value; 
    setSelectedDate(date);


    const parts = date.split("-");
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`; 

    const filtered = logs.filter((log) => {
      const logDate = log.timestamp.split(",")[0]; 
      return logDate === formattedDate;
    });

    setFilteredLogs(filtered);
  };

  const handleShowAll = () => {
    setFilteredLogs(logs);
    setSelectedDate("");
  };

  if (!isAdmin && !user) return <p className="text-gray-600 text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-700">
          Admin Activity Logs
        </h1>


        {!isAdmin && (
          <div
            className={`p-6 mb-8 rounded-2xl border text-center transition-all duration-300 shadow-md ${secondAttempt
                ? "bg-red-100 border-red-400 text-red-700"
                : "bg-red-50 border-red-300 text-red-600"
              }`}
          >
            <p className="text-lg font-semibold">{errorMsg}</p>
            <div className="mt-6">
              <Link
                to="/home/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 px-5 py-2 rounded-xl font-semibold shadow-sm"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}


        {isAdmin && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <label className="font-semibold text-gray-700">Filter by Date:</label>
                <input
                  type="date"
                  value={
                    selectedDate && selectedDate.includes("/")
                      ? new Date(selectedDate.split("/").reverse().join("-"))
                        .toISOString()
                        .split("T")[0]
                      : selectedDate
                  }
                  onChange={handleDateChange}
                  className="ml-2 p-2 rounded-lg bg-gray-100 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
              <button
                onClick={handleShowAll}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold shadow-sm transition-all duration-300"
              >
                Show All Logs
              </button>
            </div>

            {filteredLogs.length > 0 ? (
              <ul className="space-y-4">
                {filteredLogs.slice().reverse().map((log, i) => (
                  <li
                    key={i}
                    className="bg-gray-100 border border-gray-200 p-4 rounded-xl hover:bg-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <p className="text-sm text-gray-500">{log.timestamp}</p>
                    <div className="mt-1">
                      {(() => {
                        const lines = log.text.split("\n").filter((l) => l.trim() !== "");
                        const heading = lines[0];
                        const details = lines.slice(1);

                        return (
                          <>

                            <h2 className="text-lg font-semibold text-blue-700 mb-2">
                              {heading}
                            </h2>


                            {details.map((line, idx) => {
                              const [key, ...rest] = line.split(":");
                              const value = rest.join(":").trim();
                              return (
                                <p key={idx} className="text-sm">
                                  <span className="font-medium text-blue-600">{key.trim()}:</span>{" "}
                                  <span className="text-gray-800">{value}</span>
                                </p>
                              );
                            })}
                          </>
                        );
                      })()}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No logs found for the selected date.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

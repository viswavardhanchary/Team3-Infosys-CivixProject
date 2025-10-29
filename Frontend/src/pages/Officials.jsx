import React, { useEffect, useState } from "react";
import { userInfo } from "../axios/user";
import { getLogs } from "../axios/adminLogs";
import { Link } from "react-router-dom";

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
    const formattedDate = `${parts[0]}/${parts[1]}/${parts[2]}`;

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

  if (!isAdmin && !user)
    return <p className="text-[#5C3A21] text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#F4EDE4] text-[#3B2A1A] flex flex-col items-center p-6">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[#8B5E34]">
          Admin Activity Logs
        </h1>

        {!isAdmin && (
          <div
            className={`p-6 mb-8 rounded-2xl border text-center transition-all duration-300 shadow-md ${
              secondAttempt
                ? "bg-[#FEE2E2] border-[#DC2626] text-[#7F1D1D]"
                : "bg-[#FEECDC] border-[#F59E0B] text-[#7C2D12]"
            }`}
          >
            <p className="text-lg font-semibold">{errorMsg}</p>
            <div className="mt-6">
              <Link
                to="/home/dashboard"
                className="bg-[#8B5E34] hover:bg-[#A67843] text-white transition-all duration-300 px-5 py-2 rounded-xl font-semibold shadow-sm"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="bg-[#FFF8F0] p-6 rounded-2xl shadow-lg border border-[#8B5E34]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <label className="font-semibold text-[#8B5E34]">Filter by Date:</label>
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
                  className="ml-2 p-2 rounded-lg bg-[#F4EDE4] text-[#3B2A1A] border border-[#C4975A] focus:outline-none focus:ring-2 focus:ring-[#8B5E34] transition"
                />
              </div>
              <button
                onClick={handleShowAll}
                className="bg-[#8B5E34] hover:bg-[#A67843] px-4 py-2 rounded-lg text-white font-semibold shadow-sm transition-all duration-300"
              >
                Show All Logs
              </button>
            </div>

            {filteredLogs.length > 0 ? (
              <ul className="space-y-4">
                {filteredLogs.slice().reverse().map((log, i) => (
                  <li
                    key={i}
                    className="bg-[#F4EDE4] border border-[#C4975A] p-4 rounded-xl hover:bg-[#FFF1E0] hover:shadow-md transition-all duration-200"
                  >
                    <p className="text-sm text-[#8B5E34]">{log.timestamp}</p>
                    <div className="mt-1">
                      {(() => {
                        const lines = log.text.split("\n").filter((l) => l.trim() !== "");
                        const heading = lines[0];
                        const details = lines.slice(1);

                        return (
                          <>
                            <h2 className="text-lg font-semibold text-[#8B5E34] mb-2">
                              {heading}
                            </h2>

                            {details.map((line, idx) => {
                              const [key, ...rest] = line.split(":");
                              const value = rest.join(":").trim();
                              return (
                                <p key={idx} className="text-sm">
                                  <span className="font-medium text-[#A67843]">
                                    {key.trim()}:
                                  </span>{" "}
                                  <span className="text-[#3B2A1A]">{value}</span>
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
              <p className="text-[#8B5E34] text-center py-8">
                No logs found for the selected date.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

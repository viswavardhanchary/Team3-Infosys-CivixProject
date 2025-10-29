import React, { useEffect, useState, useRef } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { getPetitionsData } from "../axios/petition";
import { getPollsData } from "../axios/poll";
import { userInfo } from "../axios/user";
import { getPost } from "../axios/comments";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const Reports = () => {
  const [data, setData] = useState(null);
  const [petitions, setPetitions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLast30, setShowLast30] = useState(false);
  const [isPreparingDownload, setIsPreparingDownload] = useState(false);
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const last30Ref = useRef(null);
  const [last30CommentsData, setLast30CommentsData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    async function loadData() {
      try {
        const userData = await userInfo();
        if (!userData?.found) navigate("/login");
        else setData(userData.user);

        const petitionsRes = await getPetitionsData();
        const pollsRes = await getPollsData();
        if (petitionsRes.found) setPetitions(petitionsRes.data);
        if (pollsRes.found) setPolls(pollsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);


  useEffect(() => {
    const fetchComments = async () => {
      if (!showLast30) return;
      try {
        const counts = [];
        for (let p of last30Petitions) {
          const res = await getPost(p._id);
          let c = 0;
          if (res.found && Array.isArray(res.message)) {
            for (let doc of res.message) {
              if (!doc.comment) continue;
              for (let com of doc.comment) {

                if (com && com.length >= 3) {
                  const dt = new Date(com[2]);
                  if (!isNaN(dt) && dt >= thirtyDaysAgo) c++;
                }
              }
            }
          }
          counts.push({ title: p.title, count: c });
        }
        const filtered = counts.sort((a, b) => b.count - a.count).slice(0, 8);
        setLast30CommentsData({
          labels: filtered.map((f) => f.title),
          datasets: [
            {
              label: "Comments",
              data: filtered.map((f) => f.count),

              backgroundColor: [
                "#7FB3D5",
                "#5DADE2",
                "#85C1E9",
                "#6C5CE7",
                "#9B59B6",
                "#A569BD",
                "#5B2C6F",
                "#2E86C1",
              ],
            },
          ],
        });
      } catch (e) {
        console.error("Error fetching comments for last30:", e);
      }
    };
    fetchComments();
  }, [showLast30, petitions]);

  if (loading)
    return (
      <p className="text-center text-lg font-semibold text-[#8B5E34] animate-pulse">
        Loading...
      </p>
    );


  const petitionStatusCounts = { Active: 0, "Under Review": 0, Closed: 0 };
  petitions.forEach((p) => {
    if (petitionStatusCounts[p.status] !== undefined)
      petitionStatusCounts[p.status]++;
  });

  const petitionStatusData = {
    labels: Object.keys(petitionStatusCounts),
    datasets: [
      {
        data: Object.values(petitionStatusCounts),

        backgroundColor: ["#7FB3D5", "#82E0AA", "#F6C177"],
      },
    ],
  };

  const petitionsSorted = petitions
    .sort((a, b) => b.signedBy.length - a.signedBy.length)
    .slice(0, 8);

  const petitionSignsData = {
    labels: petitionsSorted.map((p) => p.title),
    datasets: [
      {
        label: "Signatures",
        data: petitionsSorted.map((p) => p.signedBy.length),

        backgroundColor: [
          "#7FB3D5",
          "#5DADE2",
          "#85C1E9",
          "#6C5CE7",
          "#9B59B6",
          "#A569BD",
          "#5B2C6F",
          "#2E86C1",
        ],
      },
    ],
  };


  const pollsSorted = polls
    .map((poll) => ({
      title: poll.title,
      totalVotes: poll.options.reduce((sum, o) => sum + o.votes.length, 0),
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, 8);

  const pollVotesData = {
    labels: pollsSorted.map((p) => p.title),
    datasets: [
      {
        label: "Votes",
        data: pollsSorted.map((p) => p.totalVotes),

        backgroundColor: [
          "#82E0AA",
          "#58D68D",
          "#2ECC71",
          "#27AE60",
          "#1ABC9C",
          "#16A085",
          "#48C9B0",
          "#239B56",
        ],
      },
    ],
  };


  const pollStatus = { Active: 0, Closed: 0 };
  polls.forEach((poll) => {
    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);
    if (totalVotes > 20) pollStatus.Closed++;
    else pollStatus.Active++;
  });

  const pollStatusData = {
    labels: Object.keys(pollStatus),
    datasets: [
      {
        data: Object.values(pollStatus),
        backgroundColor: ["#82E0AA", "#5DADE2"],
      },
    ],
  };


  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const getCreatedDate = (p) => new Date(p.created_on || p.createdAt || p.createdOn || p.created_on_date || p.created_on);
  const last30Petitions = petitions.filter((p) => getCreatedDate(p) >= thirtyDaysAgo);
  const last30Polls = polls.filter((p) => getCreatedDate(p) >= thirtyDaysAgo);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const dateRangeText = `${formatDate(thirtyDaysAgo)} – ${formatDate(now)}`;

  const petitionStatusLast30Counts = { Active: 0, "Under Review": 0, Closed: 0 };
  last30Petitions.forEach((p) => {
    if (petitionStatusLast30Counts[p.status] !== undefined) petitionStatusLast30Counts[p.status]++;
  });

  const petitionStatusLast30Data = {
    labels: Object.keys(petitionStatusLast30Counts),
    datasets: [
      {
        data: Object.values(petitionStatusLast30Counts),
        backgroundColor: ["#7FB3D5", "#82E0AA", "#F6C177"],
      },
    ],
  };


  const pollStatusLast30 = { Active: 0, Closed: 0 };
  last30Polls.forEach((poll) => {
    const totalVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);
    if (totalVotes > 20) pollStatusLast30.Closed++;
    else pollStatusLast30.Active++;
  });

  const pollStatusLast30Data = {
    labels: Object.keys(pollStatusLast30),
    datasets: [
      {
        data: Object.values(pollStatusLast30),
        backgroundColor: ["#82E0AA", "#5DADE2"],
      },
    ],
  };


  const downloadSectionAsPDF = async (ref, filename) => {

    setIsPreparingDownload(true);
    await new Promise((r) => setTimeout(r, 250));
    try {
      const element = ref.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 10, width, height);
      pdf.save(`${filename}.pdf`);
    } finally {
      setIsPreparingDownload(false);
    }
  };


  const downloadSectionAsImage = async (ref, filename) => {
    setIsPreparingDownload(true);
    await new Promise((r) => setTimeout(r, 250));
    try {
      const element = ref.current;
      const canvas = await html2canvas(element, { scale: 2 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${filename}.png`;
      link.click();
    } finally {
      setIsPreparingDownload(false);
    }
  };

  const handleDownloadLast30 = async () => {
    await downloadSectionAsPDF(last30Ref, "Civix_Last30DaysReport");
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "#4A4A4A" } },
    },
    maintainAspectRatio: false,
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { color: "#4A4A4A" } },
      x: { ticks: { color: "#4A4A4A" } },
    },
  };

  return (
    <div
      ref={reportRef}
      className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-[#FAF3E0] to-[#EAD9B7]"
    >

      <div className="flex justify-between items-center w-full max-w-6xl mb-10 flex-wrap gap-3">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C19A6B] via-[#B88746] to-[#8B5E34] bg-clip-text text-transparent drop-shadow-md">
          Reports
        </h1>

        <div className="flex gap-3 flex-wrap">
          {!isPreparingDownload && (
            <>
              <button
                onClick={() => downloadSectionAsImage(reportRef, "Reports_Image")}
                className="bg-[#A47148] hover:bg-[#8B5E34] text-white px-4 py-2 rounded-lg shadow-md transition-all"
              >
                Download Image
              </button>
              <button
                onClick={() => downloadSectionAsPDF(reportRef, "Reports")}
                className="bg-[#C19A6B] hover:bg-[#B88746] text-white px-4 py-2 rounded-lg shadow-md transition-all"
              >
                Download PDF
              </button>
            </>
          )}
        </div>
      </div>
     
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-semibold text-[#5C3A1E] mb-6">Reports of Petitions and Polls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <ChartCard title="Petitions by Status" gradient="from-[#FAEEDC] to-[#E6C79C]">
              <Pie data={petitionStatusData} options={pieOptions} />
            </ChartCard>
            <ChartCard title="Petitions (High → Low Signs)" gradient="from-[#F9E7C9] to-[#D9A45E]">
              <Bar data={petitionSignsData} options={barOptions} />
            </ChartCard>
            <ChartCard title="Polls (High → Low Votes)" gradient="from-[#F8E3B9] to-[#C99655]">
              <Bar data={pollVotesData} options={barOptions} />
            </ChartCard>
            <ChartCard title="Active vs Closed Polls" gradient="from-[#F9EAD1] to-[#E6C79C]">
              <Pie data={pollStatusData} options={pieOptions} />
            </ChartCard>
          </div>
        </div>

      <div className="mt-12">
        {!isPreparingDownload && (
          <button
            onClick={() => setShowLast30(!showLast30)}
            className="bg-[#8B5E34] hover:bg-[#A47148] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
          >
            {showLast30 ? "Hide Last 30 Days Update" : "Show Last 30 Days Update"}
          </button>
        )}
      </div>


      {showLast30 && (
        <div
          ref={last30Ref}
          className="mt-10 text-center max-w-6xl bg-gradient-to-b from-[#FFF5E1] to-[#F3DEC3] p-6 rounded-2xl shadow-md w-full"
        >
          <h2 className="text-2xl font-semibold text-[#5C3A1E] mb-2">
            Last 30 Days Summary
          </h2>
          <p className="text-[#7A5C3A] mb-4 font-medium">{dateRangeText}</p>
          <p className="text-[#7A5C3A] mb-6">
            In the past 30 days, there have been <b>{last30Petitions.length}</b>{" "}
            new petitions and <b>{last30Polls.length}</b> new polls created.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <ChartCard title="Petitions by Status (30 Days)" gradient="from-[#FAEEDC] to-[#E6C79C]">
              <Pie data={petitionStatusLast30Data} options={pieOptions} />
            </ChartCard>
            <ChartCard title="Petitions (High → Low Signs)" gradient="from-[#F9E7C9] to-[#D9A45E]">
              <Bar data={petitionSignsData} options={barOptions} />
            </ChartCard>
            <ChartCard title="Polls (High → Low Votes)" gradient="from-[#F8E3B9] to-[#C99655]">
              <Bar data={pollVotesData} options={barOptions} />
            </ChartCard>
            <ChartCard title="Active vs Closed Polls (30 Days)" gradient="from-[#F9EAD1] to-[#E6C79C]">
              <Pie data={pollStatusLast30Data} options={pieOptions} />
            </ChartCard>
          </div>


          <div className="mt-6">
            <ChartCard title="Comments (High → Low) — Last 30 Days" gradient="from-[#FFF3E0] to-[#F0D4B0]">
              <Bar data={last30CommentsData} options={barOptions} />
            </ChartCard>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            {!isPreparingDownload && (
              <>
                <button
                  onClick={() => downloadSectionAsImage(last30Ref, "Civix_Last30Days_Image")}
                  className="bg-[#A47148] hover:bg-[#8B5E34] text-white px-5 py-2 rounded-lg shadow-md"
                >
                  Download Image
                </button>
                <button
                  onClick={handleDownloadLast30}
                  className="bg-[#C19A6B] hover:bg-[#B88746] text-white px-5 py-2 rounded-lg shadow-md"
                >
                  Download PDF
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


const ChartCard = ({ title, children, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} border border-[#C19A6B] p-6 rounded-2xl shadow-md hover:shadow-[0_0_25px_#B88A58] transition-all duration-300 flex flex-col items-center`}
  >
    <h2 className="text-xl font-semibold mb-4 text-[#5C3A1E]">{title}</h2>
    <div className="w-full h-64">{children}</div>
  </div>
);

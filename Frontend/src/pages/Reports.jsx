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
  const [showChartsForDownload, setShowChartsForDownload] = useState(false);
  const navigate = useNavigate();
  const reportRef = useRef(null);
  const last30Ref = useRef(null);

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

  if (loading)
    return (
      <p className="text-center text-lg font-semibold text-[#8B5E34] animate-pulse">
        Loading...
      </p>
    );

  // 🟤 Petition Status
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
        backgroundColor: ["#D4A373", "#A47148", "#5C3A1E"],
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
          "#F3D5B5",
          "#E7BA89",
          "#DFA166",
          "#C6854A",
          "#B36C3C",
          "#9D5B2B",
          "#874820",
          "#703814",
        ],
      },
    ],
  };

  // 🟤 Polls
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
          "#EED3B1",
          "#E0B885",
          "#D59C5A",
          "#C27D3A",
          "#A9632A",
          "#8C4E1F",
          "#713E18",
          "#593014",
        ],
      },
    ],
  };

  // Poll Status
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
        backgroundColor: ["#E0B885", "#8C4E1F"],
      },
    ],
  };

  // 🕒 Last 30 days filter
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last30Petitions = petitions.filter(
    (p) => new Date(p.createdAt) >= thirtyDaysAgo
  );
  const last30Polls = polls.filter(
    (p) => new Date(p.createdAt) >= thirtyDaysAgo
  );

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const dateRangeText = `${formatDate(thirtyDaysAgo)} – ${formatDate(now)}`;

  // 📥 Capture + Download PDF
  const downloadSectionAsPDF = async (ref, filename) => {
    const element = ref.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(130, 80, 30);
    pdf.text("Civix - Last 30 Days Report", width / 2, 20, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(100);
    pdf.text(dateRangeText, width / 2, 28, { align: "center" });

    pdf.addImage(imgData, "PNG", 0, 40, width, height);
    pdf.save(`${filename}.pdf`);
  };

  // 📸 Capture + Download Image
  const downloadSectionAsImage = async (ref, filename) => {
    const element = ref.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${filename}.png`;
    link.click();
  };

  const handleDownloadLast30 = async () => {
    setShowChartsForDownload(true);
    setTimeout(async () => {
      await downloadSectionAsPDF(last30Ref, "Civix_Last30DaysReport");
      setShowChartsForDownload(false);
    }, 1000);
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom", labels: { color: "#5C3A1E" } },
    },
    maintainAspectRatio: false,
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { color: "#5C3A1E" } },
      x: { ticks: { color: "#5C3A1E" } },
    },
  };

  return (
    <div
      ref={reportRef}
      className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-[#FAF3E0] to-[#EAD9B7]"
    >
      {/* ✨ Header */}
      <div className="flex justify-between items-center w-full max-w-6xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#C19A6B] via-[#B88746] to-[#8B5E34] bg-clip-text text-transparent drop-shadow-md">
          Reports
        </h1>

        <div className="flex gap-3">
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
        </div>
      </div>

      {/* 📊 Main Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
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

      {/* 🔘 Button to show last 30 days */}
      <div className="mt-12">
        <button
          onClick={() => setShowLast30(!showLast30)}
          className="bg-[#8B5E34] hover:bg-[#A47148] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all"
        >
          {showLast30 ? "Hide Last 30 Days Update" : "Show Last 30 Days Update"}
        </button>
      </div>

      {/* 🕒 Last 30 Days Section */}
      {showLast30 && (
        <div
          ref={last30Ref}
          className="mt-10 text-center max-w-6xl bg-gradient-to-b from-[#FFF5E1] to-[#F3DEC3] p-6 rounded-2xl shadow-md"
        >
          <h2 className="text-2xl font-semibold text-[#5C3A1E] mb-2">
            Civix — Last 30 Days Report
          </h2>
          <p className="text-[#7A5C3A] mb-4 font-medium">{dateRangeText}</p>
          <p className="text-[#7A5C3A] mb-6">
            In the past 30 days, there have been <b>{last30Petitions.length}</b>{" "}
            new petitions and <b>{last30Polls.length}</b> new polls created.
          </p>

          {showChartsForDownload && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <ChartCard title="Petitions by Status (30 Days)" gradient="from-[#FAEEDC] to-[#E6C79C]">
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
          )}

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleDownloadLast30}
              className="bg-[#C19A6B] hover:bg-[#B88746] text-white px-5 py-2 rounded-lg shadow-md"
            >
              Download Civix Report (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 🎨 Reusable Chart Card
const ChartCard = ({ title, children, gradient }) => (
  <div
    className={`bg-gradient-to-br ${gradient} border border-[#C19A6B] p-6 rounded-2xl shadow-md hover:shadow-[0_0_25px_#B88A58] transition-all duration-300 flex flex-col items-center`}
  >
    <h2 className="text-xl font-semibold mb-4 text-[#5C3A1E]">{title}</h2>
    <div className="w-full h-64">{children}</div>
  </div>
);

import React, { useEffect, useState } from "react";
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

import { getPetitionsData } from "../axios/petition";
import { getPollsData } from "../axios/poll";

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
  const [petitions, setPetitions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
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
      <p className="text-center text-lg font-semibold text-blue-700 animate-pulse">
        Loading...
      </p>
    );


  const petitionStatusCounts = { Active: 0, "Under Review": 0, Closed: 0 };
  petitions.forEach((p) => {
    if (petitionStatusCounts[p.status] !== undefined) petitionStatusCounts[p.status]++;
  });

  const petitionStatusData = {
    labels: Object.keys(petitionStatusCounts),
    datasets: [
      {
        data: Object.values(petitionStatusCounts),
        backgroundColor: ["#22c55e", "#facc15","#ef4444"],
      },
    ],
  };


  const petitionsSorted = petitions
    .sort((a, b) => b.signedBy.length - a.signedBy.length)
    .slice(0, 8);

  const petitionColors = petitionsSorted.map((_, i) =>
    i < petitionsSorted.length / 2 ? "#22c55e" : "#ef4444"
  );

  const petitionSignsData = {
    labels: petitionsSorted.map((p) => p.title),
    datasets: [
      {
        label: "Signatures",
        data: petitionsSorted.map((p) => p.signedBy.length),
        backgroundColor: petitionColors,
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

  const pollColors = pollsSorted.map((_, i) =>
     i < pollsSorted.length / 2 ? "#22c55e" : "#ef4444"
  );

  const pollVotesData = {
    labels: pollsSorted.map((p) => p.title),
    datasets: [
      {
        label: "Votes",
        data: pollsSorted.map((p) => p.totalVotes),
        backgroundColor: pollColors,
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
        backgroundColor: ["#22c55e" , "#ef4444"]
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: { legend: { position: "bottom" } },
    maintainAspectRatio: false,
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-xl md:text-3xl font-bold text-blue-900 mb-8 text-left">
        Reports
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        <div className="bg-white/90 border border-blue-100 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Petitions by Status</h2>
          <div className="h-64">
            <Pie data={petitionStatusData} options={pieOptions} />
            {(petitionStatusData.datasets.data ===0 || petitions?.length === 0) && <h3 className="text-red-600 text-2xl align-center h-58 w-58 text-center">Not Data</h3>}
          </div>
        </div>

        <div className="bg-white/90 border border-blue-100 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Petitions (High → Low Signs)</h2>
          <div className="h-64">
            <Bar data={petitionSignsData} options={barOptions} />
            {(petitionSignsData.datasets.data ===0 || petitions?.length === 0) && <h3 className="text-red-600 text-2xl align-center h-58 w-58 text-center">Not Data</h3>}
          </div>
        </div>

        <div className="bg-white/90 border border-blue-100 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Polls (High → Low Votes)</h2>
          <div className="h-64">
            <Bar data={pollVotesData} options={barOptions} />
            {(pollVotesData.datasets.data ===0 || polls?.length === 0) && <h3 className="text-red-600 text-2xl align-center h-58 w-58 text-center">Not Data</h3>}
          </div>
        </div>

        <div className="bg-white/90 border border-blue-100 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Active vs Closed Polls</h2>
          <div className="h-64">
            <Pie data={pollStatusData} options={pieOptions} />
            { polls?.length === 0 && <h3 className="text-red-600 text-2xl align-center h-58 w-58 text-center">Not Data</h3>}
          </div>
        </div>
      </div>
    </div>
  );
};
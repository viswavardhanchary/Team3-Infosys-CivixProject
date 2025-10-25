import  { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userInfo, updateProfile, deleteAccount } from "../axios/user";
import { getPetitionsData } from "../axios/petition";
import { getPollsData } from "../axios/poll";
import { Pie } from "react-chartjs-2";
import {getSignsApi} from '../axios/sign';
import { Bounce, toast } from "react-toastify";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({
    name: "",
    phone: "",
    bio: "",
    socialLinks: ["", "", ""]
  });

  const [petitionStats, setPetitionStats] = useState({
    created: 0,
    active: 0,
    signed: 0
  });
  const [pollStats, setPollStats] = useState({
    created: 0,
    active: 0,
    voted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const uRes = await userInfo();
      if (uRes.found) {
        const u = uRes.user;
        setUser(u);
        setEditableUser({
          name: u.name || "",
          phone: u.phone || "",
          bio: u.bio || "",
          socialLinks: [
            u.socialLinks?.linkedin || "",
            u.socialLinks?.twitter || "",
            u.socialLinks?.github || ""
          ]
        });
      }

      const pRes = await getPetitionsData();
      const poRes = await getPollsData();
      const sRes = await getSignsApi();
      if (pRes.found && uRes.found) {
        const myId = uRes.user._id;
        const petitions = pRes.data;
        const created = petitions.filter(p => p.created_user_id === myId).length;
        const active = petitions.filter(p => p.status === "Active").length;
        const signed = sRes.data.filter(p => p.signed_user_id === uRes.user._id).length;
        setPetitionStats({ created, active, signed });
      }
      if (poRes.found && uRes.found) {
        const myId = uRes.user._id;
        const polls = poRes.data;
        const created = polls.filter(p => p.created_user_id === myId).length;
        const active = polls.filter(p => !p.isClosed).length;
        const voted = polls.filter(p =>
          p.options.some(o => o.votes.includes(myId))
        ).length;
        setPollStats({ created, active, voted });
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleSave = async () => {
    const res = await updateProfile({
      name: editableUser.name,
      phone: editableUser.phone,
      bio: editableUser.bio,
      socialLinks: {
        link1: editableUser.socialLinks[0],
        link2: editableUser.socialLinks[1],
        link3: editableUser.socialLinks[2]
      }
    });
    if(res.found) {
    toast.success(res.message, {
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
    }else {
      toast.error(res.message, {
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
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      const res = await deleteAccount();
      alert(res.message);
      localStorage.clear();
      window.location.href = "/";
    }
  };

  if (loading) return <div className="text-center py-10 text-white">Loading...</div>;

  return (
    <div className="bg-[#9ac4ee] flex flex-col items-start p-3 gap-5">
      <div className="text-3xl text-red-500">Profile</div>
        <div className="min-h-screen  text-gray-800">


      <div className="flex flex-col lg:flex-row gap-6 mb-10">
        

        <div className="bg-white rounded-xl p-6 w-full lg:w-1/3 shadow-md border border-gray-200">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-blue-500 text-white text-3xl font-bold mx-auto shadow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <textarea
            className="mt-4 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows={4}
            placeholder="Write your bio..."
            value={editableUser.bio}
            onChange={(e) =>
              setEditableUser({ ...editableUser, bio: e.target.value })
            }
          />

          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-blue-700">Social Links</h3>
            {editableUser.socialLinks.map((link, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Social Link ${index + 1}`}
                value={link}
                onChange={(e) => {
                  const updated = [...editableUser.socialLinks];
                  updated[index] = e.target.value;
                  setEditableUser({ ...editableUser, socialLinks: updated });
                }}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            ))}
          </div>
        </div>


        <div className="bg-white rounded-xl p-6 w-full lg:w-2/3 shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-gray-600 text-sm">Name</label>
              <input
                type="text"
                value={editableUser.name}
                onChange={(e) =>
                  setEditableUser({ ...editableUser, name: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Email</label>
              <input
                type="text"
                value={user.email}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 mt-1 text-gray-500"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Phone</label>
              <input
                type="text"
                value={editableUser.phone}
                onChange={(e) =>
                  setEditableUser({ ...editableUser, phone: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-600 text-sm">Role</label>
              <input
                type="text"
                value={user.role}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 mt-1 text-gray-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              Save Changes
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>


      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Petitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Petitions Created" count={petitionStats.created}>
            <Link to="/create-petition" className="bg-blue-600 p-2 rounded-md text-white">Create Petition</Link>
          </Card>
          <Card title="Active Petitions" count={petitionStats.active}>
            <Link to="/view-petitions" className="bg-blue-600 p-2 rounded-md text-white">View Petitions</Link>
          </Card>
          <Card title="Petitions Signed by Me" count={petitionStats.signed}>
            <Link to="/view-signed" className="bg-blue-600 p-2 rounded-md text-white">View Petitions</Link>
          </Card>
        </div>
      </section>


      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Polls</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Polls Created" count={pollStats.created}>
            <Link to="/create-poll" className="bg-blue-600 p-2 rounded-md text-white">Create Poll</Link>
          </Card>
          <Card title="Active Polls" count={pollStats.active}>
            <Link to="/view-polls" className="bg-blue-600 p-2 rounded-md text-white">View Polls</Link>
          </Card>
          <Card title="Polls Voted" count={pollStats.voted}>
            <Link to="/view-voted" className="bg-blue-600 p-2 rounded-md text-white">View Polls</Link>
          </Card>
        </div>
      </section>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <PieChart
          title="Petition Overview"
          data={[petitionStats.created, petitionStats.active, petitionStats.signed]}
          labels={["Created", "Active", "Signed"]}
        />
        <PieChart
          title="Poll Overview"
          data={[pollStats.created, pollStats.active, pollStats.voted]}
          labels={["Created", "Active", "Voted"]}
        />
      </div>
    </div>
    </div>

    
  );
};


const Card = ({ title, count, children }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-md transition-all">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-blue-500 mb-4">{count}</p>
    {children}
  </div>
);

const PieChart = ({ title, data, labels }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };
  const options = {
    plugins: { legend: { position: "bottom" } },
    maintainAspectRatio: false,
  };
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-3 text-blue-700">{title}</h3>
      <div className="w-56 h-56">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};



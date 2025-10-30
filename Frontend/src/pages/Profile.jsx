import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userInfo, updateProfile, deleteAccount, changePassword } from "../axios/user";
import { getPetitionsData } from "../axios/petition";
import { getPollsData } from "../axios/poll";
import { Pie } from "react-chartjs-2";
import { getSignsApi } from '../axios/sign';
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
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

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
      toast.success(res.message, { theme: "dark", transition: Bounce });
    } else {
      toast.error(res.message, { theme: "dark", transition: Bounce });
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

  if (loading) return <div className="text-center py-10 text-[#d8971d]">Loading...</div>;

  return (
    <div className="bg-[#F9F4EE] flex flex-col items-start p-3 gap-2 min-h-screen">
      <div className="text-3xl text-[#885800] font-bold mb-3">{user?.name} Profile</div>
      <div className="flex flex-col lg:flex-row gap-2 mb-2 w-full">


        <div className="bg-[#FFFDF9] rounded-xl p-6 w-full lg:w-1/3 shadow-md border border-[#D1E8FF]">
          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#d8971d]  text-white text-3xl font-bold mx-auto shadow">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <textarea
            className="mt-4 w-full p-3 bg-[#FFFDF9] border border-[#D1E8FF] rounded-lg text-gray-800 resize-none focus:ring-2 focus:ring-[#ebb145] focus:outline-none"
            rows={4}
            placeholder="Write your bio..."
            value={editableUser.bio}
            onChange={(e) =>
              setEditableUser({ ...editableUser, bio: e.target.value })
            }
          />

          <div className="mt-6 space-y-3">
            <h3 className="text-lg font-semibold text-[#d8971d] ">Social Links</h3>
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
                className="w-full bg-[#FFFDF9] border border-[#D1E8FF] rounded-lg p-2 text-sm focus:ring-2 focus:ring-[#ebb145] focus:outline-none"
              />
            ))}
          </div>
        </div>


        <div className="bg-[#FFFDF9] rounded-xl p-6 w-full lg:w-2/3 shadow-md border border-[#D1E8FF]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-[#d8971d] text-sm">Name</label>
              <input
                type="text"
                value={editableUser.name}
                onChange={(e) =>
                  setEditableUser({ ...editableUser, name: e.target.value })
                }
                className="w-full bg-[#FFFDF9] border border-[#D1E8FF] rounded-lg p-2 mt-1 focus:ring-2 focus:ring-[#ebb145] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[#d8971d] text-sm">Email</label>
              <input
                type="text"
                value={user.email}
                readOnly
                className="w-full bg-[#F9F4EE] border border-[#D1E8FF] rounded-lg p-2 mt-1 text-gray-600"
              />
            </div>
            <div>
              <label className="text-[#d8971d] text-sm">Phone</label>
              <input
                type="text"
                value={editableUser.phone}
                onChange={(e) =>
                  setEditableUser({ ...editableUser, phone: e.target.value })
                }
                className="w-full bg-[#FFFDF9] border border-[#D1E8FF] rounded-lg p-2 mt-1 focus:ring-2 focus:ring-[#ebb145] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[#d8971d] text-sm">Role</label>
              <input
                type="text"
                value={user.role}
                readOnly
                className="w-full bg-[#F9F4EE] border border-[#D1E8FF] rounded-lg p-2 mt-1 text-gray-600"
              />
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleSave}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              Save Changes
            </button>
            <button
              onClick={handleDelete}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              Delete Account
            </button>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="bg-[#14B8A6] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg transition shadow-sm"
            >
              {showChangePassword ? "Cancel" : "Change Password"}
            </button>
          </div>

          {showChangePassword && (
            <div className="mt-4 p-4 bg-[#FFFDF9] border border-[#D1E8FF] rounded-lg">
              <h4 className="text-[#d8971d]  font-semibold mb-3">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="p-2 border border-[#D1E8FF] rounded"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="p-2 border border-[#D1E8FF] rounded"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="p-2 border border-[#D1E8FF] rounded"
                />
              </div>
              <div className="mt-3">
                <button
                  disabled={isSubmittingPassword}
                  onClick={async () => {
                    if (!oldPassword || !newPassword || !confirmPassword) {
                      toast.error("Please fill all fields", { theme: "dark", transition: Bounce });
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      toast.error("New passwords do not match", { theme: "dark", transition: Bounce });
                      return;
                    }
                    if (newPassword.length < 6) {
                      toast.error("Password should be at least 6 characters", { theme: "dark", transition: Bounce });
                      return;
                    }
                    setIsSubmittingPassword(true);
                    const res = await changePassword({ oldPassword, newPassword });
                    setIsSubmittingPassword(false);
                    if (res.found) {
                      toast.success(res.message, { theme: "dark", transition: Bounce });
                      setShowChangePassword(false);
                      setOldPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    } else {
                      toast.error(res.message, { theme: "dark", transition: Bounce });
                    }
                  }}
                  className="bg-[#14B8A6] disabled:opacity-50 hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg transition shadow-sm"
                >
                  {isSubmittingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      <section className="mb-2 w-full" >
        <h2 className="text-2xl font-bold mb-4 text-[#885800]">Petitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Petitions Created" count={petitionStats.created} buttonText="Create Petition" buttonLink="/home/petitions/form"/>
          <Card title="Active Petitions" count={petitionStats.active} buttonText="View Petitions" buttonLink="/home/petitions"/>
          <Card title="Petitions Signed by Me" count={petitionStats.signed} buttonText="View Petitions" buttonLink="/home/petitions"/>
        </div>
      </section>


      <section className="mb-2 w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#885800]">Polls</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Polls Created" count={pollStats.created} buttonText="Create Poll" buttonLink="/home/polls/form"/>
          <Card title="Active Polls" count={pollStats.active} buttonText="View Polls" buttonLink="/home/polls"/>
          <Card title="Polls Voted" count={pollStats.voted} buttonText="View Polls" buttonLink="/home/polls"/>
        </div>
      </section>

      <div className="flex flex-col items-start gap-2 w-full">
        <h2 className="text-2xl font-bold mb-4 text-[#885800]">Reports Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
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

const Card = ({ title, count, buttonText, buttonLink }) => (
  <div className="bg-[#FFFDF9] p-6 rounded-xl border border-[#D1E8FF] text-center shadow-sm hover:shadow-md transition-all">
    <h3 className="text-lg font-semibold text-[#d8971d] mb-2">{title}</h3>
    <p className="text-3xl font-bold text-[#000000] mb-4">{count}</p>
    <Link to={buttonLink} className="bg-[#d8971d] hover:bg-[#906008] p-2 rounded-md text-white transition">{buttonText}</Link>
  </div>
);

const PieChart = ({ title, data, labels }) => {
  const chartColors = ["#60A5FA", "#34D399", "#A78BFA"];
  const borderColor = "#1D4ED8";

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: chartColors,
        borderColor: borderColor,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: "#1D4ED8", font: { size: 14 } },
      },
      tooltip: {
        backgroundColor: "#1D4ED8",
        titleColor: "#FFFDF9",
        bodyColor: "#F9F4EE",
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-[#F9F4EE] p-6 rounded-xl border border-[#CBB89D] shadow-sm flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-3 text-[#A68C69]">{title}</h3>
      <div className="w-56 h-56">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  );
};

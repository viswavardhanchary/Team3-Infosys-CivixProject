import { useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { add } from "../axios/petition";
import { toast, Bounce } from 'react-toastify';
import { Link, useLocation, useNavigate } from "react-router-dom";

export function PetitionForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(location.state || {
    id: undefined,
    title: "",
    category: "",
    location: "",
    goal: 100,
    description: "",
    acknowledge: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm({ ...form, [id]: type === "checkbox" ? checked : value });
  };

  const submitPetition = async () => {
    const { id, title, category, location, description, acknowledge, goal } = form;
    let newErrors = {};

    if (!title) newErrors.title = "Title is required.";
    if (!category) newErrors.category = "Category is required.";
    if (!location) newErrors.location = "Location is required.";
    if (!description) newErrors.description = "Description is required.";
    if (!acknowledge)
      newErrors.acknowledge = "You must acknowledge that the data is factual.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const response = await add({
      id,
      title,
      category,
      location,
      description,
      goal,
      status: "Active",
    });
    if (!response.found) {
      toast.error(response.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    } else {
      toast.success(response.message, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    }
    setForm({
      title: "",
      category: "",
      location: "",
      goal: 100,
      description: "",
      acknowledge: false,
    });
  };

  const cancelPetition = () => {
    setForm({
      title: "",
      category: "",
      location: "",
      goal: 100,
      description: "",
      acknowledge: false,
    });
  };

  return (
    <div className="flex flex-col min-h-screen gap-5 bg-gradient-to-br from-[#F5E8D0] via-[#EBD3B7] to-[#D6B892] p-6">


      <Link
        to="/home/petitions"
        className="p-2 text-white bg-[#C4A484] rounded-md w-max hover:bg-[#D6B892] hover:scale-105 transition-transform transition-colors shadow-md"
      >
        &lt; Back to Petitions
      </Link>


      <div className="bg-gradient-to-br from-[#FAF3E0] to-[#EED9B9] p-4 md:p-6 rounded-xl shadow-lg border border-[#CBB292] flex flex-col gap-5">

        <h1 className="text-2xl md:text-4xl font-extrabold text-[#4B3B2F] text-center drop-shadow-sm">
          Create a Petition
        </h1>
        <p className="text-[#5C4A3A] text-center mb-4">
          Complete the form below to create a petition in your community
        </p>

        <div className="flex flex-col gap-4">


          <div>
            <label htmlFor="title" className="font-bold block mb-1 text-[#4B3B2F]">
              Petition Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give your petition a clear, specific title"
              className={`w-full p-2 rounded-md border ${errors.title ? "border-red-500" : "border-[#CBB292]"} bg-[#FFF9EE] text-[#4B3B2F] placeholder-gray-600 hover:border-[#D6B892] focus:ring-2 focus:ring-[#C4A484] transition`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            <p className="text-xs text-[#5C4A3A] mt-1">
              Choose a title that clearly states what change you want to see.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="font-bold block mb-1 text-[#4B3B2F]">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                id="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${errors.category ? "border-red-500" : "border-[#CBB292]"} bg-[#FFF9EE] text-[#4B3B2F] hover:border-[#D6B892] focus:ring-2 focus:ring-[#C4A484] transition`}
              >
                <option value="">Select a category</option>
                <option value="all">All</option>
                <option value="environment">Environment</option>
                <option value="education">Education</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="health">Health</option>
                <option value="rights">Public Safety</option>
                <option value="transportation">Transportation</option>
                <option value="healthcare">Health Care</option>
                <option value="housing">Housing</option>
              </select>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="location" className="font-bold block mb-1 text-[#4B3B2F]">
                Location <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                className={`w-full p-2 rounded-md border ${errors.location ? "border-red-500" : "border-[#CBB292]"} bg-[#FFF9EE] text-[#4B3B2F] placeholder-gray-600 hover:border-[#D6B892] focus:ring-2 focus:ring-[#C4A484] transition`}
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
              <p className="text-xs text-[#5C4A3A] mt-1">
                The area this petition concerns (e.g., Delhi)
              </p>
            </div>
          </div>


          <div>
            <label htmlFor="goal" className="font-bold block mb-1 text-[#4B3B2F]">
              Signature Goal
            </label>
            <input
              type="number"
              id="goal"
              value={form.goal}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-[#CBB292] bg-[#FFF9EE] text-[#4B3B2F] hover:border-[#D6B892] focus:ring-2 focus:ring-[#C4A484] transition"
            />
            <p className="text-xs text-[#5C4A3A] mt-1">
              How many signatures are you aiming to collect?
            </p>
          </div>


          <div>
            <label htmlFor="description" className="font-bold block mb-1 text-[#4B3B2F]">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              rows="5"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue and the change you'd like to see..."
              className={`w-full p-2 rounded-md border ${errors.description ? "border-red-500" : "border-[#CBB292]"} bg-[#FFF9EE] text-[#4B3B2F] placeholder-gray-600 hover:border-[#D6B892] focus:ring-2 focus:ring-[#C4A484] transition`}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            <p className="text-xs text-[#5C4A3A] mt-1">
              Clearly explain the issue, why it matters, and what specific action you're requesting.
            </p>
          </div>


          <div className="bg-[#FFF3E0] border border-[#E6C79C] p-3 rounded-md flex gap-3 items-start shadow-sm">
            <AiOutlineWarning className="w-6 h-6 text-[#B87333]" />
            <div>
              <p className="font-bold mb-1 text-[#A66E38] text-lg">Important information</p>
              <p className="text-[#5C4A3A] text-md">
                By submitting this petition, you acknowledge that the content is factual to the best of your knowledge and does not contain misleading information. Civix reserves the right to remove petitions that violate our{" "}
                <Link to="/home/petitions" className="text-[#A67C52] underline">
                  community guidelines
                </Link>.
              </p>
            </div>
          </div>


          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="acknowledge"
              checked={form.acknowledge}
              onChange={handleChange}
              className="w-4 h-4 accent-[#C4A484]"
            />
            <label htmlFor="acknowledge" className="text-[#4B3B2F] font-medium">
              I confirm that the above information is factual{" "}
              <span className="text-red-600">*</span>
            </label>
          </div>
          {errors.acknowledge && <p className="text-red-600 text-sm">{errors.acknowledge}</p>}

          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={submitPetition}
              className="bg-[#C4A484] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#D6B892] hover:scale-105 transition-transform transition-colors cursor-pointer shadow-md"
            >
              Submit Petition
            </button>
            <button
              onClick={cancelPetition}
              className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-500 hover:scale-105 transition-transform transition-colors cursor-pointer shadow-md"
            >
              Clear Petition
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from '../axios/user'
import { toast, Bounce } from 'react-toastify';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePassword = (password) =>
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value) error = "Name is required.";
        break;
      case "email":
        if (!value) error = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email.";
        break;
      case "password":
        if (!value) error = "Password is required.";
        else if (!validatePassword(value))
          error =
            "Password must be 8+ chars, include upper, lower, number & special char.";
        break;
      case "role":
        if (!value) error = "Role is required.";
        break;
      case "location":
        if (!value) error = "Location is required.";
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const errorMsg = validateField(name, value);
    setErrors({ ...errors, [name]: errorMsg });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let tempErrors = {};
    Object.keys(formData).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) tempErrors[key] = errorMsg;
    });

    setErrors(tempErrors);

    if (Object.keys(tempErrors).length === 0) {
      const result = await signup(formData);
      if (!result.found) {
        toast.error(result.message, {
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
      } else {
        localStorage.setItem("token", result.token);
        toast.success(result.message, {
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
        navigate('/home/dashboard');
      }
    }
  };


  const inputClass = (fieldName) => {
    if (errors[fieldName]) {
      return "border-red-500 bg-red-100";
    } else if (formData[fieldName]) {
      return "border-green-500 bg-green-100";
    } else {
      return "border-gray-300 bg-white";
    }
  };

  return (
    <div className="flex items-center justify-center w-full">

      <div className="flex w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-md shadow-xl overflow-hidden my-2">

        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#d2b48c] to-[#c19a6b] p-3 text-white">
          <h1 className="text-3xl font-bold mb-2">CIVIX</h1>
          <p className="mb-4">Digital civic engagement platform</p>
          <img
            src="/images/parliament.avif"
            alt="Parliament"
            className="rounded-lg shadow-lg"
          />
        </div>


        <div className="flex-1 flex items-center flex-col justify-center p-3 bg-[#5a2320]">
          <div className="flex flex-1 flex-col items-center justify-center text-white md:hidden">
            <h1 className="text-3xl font-bold mb-2">CIVIX</h1>
            <p className="mb-4 text-center">Digital civic engagement platform</p>
          </div>
          <div className="w-full max-w-sm text-white">
            <h2 className="text-2xl font-bold mb-6">Signup</h2>
            <form onSubmit={handleSubmit} noValidate>

              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`w-full px-4 py-2 rounded-lg text-black border ${inputClass(
                    "name"
                  )}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-sm text-[#ff6b6b] mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-4 py-2 rounded-lg text-black border ${inputClass(
                    "email"
                  )}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-sm text-[#ff6b6b] mt-1">{errors.email}</p>
                )}
              </div>


              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  className={`w-full px-4 py-2 rounded-lg text-black border ${inputClass(
                    "password"
                  )}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <p className="text-sm text-[#ff6b6b] mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Role <span className="text-red-400">*</span>
                </label>
                <select
                  name="role"
                  className={`w-full px-4 py-2 rounded-lg text-black border ${inputClass(
                    "role"
                  )}`}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select Role</option>
                  <option value="citizen">Citizen</option>
                  <option value="official">Official</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-[#ff6b6b] mt-1">{errors.role}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  className={`w-full px-4 py-2 rounded-lg text-black border ${inputClass(
                    "location"
                  )}`}
                  value={formData.location}
                  onChange={handleChange}
                />
                {errors.location && (
                  <p className="text-sm text-[#ff6b6b] mt-1">{errors.location}</p>
                )}
              </div>


              <button
                type="submit"
                className="w-full py-2 mt-2 rounded-lg bg-[#c19a6b] hover:bg-[#ff8000] transition font-semibold cursor-pointer"
              >
                Signup
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-[#ff9f43] hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Signup;
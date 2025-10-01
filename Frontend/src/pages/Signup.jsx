// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { signup } from '../axios/user'
// import { toast, Bounce } from 'react-toastify';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "",
//     location: "",
//   });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const validatePassword = (password) =>
//     /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

//   const validateField = (name, value) => {
//     let error = "";

//     switch (name) {
//       case "name":
//         if (!value) error = "Name is required.";
//         break;
//       case "email":
//         if (!value) error = "Email is required.";
//         else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email.";
//         break;
//       case "password":
//         if (!value) error = "Password is required.";
//         else if (!validatePassword(value))
//           error =
//             "Password must be 8+ chars, include upper, lower, number & special char.";
//         break;
//       case "role":
//         if (!value) error = "Role is required.";
//         break;
//       case "location":
//         if (!value) error = "Location is required.";
//         break;
//       default:
//         break;
//     }

//     return error;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     const errorMsg = validateField(name, value);
//     setErrors({ ...errors, [name]: errorMsg });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let tempErrors = {};
//     Object.keys(formData).forEach((key) => {
//       const errorMsg = validateField(key, formData[key]);
//       if (errorMsg) tempErrors[key] = errorMsg;
//     });

//     setErrors(tempErrors);

//     if (Object.keys(tempErrors).length === 0) {
//       const result = await signup(formData);
//       if (!result.found) {
//         toast.error(result.message, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Bounce,
//         });
//         return;
//       } else {
//         localStorage.setItem("token", result.token);
//         toast.success(result.message, {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: false,
//           closeOnClick: false,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//           theme: "dark",
//           transition: Bounce,

//         });
//         navigate('/home/dashboard');
//       }
//     }
//   };


//   const inputClass = (fieldName) => {
//     if (errors[fieldName]) {
//       return "border-red-500 bg-red-100";
//     } else if (formData[fieldName]) {
//       return "border-green-500 bg-green-100";
//     } else {
//       return "border-gray-300 bg-white";
//     }
//   };

//   return (
//     <div className="flex items-center justify-center w-full">
//       <div className="flex w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-md shadow-xl overflow-hidden py-2">

//         <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#e6b380] text-gray-800 rounded-l-xl">
//             <h1 className="text-3xl font-bold">CIVIX</h1>
//             <p className="mb-4">Digital civic engagement platform</p>
//           <img src="/images/parliament.avif" alt="Parliament" className="rounded-lg shadow-lg w-sm-xl" />
//         </div>

//         <div className="flex-1 flex items-center flex-col justify-center py-4 px-2 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-gray-800 shadow-lg rounded-r-xl">


//           <div className="flex flex-1 flex-col items-center justify-center text-white md:hidden">
//             <h1 className="text-3xl font-bold mb-2">CIVIX</h1>
//             <p className="mb-4 text-center">Digital civic engagement platform</p>
//           </div>

//           <div className="w-full max-w-sm text-white">
//             <h2 className="text-2xl font-bold mb-6">Signup</h2>
//             <form onSubmit={handleSubmit} noValidate>

//               <div className="mb-4">
//                 <label className="block mb-1 font-medium">Full Name <span className="text-red-400">*</span></label>
//                 <input
//                   type="text"
//                   name="name"
//                   className={`w-full px-4 py-2 rounded-lg text-black focus:ring-2 focus:ring-[#62d171] bg-white outline-none ${errors.name ? "border border-red-400 bg-red-50" : ""}`}
//                   value={formData.name}
//                   onChange={handleChange}
//                 />
//                 {errors.name && <p className="text-sm text-red-300 mt-1">{errors.name}</p>}
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-1 font-medium">Email <span className="text-red-400">*</span></label>
//                 <input
//                   type="email"
//                   name="email"
//                   className={`w-full px-4 py-2 rounded-lg text-black focus:ring-2 focus:ring-[#62d171] bg-white outline-none ${errors.email ? "border border-red-400 bg-red-50" : ""}`}
//                   value={formData.email}
//                   onChange={handleChange}
//                 />
//                 {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email}</p>}
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-1 font-medium">Password <span className="text-red-400">*</span></label>
//                 <input
//                   type="password"
//                   name="password"
//                   className={`w-full px-4 py-2 rounded-lg text-black focus:ring-2 focus:ring-[#6bc17b] bg-white outline-none ${errors.password ? "border border-red-400 bg-red-50" : ""}`}
//                   autoComplete='current-password'
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//                 {errors.password && <p className="text-sm text-red-300 mt-1">{errors.password}</p>}
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-1 font-medium">Role <span className="text-red-400">*</span></label>
//                 <select
//                   name="role"
//                   className={`w-full px-4 py-2 rounded-lg text-black focus:ring-2 focus:ring-[#62d171] bg-white outline-none ${errors.role ? "border border-red-400 bg-red-50" : ""}`}
//                   value={formData.role}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Role</option>
//                   <option value="citizen">Citizen</option>
//                   <option value="official">Official</option>
//                 </select>
//                 {errors.role && <p className="text-sm text-red-300 mt-1">{errors.role}</p>}
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-1 font-medium">Location <span className="text-red-400">*</span></label>
//                 <input
//                   type="text"
//                   name="location"
//                   className={`w-full px-4 py-2 rounded-lg text-black focus:ring-2 focus:ring-[#62d171] bg-white outline-none ${errors.location ? "border border-red-400 bg-red-50" : ""}`}
//                   value={formData.location}
//                   onChange={handleChange}
//                 />
//                 {errors.location && <p className="text-sm text-red-300 mt-1">{errors.location}</p>}
//               </div>

//               <button type="submit" className="w-full py-2 rounded-lg bg-[#22c55e] hover:bg-[#2e9827] transition font-semibold cursor-pointer">
//                 Signup
//               </button>
//             </form>

//             <p className="text-center text-sm mt-4">
//               Already have an account? <Link to="/login" className="text-red-300 hover:underline">Login here</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>


//   );
// };

// export default Signup;



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../axios/user";
import { toast, Bounce } from "react-toastify";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [otpStep, setOtpStep] = useState(false); // Track OTP step
  const [otp, setOtp] = useState(""); // OTP field
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
      // Special case: if role is "official"
      if (formData.role === "official") {
        if (!formData.email.endsWith("@civix.gov.in")) {
          toast.error("Invalid email. Officials must use @civix.gov.in", {
            position: "top-right",
            autoClose: 5000,
            theme: "dark",
            transition: Bounce,
          });
          return;
        }

        // Step 1: move to OTP input instead of direct signup
        if (!otpStep) {
          setOtpStep(true);
          toast.info("Enter OTP sent to your official email", {
            position: "top-right",
            autoClose: 4000,
            theme: "dark",
            transition: Bounce,
          });
          return;
        }

        // Step 2: OTP verification (dummy for now)
        if (otp !== "123456") {
          toast.error("Invalid OTP. Please try again.", {
            position: "top-right",
            autoClose: 4000,
            theme: "dark",
            transition: Bounce,
          });
          return;
        }
      }

      // Normal signup (Citizen or Official after OTP)
      const result = await signup(formData);

      if (!result.found) {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
          transition: Bounce,
        });
        return;
      } else {
        localStorage.setItem("token", result.token);
        toast.success(result.message, {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
          transition: Bounce,
        });
        navigate("/home/dashboard");
      }
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-md shadow-xl overflow-hidden py-2">
        {/* Left Panel */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#e6b380] text-gray-800 rounded-l-xl">
          <h1 className="text-3xl font-bold">CIVIX</h1>
          <p className="mb-4">Digital civic engagement platform</p>
          <img
            src="/images/parliament.avif"
            alt="Parliament"
            className="rounded-lg shadow-lg w-sm-xl"
          />
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex items-center flex-col justify-center py-4 px-2 bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-gray-800 shadow-lg rounded-r-xl">
          <div className="flex flex-1 flex-col items-center justify-center text-white md:hidden">
            <h1 className="text-3xl font-bold mb-2">CIVIX</h1>
            <p className="mb-4 text-center">Digital civic engagement platform</p>
          </div>

          <div className="w-full max-w-sm text-white">
            <h2 className="text-2xl font-bold mb-6">Signup</h2>
            <form onSubmit={handleSubmit} noValidate>
              {!otpStep && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={`w-full px-4 py-2 rounded-lg text-black bg-white outline-none ${
                        errors.name ? "border border-red-400 bg-red-50" : ""
                      }`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-300 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      className={`w-full px-4 py-2 rounded-lg text-black bg-white outline-none ${
                        errors.email ? "border border-red-400 bg-red-50" : ""
                      }`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-300 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Password <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      className={`w-full px-4 py-2 rounded-lg text-black bg-white outline-none ${
                        errors.password ? "border border-red-400 bg-red-50" : ""
                      }`}
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-300 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Role <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="role"
                      className={`w-full px-4 py-2 rounded-lg text-black bg-white outline-none ${
                        errors.role ? "border border-red-400 bg-red-50" : ""
                      }`}
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="">Select Role</option>
                      <option value="citizen">Citizen</option>
                      <option value="official">Official</option>
                    </select>
                    {errors.role && (
                      <p className="text-sm text-red-300 mt-1">{errors.role}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Location <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      className={`w-full px-4 py-2 rounded-lg text-black bg-white outline-none ${
                        errors.location ? "border border-red-400 bg-red-50" : ""
                      }`}
                      value={formData.location}
                      onChange={handleChange}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-300 mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* OTP Step */}
              {otpStep && (
                <div className="mb-4">
                  <label className="block mb-1 font-medium">
                    Enter OTP <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="otp"
                    className="w-full px-4 py-2 rounded-lg text-black bg-white outline-none"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-[#22c55e] hover:bg-[#2e9827] transition font-semibold cursor-pointer"
              >
                {otpStep ? "Verify OTP" : "Signup"}
              </button>
            </form>

            {!otpStep && (
              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-red-300 hover:underline">
                  Login here
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../axios/user";
import { toast, Bounce } from "react-toastify";
import {Spinner} from "../components/Spinner"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Spinner control
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
            "Password must include upper, lower, number & special character.";
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
    setErrors({ ...errors, [name]: validateField(name, value) });
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
      if (formData.role === "official") {
        if (!formData.email.endsWith("@civix.gov.in")) {
          toast.error("Officials must use @civix.gov.in email.", {
            theme: "dark",
            transition: Bounce,
          });
          return;
        }
        if (!otpStep) {
          setOtpStep(true);
          toast.info("Enter OTP sent to your official email.", {
            theme: "dark",
            transition: Bounce,
          });
          return;
        }
        if (otp !== "123456") {
          toast.error("Invalid OTP. Try again.", {
            theme: "dark",
            transition: Bounce,
          });
          return;
        }
      } else {
        if (!otpStep) {
          setOtpStep(true);
          toast.info("Enter OTP sent to your email.", {
            theme: "dark",
            transition: Bounce,
          });
          return;
        }
        if (otp !== "23456") {
          toast.error("Invalid OTP. Try again.", {
            theme: "dark",
            transition: Bounce,
          });
          return;
        }
      }

      try {
        setLoading(true); // ✅ show spinner
        const result = await signup(formData);
        setLoading(false); // ✅ hide spinner

        if (!result.found) {
          toast.error(result.message, { theme: "dark", transition: Bounce });
        } else {
          localStorage.setItem("token", result.token);
          toast.success(result.message, { theme: "dark", transition: Bounce });
          navigate("/home/dashboard");
        }
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong. Please try again.", {
          theme: "dark",
          transition: Bounce,
        });
      }
    }
  };

  // ✅ Show spinner while backend call is in progress
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5EDE2]">
      <div className="flex flex-col md:flex-row bg-[#EADDC7] rounded-lg shadow-2xl overflow-hidden w-full max-w-5xl">
        {/* Left Section */}
        <div className="md:w-1/2 relative flex items-center justify-center">
          <img
            src="/images/parliament.avif"
            alt="Signup Visual"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute top-6 text-center text-white drop-shadow-md">
            <h1 className="text-4xl font-extrabold text-[#F9F3ED]">CIVIX</h1>
            <p className="text-[#EFE2D0] text-sm mt-1">
              Digital civic engagement platform
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex flex-col justify-center p-10 text-[#5B3A29]">
          <h2 className="text-3xl font-bold mb-6 text-[#4A2E1F] text-center">
            Signup
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!otpStep ? (
              <>
                {["name", "email", "password", "role", "location"].map(
                  (field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1 capitalize">
                        {field} <span className="text-[#9C6B3B]">*</span>
                      </label>
                      {field === "role" ? (
                        <select
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg bg-[#FDFBF8] border ${
                            errors[field]
                              ? "border-red-400 bg-red-50"
                              : "border-[#D7C3A9]"
                          } focus:ring-2 focus:ring-[#B68B60] outline-none text-[#4A2E1F]`}
                        >
                          <option value="">Select Role</option>
                          <option value="citizen">Citizen</option>
                          <option value="official">Official</option>
                        </select>
                      ) : (
                        <input
                          type={field === "password" ? "password" : "text"}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-lg bg-[#FDFBF8] border ${
                            errors[field]
                              ? "border-red-400 bg-red-50"
                              : "border-[#D7C3A9]"
                          } focus:ring-2 focus:ring-[#B68B60] outline-none text-[#4A2E1F]`}
                        />
                      )}
                      {errors[field] && (
                        <p className="text-sm text-red-400 mt-1">
                          {errors[field]}
                        </p>
                      )}
                    </div>
                  )
                )}
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enter OTP <span className="text-[#9C6B3B]">*</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#FDFBF8] border border-[#D7C3A9] focus:ring-2 focus:ring-[#B68B60] outline-none text-[#4A2E1F]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#B68B60] hover:bg-[#A47650] text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
            >
              {otpStep ? "Verify OTP" : "Signup"}
            </button>
          </form>

          {!otpStep && (
            <p className="text-center text-sm mt-4 text-[#5B3A29]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#9C6B3B] hover:underline font-semibold"
              >
                Login here
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

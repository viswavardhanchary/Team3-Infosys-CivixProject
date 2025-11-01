import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, verify } from "../axios/user";
import { toast, Bounce } from "react-toastify";
import {useEffect} from 'react';
import { Spinner } from "../components/Spinner";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      setIsLoading(true);
      let result = {found: false , message : "Login Needed"}
      if(localStorage.getItem("token") !== null)result = await verify();
      setIsLoading(false);
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
    check();
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(form);
    setIsLoading(false);
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
  };

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <div className="flex items-center justify-center min-h-screen bg-[#F5EDE2]">
          <div className="flex flex-col md:flex-row bg-[#EADDC7] rounded-lg shadow-2xl overflow-hidden w-full max-w-5xl">
            <div className="md:w-1/2 bg-[#DCC7A1] relative flex items-center justify-center">
              <img
                src="/images/parliament.avif"
                alt="CIVIX"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-6 text-center text-white drop-shadow-md">
                <h1 className="text-4xl font-extrabold text-[#F9F3ED]">CIVIX</h1>
                <p className="text-[#EFE2D0] text-sm mt-1">
                  Digital civic engagement platform
                </p>
              </div>
            </div>

            <div className="md:w-1/2 flex flex-col justify-center p-10 text-[#5B3A29]">
              <h2 className="text-3xl font-bold mb-6 text-[#4A2E1F]">Login</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email <span className="text-[#9C6B3B]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#FDFBF8] border border-[#D7C3A9] focus:outline-none focus:ring-2 focus:ring-[#B68B60] text-[#4A2E1F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password <span className="text-[#9C6B3B]">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-[#FDFBF8] border border-[#D7C3A9] focus:outline-none focus:ring-2 focus:ring-[#B68B60] text-[#4A2E1F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#B68B60] hover:bg-[#A47650] text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-300"
                >
                  Login
                </button>
              </form>

              <p className="text-center text-sm mt-4 text-[#5B3A29]">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#9C6B3B] hover:underline font-semibold">
                  Signup here
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
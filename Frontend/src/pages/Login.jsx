import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, verify } from '../axios/user.js';
import { toast, Bounce } from 'react-toastify';
import { useEffect } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    const check = async () => {
      const result = await verify();
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

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email address.";
    if (!formData.password) tempErrors.password = "Password is required.";
    else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const result = await login(formData)
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




  return (
    <div className='flex items-center justify-center w-full'>
      <div className="flex w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-xl shadow-xl overflow-hidden">

        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[#d2b48c] to-[#c19a6b] p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">CIVIX</h1>
          <p className="mb-4">Digital civic engagement platform</p>
          <img src="/images/parliament.avif" alt="Parliament" className="rounded-lg shadow-lg max-w-xs" />
        </div>

        <div className="flex-1 flex items-center flex-col justify-center p-8 bg-[#5a2320] ">
          <div className="flex flex-1 flex-col items-center justify-center text-white md:hidden">
            <h1 className="text-3xl font-bold mb-2">CIVIX</h1>
            <p className="mb-4 text-center">Digital civic engagement platform</p>
          </div>
          <div className="w-full max-w-sm text-white">
            <h2 className="text-2xl font-bold mb-6">Login</h2>
            <form onSubmit={handleSubmit} noValidate>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Email <span className="text-red-400">*</span></label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-4 py-2 rounded-lg text-black focus:ring-2 focus:ring-[#c19a6b] bg-white outline-none ${errors.email ? "border border-red-400 bg-red-50" : ""}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email}</p>}
              </div>


              <div className="mb-4">
                <label className="block mb-1 font-medium">Password <span className="text-red-400">*</span></label>
                <input
                  type="password"
                  name="password"
                  className={`w-full px-4 py-2 rounded-lg text-black focus:ring-2 focus:ring-[#c19a6b] bg-white outline-none ${errors.password ? "border border-red-400 bg-red-50" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="text-sm text-red-300 mt-1">{errors.password}</p>}
              </div>

              <button type="submit" className="w-full py-2 rounded-lg bg-[#c19a6b] hover:bg-[#ff8000] transition font-semibold cursor-pointer">
                Login
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Don’t have an account? <Link to="/signup" className="text-red-300 hover:underline">Signup here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Login;

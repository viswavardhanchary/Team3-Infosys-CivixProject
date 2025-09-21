import { add } from "../axios/petition";
import { toast, Bounce } from 'react-toastify';

export const Petitions = () => {
  const handleSubmit = async () => {
    const response = await add({
      title: "Plant More Trees in the Colony",
      description: "Request to increase greenery in the neighborhood by organizing tree plantation drives.",
      category: "Environment",
      location: "Hyderabad, Telangana",
      status: "Active"
    });
    if (!response.found) {
      toast.error(response.message, {
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
      toast.success(response.message, {
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
    }
  }
  return <>
    <div className="ml-14 md:ml-50 flex align-middle p-1 md:p-3 flex-col flex-1 gap-10">
      <div className="flex rounded-md  bg-[#c19a6b] p-4 justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl md:text-3xl text-white font-bold">Petitions</h1>
          <p>Browse , Sign , and track petitions in your community</p>
        </div>
        <div>
          <button className="p-2 rounded-md text-xl bg-[#ff8c00] text-white cursor-pointer hover:text-[#ff8c00] hover:bg-white" onClick={handleSubmit}>Create Petition</button>
        </div>
        
      </div>


    </div>

  </>
}
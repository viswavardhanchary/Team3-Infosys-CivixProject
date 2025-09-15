import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer , Bounce} from 'react-toastify';
import {Dashboard} from "./pages/Dashboard";
import { DashboardLayout } from "./Layouts/DashboardLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard/>
      }
    ]
  },
]);

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2e8da] via-[#e6d4bc] to-[#c19a6b] flex items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

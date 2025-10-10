import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer, Bounce } from 'react-toastify';
import { Dashboard } from "./pages/Dashboard";
import { HomeLayout } from "./Layouts/HomeLayout";
import { Settings } from "./pages/Settings";
import { Reports } from "./pages/Reports";
import { Officials } from "./pages/Officials";
import { Polls } from "./pages/Polls";
import { Petitions } from "./pages/Petitions";
import { PetitionForm } from "./pages/PetitionForm";
import { PollsForm } from "./pages/PollsForm";

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
    path: "/home",
    element: <HomeLayout />,
    children: [
      {
        path: '/home/dashboard',
        element: <Dashboard />
      },
      {
        path: '/home/petitions',
        element: <Petitions />
      },
      {
        path: '/home/petitions/form',
        element: <PetitionForm />
      },
      {
        path: '/home/polls',
        element: <Polls />
      },
      {
        path: '/home/polls/form',
        element: <PollsForm />
      },
      {
        path: '/home/officials',
        element: <Officials />
      },
      {
        path: '/home/reports',
        element: <Reports />
      },
      {
        path: '/home/settings',
        element: <Settings />
      },
    ]
  },
]);

function App() {
  return (
    <div className="min-h-screen bg-blue-100 flex">
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
        style={{ zIndex: 1000000 }}
      />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;

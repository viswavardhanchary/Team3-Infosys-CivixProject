import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { ToastContainer, Bounce } from "react-toastify";
import { Dashboard } from "./pages/Dashboard";
import { HomeLayout } from "./Layouts/HomeLayout";
import { Settings } from "./pages/Settings";
import { Reports } from "./pages/Reports";
import { Officials } from "./pages/Officials";
import { Polls } from "./pages/Polls";
import { Petitions } from "./pages/Petitions";
import { PetitionForm } from "./pages/PetitionForm";
import { PollsForm } from "./pages/PollsForm";
import { Profile } from "./pages/Profile";
import { HelpSupport } from "./pages/HelpSupport";
import { PageNotFound } from "./pages/PageNotFound";


const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  {
    path: "/home",
    element: <HomeLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "petitions", element: <Petitions /> },
      { path: "petitions/form", element: <PetitionForm /> },
      { path: "polls", element: <Polls /> },
      { path: "polls/form", element: <PollsForm /> },
      { path: "officials", element: <Officials /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
      { path: "help-support", element: <HelpSupport /> },
    ],
  },
  { path: "*" , element: <PageNotFound/>}
]);

function App() {
  return (
    <div className="min-h-screen bg-[#fdf3e7] flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
        style={{ zIndex: 1000000 }}
      />
      <RouterProvider router={router} />
    </div>
  );
}




export default App;

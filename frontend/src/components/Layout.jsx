import { Outlet } from "react-router";
import Navbar from "./Navbar";
import BackgroundGradient from "../ui/BackgroundGradient";

function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <BackgroundGradient className="absolute top-0 left-1/2 -translate-x-1/2" />

      <div className="relative z-50 pt-20">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

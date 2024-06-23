import { useSelector } from "react-redux";
import "./MainLayout.scss";

import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "~/component/Sidebar/Sidebar";

const MainLayout = () => {
   const { Auth } = useSelector((state) => state);
   if (!Auth.user) return <Navigate to={"/auth"} />;
   else
      return (
         <div className="MainLayout">
            <div className="sidebar-container">
               <Sidebar />
            </div>
            <div className="body-container">
               <Outlet />
            </div>
         </div>
      );
};

export default MainLayout;

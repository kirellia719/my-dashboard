import "./MainLayout.scss";

import { useEffect } from "react";
import api from "api";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentUserAction } from "../../redux/AuthReducer";

import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";

const MainLayout = () => {
   const dispatch = useDispatch();

   const Auth = useSelector((state) => state.Auth);
   useEffect(() => {
      const getCurrentUser = async () => {
         try {
            const { data } = await api.get("/auth/me");
            if (data) dispatch(GetCurrentUserAction(data));
         } catch (error) {
            console.error(error);
         }
      };

      if (Auth.token) {
         getCurrentUser();
      }
   }, [Auth.token]);

   if (!Auth.token) return <Navigate to={"/auth"} />;
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

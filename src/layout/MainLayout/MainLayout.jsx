import "./MainLayout.scss";

import { useEffect } from "react";
import api from "api";
import { useDispatch, useSelector } from "react-redux";
import { GetCurrentUserAction, LogoutAction } from "../../redux/AuthReducer";

import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "~/component/Sidebar/Sidebar";

import { processAPI, toast } from "../../utils/function";

const MainLayout = () => {
   const dispatch = useDispatch();

   const Auth = useSelector((state) => state.Auth);
   useEffect(() => {
      const getCurrentUser = async () => {
         try {
            const data = processAPI(await api.get("/auth/me"));
            dispatch(GetCurrentUserAction(data));
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

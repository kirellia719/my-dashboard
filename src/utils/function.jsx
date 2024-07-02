import { useEffect, useState } from "react";
import { Message, toaster } from "rsuite";
import store from "../redux";
import { LogoutAction } from "../redux/AuthReducer";
import { toast as t } from "react-toastify";

export const toThousands = (value) => {
   return (value ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,") : value) + " VNĐ";
};

export const useWindowSize = () => {
   const [screenSize, setScreenSize] = useState(window.innerWidth);
   useEffect(() => {
      const setSize = () => setScreenSize(window.innerWidth);

      window.addEventListener("resize", setSize);
      return () => window.removeEventListener("resize", setSize);
   }, [screenSize]);
   return screenSize < 768;
};

export const toast = (message, type = "success") => {
   toaster.push(
      <Message showIcon type={type}>
         {message}
      </Message>,
      { duration: 2000 }
   );
};

export const toastify = (message, type = "error") => {
   t(message, {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
   });
};

export const processAPI = (response) => {
   if (response.status === 200) {
      const { data, message } = response;
      return { data, message };
   } else {
      if (response.status === 401) {
         store.dispatch(LogoutAction());
      }
      toast(response.message, "error");
      return {};
   }
};

import { useEffect, useState } from "react";
import { Message, toaster } from "rsuite";
import store from "../redux";
import { LogoutAction } from "../redux/AuthReducer";

export const toThousands = (value) => {
   return (
      (value
         ? `${value}`.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
         : value) + " VNĐ"
   );
};

export const useWindowSize = () => {
   const [screenSize, setScreenSize] = useState(window.innerWidth);
   useEffect(() => {
      const setSize = () => setScreenSize(window.innerWidth);

      window.addEventListener("resize", setSize);
      return () => window.removeEventListener("resize", setSize);
   }, [screenSize]);
   return screenSize;
};

export const toast = (message, type = "success") => {
   toaster.push(
      <Message showIcon type={type}>
         {message}
      </Message>,
      { duration: 2000 }
   );
};

export const processAPI = (res) => {
   if (res.status === 200) {
      return res.data;
   } else {
      if (res.status === 401) {
         store.dispatch(LogoutAction());
      }
      toast(res.message, "error");
   }
};

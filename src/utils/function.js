import { useEffect, useState } from "react";

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

import "./style.scss";

import { useState } from "react";

import AuthForm from "./AuthForm";

const AuthLayout = () => {
   const [active, setActive] = useState(false);

   const handleToggle = () => {
      setActive(!active);
   };

   return (
      <div className="AuthLayout">
         <div className={`auth-body ${active ? "active" : ""}`}>
            <div className="container">
               <div className="blueBg">
                  <div className="box signin">
                     <h2>Đã có tài khoản</h2>
                     <button className="signinBtn" onClick={handleToggle}>
                        Sign in
                     </button>
                  </div>
                  <div className="box signup">
                     <h2>Chưa có tài khoản</h2>
                     <button className="signupBtn" onClick={handleToggle}>
                        Sign up
                     </button>
                  </div>
               </div>

               <AuthForm active={active} setActive={setActive} />
            </div>
         </div>
      </div>
   );
};

export default AuthLayout;

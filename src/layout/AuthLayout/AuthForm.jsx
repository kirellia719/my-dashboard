import { useState } from "react";

import api from "api";
import { LoginAction } from "../../redux/AuthReducer";
import { useDispatch } from "react-redux";

import { processAPI, toast } from "../../utils/function";

const LoginForm = () => {
   const dispatch = useDispatch();
   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const { username, password } = loginInput;
         const { data } = await api.post("/auth/login", {
            username,
            password,
         });
         if (data) {
            dispatch(LoginAction(data));
         }
      } catch (error) {
         processAPI({
            status: error?.response?.status || 500,
            message: "Lỗi hệ thống",
         });
      }
   };

   const [loginInput, setLoginInput] = useState({
      username: "",
      password: "",
   });

   const handleChange = (e) => setLoginInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));

   const { username, password } = loginInput;
   return (
      <form onSubmit={handleLogin}>
         <h3>Sign In</h3>
         <input type="text" placeholder="Tài khoản" name="username" value={username} onChange={handleChange} />
         <input type="password" placeholder="Mật khẩu" name="password" value={password} onChange={handleChange} />
         <input type="submit" value="Đăng nhập" />
         <p className="forgot">Quên mật khẩu</p>
      </form>
   );
};

const initRegisterInput = {
   username: "",
   email: "",
   password: "",
   confirmPassword: "",
};

const RegisterForm = ({ setActive }) => {
   const [registerInput, setRegisterInput] = useState(initRegisterInput);
   const handleRegister = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         toast("Mật khẩu nhập lại không khớp", "error");
      } else {
         try {
            const formRequest = {
               username: username,
               email: email,
               password: password,
            };

            const { data } = await api.post("/auth/register", formRequest);
            console.log(data);
         } catch (error) {}
      }
   };
   const handleChange = (e) =>
      setRegisterInput((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));

   const { username, email, password, confirmPassword } = registerInput;
   return (
      <form onSubmit={handleRegister}>
         <h3>Sign Up</h3>
         <input type="text" placeholder="Tài khoản" name="username" value={username} onChange={handleChange} />
         <input type="email" placeholder="Email" name="email" value={email} onChange={handleChange} />
         <input type="password" placeholder="Mật khẩu" name="password" value={password} onChange={handleChange} />
         <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
         />
         <input type="submit" value="Đăng ký" />
      </form>
   );
};

const AuthForm = ({ active, setActive }) => {
   return (
      <div className={`formBx ${active ? "active" : ""}`}>
         <div className="form signinForm">
            <LoginForm />
         </div>

         <div className={`form signupForm `}>
            <RegisterForm setActive={setActive} />
         </div>
      </div>
   );
};

export default AuthForm;

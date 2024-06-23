import User from "../models/User.js";

const login = async (req, res) => {
   try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (user) {
         if (user.password === password) {
            res.json({
               status: 200,
               message: "Login Success",
               data: user,
            });
         } else {
            res.json({
               status: 400,
               message: "Mật khẩu không đúng",
            });
         }
      } else {
         res.json({
            status: 400,
            message: "Tài khoản không tồn tại",
         });
      }
   } catch (error) {
      res.error(error);
   }
};

const register = async (req, res) => {
   try {
      const { username, password, email } = req.body;
      const findWithUser = await User.findOne({ username });
      const findWithEmail = await User.findOne({ email });
      if (findWithUser || findWithEmail) {
         res.json({
            status: 400,
            message: "Tài khoản hoặc Email đã tồn tại",
         });
      } else {
         const newUser = new User({
            username,
            password,
            email,
         });
         const result = await newUser.save();
         res.json({
            status: 200,
            message: "Đăng ký thành công",
            data: result,
         });
      }
   } catch (error) {
      res.error(error);
   }
};

export default { login, register };

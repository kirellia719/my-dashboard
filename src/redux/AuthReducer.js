const initialState = {
   token: localStorage.getItem("token") || null,
   user: null,
};

const GET_USER = "GetUser";
const LOGIN = "Login";
const LOGOUT = "Logout";

const AuthReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case LOGIN:
         localStorage.setItem("token", payload);
         return { ...state, token: payload };
      case LOGOUT:
         localStorage.removeItem("token");
         return { token: null, user: null };
      case GET_USER:
         return { ...state, user: payload };
      default:
         return state;
   }
};

// ACTION
export const LoginAction = (token) => async (dispatch) => {
   dispatch({ type: LOGIN, payload: token });
};
export const LogoutAction = () => async (dispatch) => {
   dispatch({ type: LOGOUT });
};

export const GetCurrentUserAction = (user) => async (dispatch) => {
   dispatch({ type: GET_USER, payload: user });
};

export default AuthReducer;

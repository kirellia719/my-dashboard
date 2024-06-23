const initialState = { token: null, user: null };

const GET_USER = "GetUser";

const AuthReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case GET_USER:
         return { ...state, user: payload };

      default:
         return state;
   }
};

// ACTION
export const GetUserAction = (user) => async (dispatch) => {
   dispatch({ type: GET_USER, payload: user });
};

export default AuthReducer;

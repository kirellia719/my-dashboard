const initialState = [];

const ALL_FASHIONS = "GellAllFashions";
const ADD_FASHION = "AddFashion";
const UPDATE_FASHION = "UpdateFashion";
const DELETE_FASHION = "DeleteFashion";

const FashionReducer = (state = initialState, action) => {
    const { type, payload } = action;
    let newFashions;
    switch (type) {
        case ALL_FASHIONS:
            return [...payload];
        case ADD_FASHION:
            return [...state, payload];
        case UPDATE_FASHION:
            newFashions = [...state].map((f) => {
                if (f._id === payload._id) {
                    return payload;
                } else {
                    return f;
                }
            });
            return newFashions;
        case DELETE_FASHION:
            newFashions = state.filter((f) => f._id != payload);
            return newFashions;
        default:
            return state;
    }
};

// ACTION
export const GetAllFashionsAction = (fashions) => async (dispatch) => {
    dispatch({ type: ALL_FASHIONS, payload: fashions });
};

export const AddFasionAction = (fashion) => async (dispatch) => {
    dispatch({ type: ADD_FASHION, payload: fashion });
};

export const UpdateFashionAction = (fashion) => async (dispatch) => {
    dispatch({ type: UPDATE_FASHION, payload: fashion });
};

export const DeleteFashionAction = (_id) => async (dispatch) => {
    dispatch({ type: DELETE_FASHION, payload: _id });
};

export default FashionReducer;

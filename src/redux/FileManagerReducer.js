const initialState = {
   files: [],
   parents: [],
};

const GET_FILES = "GetFiles";

const FileManagerReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case GET_FILES:
         return { ...payload };
      default:
         return state;
   }
};

// ACTION
export const GetFilesAction = (folderInfo) => async (dispatch) => {
   dispatch({ type: GET_FILES, payload: folderInfo });
};

// export const SetBreadCrumdAction = (breadcrumbs) => async (dispatch) => {
//    dispatch({ type: SET_BREADCRUMB, payload: breadcrumbs });
// };

export default FileManagerReducer;

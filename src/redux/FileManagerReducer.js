const initialState = {
   files: [],
   parents: [],
   uploading: [],
};

const GET_FILES = "GetFiles";
const ADD_FILE = "AddFile";
const DELETE_FILE = "DeleteFile";

const FileManagerReducer = (state = initialState, action) => {
   const { type, payload } = action;
   switch (type) {
      case GET_FILES:
         return { ...state, ...payload };
      case ADD_FILE:
         return { ...state, files: [payload, ...state.files] };
      case DELETE_FILE:
         return {
            ...state,
            files: state.files.filter((f) => f._id !== payload),
         };
      default:
         return state;
   }
};

// ACTION
export const GetFilesAction = (folderInfo) => async (dispatch) => {
   dispatch({ type: GET_FILES, payload: folderInfo });
};

export const AddFileAction = (file) => async (dispatch) => {
   dispatch({ type: ADD_FILE, payload: file });
};

export const DeleteFileAction = (id) => async (dispatch) => {
   dispatch({ type: DELETE_FILE, payload: id });
};

export default FileManagerReducer;

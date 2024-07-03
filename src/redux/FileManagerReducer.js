const initialState = {
   files: [],
   parents: [],
   uploading: [],
};

const GET_FILES = "GetFiles";
const ADD_FILE = "AddFile";
const DELETE_FILE = "DeleteFile";
const RENAME_FILE = "RenameFile";

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
      case RENAME_FILE:
         return {
            ...state,
            files: state.files.map((f) => {
               if (f._id === payload._id) {
                  return payload;
               } else {
                  return f;
               }
            }),
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

export const RenameFileAction = (data) => async (dispatch) => {
   dispatch({ type: RENAME_FILE, payload: data });
};
export default FileManagerReducer;

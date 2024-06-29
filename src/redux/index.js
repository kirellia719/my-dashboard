import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import FashionReducer from "./FashionReducer";
import HistoryReducer from "./HistoryReducer";
import AuthReducer from "./AuthReducer";
import FileManagerReducer from "./FileManagerReducer";

const rootReducers = combineReducers({
   Fashions: FashionReducer,
   Histories: HistoryReducer,
   Auth: AuthReducer,
   Files: FileManagerReducer,
});

const store = configureStore({
   reducer: rootReducers,
});

export default store;

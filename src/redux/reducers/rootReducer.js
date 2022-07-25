import { combineReducers } from "redux";
import calenderReducer from "./calendar/";
import emailReducer from "./email/";
import chatReducer from "./chat/";
import todoReducer from "./todo/";
import customizer from "./customizer/";
import auth from "./auth/";
import navbar from "./navbar/Index";
import dataList from "./data-list/";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  calendar: calenderReducer,
  emailApp: emailReducer,
  todoApp: todoReducer,
  chatApp: chatReducer,
  customizer: customizer,
  auth: auth,
  navbar: navbar,
  dataList: dataList,
});

export default persistReducer(persistConfig, rootReducer);

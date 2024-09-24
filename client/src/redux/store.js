import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice";
import carReducer from "./carSlice";
import adminReducer from "./adminSlice"

export const store = configureStore({
  reducer:{
    app : userReducer,
    car : carReducer,
    admin : adminReducer
  }
})

export default store;
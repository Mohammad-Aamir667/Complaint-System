import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import userComplaintReducer from "./userComplaintsSlice";
const appStore = configureStore({
  reducer:{
        user:userReducer,
        userComplaints:userComplaintReducer,
        

  },
});
export default appStore; 
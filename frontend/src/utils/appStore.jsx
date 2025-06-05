import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import userComplaintReducer from "./userComplaintsSlice";
import adminComplaintReducer from "./adminComplaintSlice";
import managerDataReducer from "./managerDataSlice";
import notificationReducer from "./notificationSlice"
const appStore = configureStore({
  reducer:{
        user:userReducer,
        userComplaints:userComplaintReducer,
        adminComplaints:adminComplaintReducer,
        managerData:managerDataReducer,
        notifications:notificationReducer
  },
});
export default appStore; 
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import userComplaintReducer from "./userComplaintsSlice";
import adminComplaintReducer from "./adminComplaintSlice";
import managerDataReducer from "./managerDataSlice";
import adminDataReducer from "./adminDataSlice";
import notificationReducer from "./notificationSlice"
import managerComplaintReducer from "./managerComplaintSlice";
import superAdminComplaintReducer from "./superAdminComplaintsSlice";
const appStore = configureStore({
  reducer:{
        user:userReducer,
        userComplaints:userComplaintReducer,
        adminComplaints:adminComplaintReducer,
        managerData:managerDataReducer,
        notifications:notificationReducer,
        managerComplaints:managerComplaintReducer,
        adminData:adminDataReducer,
        superAdminComplaints:superAdminComplaintReducer

  },
});
export default appStore; 
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import userComplaintReducer from "./userComplaintsSlice";
import adminComplaintReducer from "./adminComplaintSlice";
import managerDataReducer from "./managerDataSlice";
const appStore = configureStore({
  reducer:{
        user:userReducer,
        userComplaints:userComplaintReducer,
        adminComplaints:adminComplaintReducer,
        managerData:managerDataReducer,
  },
});
export default appStore; 
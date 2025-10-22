import { BrowserRouter, Route, Routes } from "react-router-dom"

import Body from "./components/Body"
import Login from "./components/Login"
import { Provider, useSelector } from "react-redux"
import appStore from "./utils/appStore"
import EmployeeDashboard from "./components/employee/EmployeeDashboard"
import ManagerDashboard from "./components/manager/ManagerDashboard"
import LodgeComplaint from "./components/employee/LodgeComplaint"
import Profile from "./components/profile/Profile"
import ProtectedRouteByRole from "./components/ProtectedRouteByRole"
import SuperAdminDashboard from "./components/superadmin/SuperAdminDashboard"
import AdminDashboard from "./components/admin/AdminDashboard"
import AssignManager from "./components/admin/AssignManager"
import ManagerData from "./components/common/ManagerData"
import AdminComplaint from "./components/admin/AdminComplaint"
import Notifications from "./components/Notifications"
import EscalateComplaint from "./components/admin/EscalateComplaint"
import ComplaintDetailsManager from "./components/manager/ComplaintDetailsManager"
import ManagerComplaint from "./components/manager/ManagerComplaint"
import AdminData from "./components/superadmin/AdminData"
import SuperAdminComplaints from "./components/superadmin/SuperAdminComplaints"
import SuperAdminComplaintDetails from "./components/superadmin/SuperAdminComplaintDetails"
import EmployeeData from "./components/common/EmployeeData"
import ResetPassword from "./components/ResetPassword"
import ForgetPassword from "./components/ForgetPasssword"
import InviteCodeGenerator from "./components/common/InviteCodeGenerator"
import EditProfile from "./components/profile/EditProfile"
function App() {
  return (
    <>
      <Provider store = {appStore}>
      <BrowserRouter basename="/">
      <Routes>
      <Route path ="/" element={<Body/>}>
      <Route path = "/login" element={<Login/>}></Route>
      <Route path="/employee/dashboard" element={<ProtectedRouteByRole allowedRoles={["employee"]}><EmployeeDashboard /></ProtectedRouteByRole>}/>
      <Route path="/manager/dashboard" element={<ProtectedRouteByRole allowedRoles={["manager"]}><ManagerDashboard /></ProtectedRouteByRole>}/>
      <Route path="/admin/dashboard" element={<ProtectedRouteByRole allowedRoles={["admin"]}><AdminDashboard /></ProtectedRouteByRole>}/>
      <Route path="/superadmin/dashboard" element={<ProtectedRouteByRole allowedRoles={["superadmin"]}><SuperAdminDashboard /></ProtectedRouteByRole>}/> 
      <Route path = "/employee/lodge-complaint" element={<LodgeComplaint/>}></Route>
      <Route path = "/profile" element = {<Profile/>}></Route>
      <Route path = "/profile/edit" element = {<EditProfile/>}></Route>
      <Route path = "/assign-manager/:_id" element = {<ProtectedRouteByRole allowedRoles={["admin"]}><AssignManager /></ProtectedRouteByRole>}></Route>
      <Route path = "/managers-stats" element = {<ProtectedRouteByRole allowedRoles={["admin","superadmin"]}><ManagerData /></ProtectedRouteByRole>}></Route>
      <Route path = "/admin/complaints" element = {<ProtectedRouteByRole allowedRoles={["admin"]}><AdminComplaint /></ProtectedRouteByRole>}></Route>
      <Route path = "/notifications" element = {<Notifications/>}></Route>
      <Route path = "/escalate/:complaintId" element = {<ProtectedRouteByRole allowedRoles={["admin"]}><EscalateComplaint /></ProtectedRouteByRole>}></Route>
      <Route path = "/manager/complaints" element = {<ProtectedRouteByRole allowedRoles={["manager"]}><ManagerComplaint /></ProtectedRouteByRole>}></Route> 
      <Route path = "/manager/complaint/:_id" element = {<ProtectedRouteByRole allowedRoles={["manager"]}><ComplaintDetailsManager /></ProtectedRouteByRole>}></Route>
      <Route path = "/superadmin/admins" element = {<ProtectedRouteByRole allowedRoles={["superadmin"]}><AdminData /></ProtectedRouteByRole>}></Route>
      <Route path = "/superadmin/complaints" element = {<ProtectedRouteByRole allowedRoles={["superadmin"]}><SuperAdminComplaints /></ProtectedRouteByRole>}></Route>
      <Route path = "/superadmin/complaint/:_id" element = {<ProtectedRouteByRole allowedRoles={["superadmin"]}><SuperAdminComplaintDetails /></ProtectedRouteByRole>}></Route>
      <Route path = "/employees-stats" element = {<ProtectedRouteByRole allowedRoles={["superadmin","admin","manager"]}><EmployeeData /></ProtectedRouteByRole>}></Route>
      <Route path = "/reset-password" element={<ResetPassword/>}></Route>
      <Route path = "/forgot-password" element={<ForgetPassword/>}></Route>
      <Route path = "/invite/code-generate" element = {<ProtectedRouteByRole allowedRoles={["superadmin","admin"]}><InviteCodeGenerator /></ProtectedRouteByRole>}></Route>

      </Route>
      </Routes>
      </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

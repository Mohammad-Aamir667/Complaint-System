import { BrowserRouter, Route, Routes } from "react-router-dom"

import Body from "./components/Body"
import Login from "./components/Login"
import { Provider, useSelector } from "react-redux"
import appStore from "./utils/appStore"
import EmployeeDashboard from "./components/Employee/EmployeeDashboard"
import ManagerDashboard from "./components/manager/ManagerDashboard"
import LodgeComplaint from "./components/employee/LodgeComplaint"
import Profile from "./components/Profile"
import ProtectedRouteByRole from "./components/ProtectedRouteByRole"
import SuperAdminDashboard from "./components/superadmin/SuperAdminDashboard"
import AdminDashboard from "./components/admin/AdminDashboard"
import EditProfile from "./components/EditProfile"
import AssignManager from "./components/admin/AssignManager"

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
      </Route>
      </Routes>
      </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

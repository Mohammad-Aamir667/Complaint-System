import { BrowserRouter, Route, Routes } from "react-router-dom"

import Body from "./components/Body"
import Login from "./components/Login"
import { Provider } from "react-redux"
import appStore from "./utils/appStore"
import EmployeeDashboard from "./components/Employee/EmployeeDashboard"
import ManagerDashboard from "./components/manager/ManagerDashboard"
import LodgeComplaint from "./components/employee/LodgeComplaint"

function App() {
  
  return (
    <>
     <Provider store = {appStore}>
     <BrowserRouter basename="/">
     <Routes>
    
  
      <Route path ="/" element={<Body/>}>
      <Route path = "/login" element={<Login/>}></Route>
      <Route path = "/employee/dashboard" element={<EmployeeDashboard/>}></Route>
      <Route path = "/manager/dashboard" element={<ManagerDashboard/>}></Route>
      <Route path = "/employee/lodge-complaint" element={<LodgeComplaint/>}></Route>
      </Route>
     </Routes>
      </BrowserRouter>
      </Provider>
    </>
  )
}

export default App

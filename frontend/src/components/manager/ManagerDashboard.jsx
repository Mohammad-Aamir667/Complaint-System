"use client"

import { useEffect, useState } from "react"
import {
  BarChart3,
  Bell,
  FileText,
  Home,
  MessageSquare,
  Plus,
  Search,
  User,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Settings,
  Menu,
  X,
 
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { removeUser } from "@/utils/userSlice"
import { BASE_URL } from "@/utils/constants"
import axios from "axios"
import { addManagerComplaint } from "@/utils/managerComplaintSlice"
import ManagerComplaint from "./ManagerComplaint"

const menuItems = [
  { title: "Dashboard", icon: Home, isActive: true ,path: "/manager/dashboard"},
  { title: "My Complaints", icon: FileText , path: "/manager/complaints"},
   { title: "Analytics", icon: BarChart3 , path: "/analytics"},
  { title: "Profile", icon: User ,path: "/profile"},
]

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true })
      dispatch(removeUser())
       
      navigate("/login")
    } catch (err) {
     console.error("Logout error:", err)
    }
  }
 return <>
    {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-sm">Manager Portal</div>
            <div className="text-xs text-gray-500">Complaint Management</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Navigation</h4>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <nav className="space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4" />
            Settings
          </a>
          <button
  onClick={handleLogout}
  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
>
  <LogOut className="h-4 w-4" />
  Logout
</button>
        </nav>
      </div>
    </div>
  </>
}




const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const user = useSelector((store) => store.user);
  const complaints = useSelector((store) => store.managerComplaints);
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  

  const stats = {
    total: complaints.length,
    new: complaints.filter((c) => c.status === "New").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
    overdue: complaints.filter((c) => new Date(c.dueDate) < new Date() && c.status !== "Resolved").length,
  }
  const fetchComplaints = async () =>{
    try{
      const res =  await axios.get (BASE_URL + "/manager/complaints", {withCredentials: true});
        dispatch(addManagerComplaint(res.data));
    }
    catch(err){
            console.error("Error fetching complaints:", err);
    }
  }
  const handleProfile = () => {
    navigate("/profile");
     }
  useEffect(()=>{
      fetchComplaints();
    
   },[])
  const resolutionRate = Math.round((stats.resolved / stats.total) * 100)
  const workload = stats.total - stats.resolved

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search complaints..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar onClick = {handleProfile} size="sm">
                <AvatarImage src={user?.photoUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {user?.firstName[0]}
                  {user?.lastName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
              <p className="text-gray-600 mt-1">Manage your assigned complaints and track team performance</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assigned</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
              </CardContent>
            </Card>

          

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                  </div>
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <AlertCircle className="h-6 w-6 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </CardContent>
            </Card>

         
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>My Performance</CardTitle>
                <CardDescription>Your complaint resolution metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Resolution Rate</span>
                      <span className="text-2xl font-bold">{resolutionRate}%</span>
                    </div>
                    <Progress value={resolutionRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Current Workload</span>
                      <span className="text-lg font-semibold">{workload} active</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Average resolution time</span>
                      <span>2.3 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates on your complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">CMP-005 marked as resolved</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">Started work on CMP-001</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">CMP-003 escalated to you</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          
          <ManagerComplaint/>
        </main>
      </div>
    </div>
  )
}

export default ManagerDashboard

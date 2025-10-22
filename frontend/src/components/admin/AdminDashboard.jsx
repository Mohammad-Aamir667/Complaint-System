"use client"

import { useEffect, useState } from "react"
import {
  BarChart3, Bell, FileText, Home, MessageSquare, Search, TrendingUp, User, LogOut, Clock, CheckCircle, AlertCircle, XCircle, Settings, Menu,
  X,
  Users,
  ArrowUpCircle,
} from "lucide-react"
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "@/utils/constants"
import { addAdminComplaint, removeAdminComplaint } from "@/utils/adminComplaintSlice"
import { addManagerData, removeManagerData } from "@/utils/managerDataSlice"
import { useNavigate } from "react-router-dom"
import { removeUser } from "@/utils/userSlice"
import AdminComplaint from "./AdminComplaint";
import { addNotifications } from "@/utils/notificationSlice";



const menuItems = [
  { title: "Dashboard", icon: Home, path: "/admin/dashboard" },
  { title: "All Complaints", icon: FileText, path: "/admin/complaints" },
  { title: "Managers", icon: Users, path: "/managers-stats" },
  { title: "Employees", icon: Users, path: "/employees-stats" },
  { title: "Generate Code", icon: BarChart3, path: "/invite/code-generate" },
  { title: "Profile", icon: User, path: "/profile" },



];

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true })
      dispatch(removeUser())
      dispatch(removeAdminComplaint())
      dispatch(removeManagerData())
      navigate("/login")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }
  return <>
    {isOpen && <div className="fixed inset-0  bg-opacity-50 z-40 lg:hidden" onClick={onClose} ></div>}
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-sm">Admin Portal</div>
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
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
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

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const mockAdmin = user || mockAdmin;
  const adcomplaints = useSelector((store) => store.adminComplaints);
  const managers = useSelector((store) => store.managerData);
  const navigate = useNavigate()
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(BASE_URL + "/admin/complaints", { withCredentials: true });
      dispatch(addAdminComplaint(res.data));
    }
    catch (err) {
      console.error("Error fetching complaints:", err);
    }
  }
  const fetchManagers = async () => {
    try {
      const res = await axios.get(BASE_URL + "/managers/complaint-stats", { withCredentials: true });
      dispatch(addManagerData(res.data));
      console.log("Fetched managers:", res.data);

    }
    catch (err) {
      console.error("Error fetching managers:", err);
    }
  }
  const notifications = useSelector((store) => store.notifications)
  const getNotifications = async () => {
    try {
      const res = await axios.get(BASE_URL + "/notifications", { withCredentials: true });
      dispatch(addNotifications(res.data));
    }
    catch (err) {

    }
  }
  const handleNotifications = () => {
    navigate("/notifications");
  }
  const notificationCount = notifications?.filter((n) => n.isRead === false).length;
  useEffect(() => {
    fetchComplaints();
    fetchManagers();
    getNotifications();
  }, [])
  const handleProfile = () => {
    navigate("/profile");
  }
  let recentAdminComplaint;
  if (adcomplaints) {
    recentAdminComplaint = [...adcomplaints]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3);
  }


  const stats = {
    total: adcomplaints?.length,
    pending: adcomplaints?.filter((c) => c.status === "pending").length,
    inProgress: adcomplaints?.filter((c) => c.status === "in progress").length,
    resolved: adcomplaints?.filter((c) => c.status === "resolved").length,
    escalated: adcomplaints?.filter((c) => c.escalated === true).length,
  }
  const getTimeDifference = (updatedAt) => {
    const now = new Date();
    const updatedTime = new Date(updatedAt);
    const diffInMs = now - updatedTime;

    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  }


  const resolutionRate = Math.round((stats.resolved / stats.total) * 100)
  if (user.status !== "active") {
    navigate("/login")
  }
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

              <Button onClick={handleNotifications} variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
              <Avatar onClick={handleProfile} size="sm">
                <AvatarImage src={mockAdmin.photoUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {mockAdmin.firstName[0]}
                  {mockAdmin.lastName[0]}
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
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mockAdmin.firstName}!</h1>
              <p className="text-gray-600 mt-1">Manage complaints and oversee resolution progress</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total</p>
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
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Escalated</p>
                    <p className="text-2xl font-bold text-red-600">{stats.escalated}</p>
                  </div>
                  <ArrowUpCircle className="h-6 w-6 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Resolution Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Resolution Rate</CardTitle>
                <CardDescription>Overall complaint resolution performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{resolutionRate}%</span>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <Progress value={resolutionRate} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {stats.resolved} of {stats.total} complaints resolved
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Manager Workload */}
            <Card>
              <CardHeader>
                <CardTitle>Manager Workload</CardTitle>
                <CardDescription>Active complaints per manager</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {managers?.slice(0, 3).map((manager) => (
                    <div key={manager._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{manager.firstName} {manager.lastName}</p>
                        <p className="text-xs text-gray-500">{manager.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest complaint updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentAdminComplaint?.map((complaint) => (
                    <div key={complaint?.complaintId}>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm font-medium">{complaint?.complaintId} assigned to {complaint?.assignedManager?.firstName} {complaint?.assignedManager?.lastName}</p>
                          <p className="text-xs text-gray-500">{getTimeDifference(complaint?.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <AdminComplaint />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

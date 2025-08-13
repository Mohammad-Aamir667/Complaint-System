"use client"

import { useState, useMemo, useEffect } from "react"
import {
  BarChart3,
  Bell,
  FileText,
  Home,
  MessageSquare,
  Search,
  TrendingUp,
  User,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Menu,
  X,
  Users,
  ArrowUpCircle,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useDispatch, useSelector } from "react-redux"
import { addManagerData } from "@/utils/managerDataSlice"
import axios from "axios"
import { BASE_URL } from "@/utils/constants"
import CriticalComplaintsPreview from "./CriticalComplaintsPreview"
import EscalatedComplaintsPreview from "./EscalatedComplaintsPreview"
import { addSuperAdminComplaint, removeSuperAdminComplaint } from "@/utils/superAdminComplaintsSlice"
import { removeUser } from "@/utils/userSlice"
import { addNotifications } from "@/utils/notificationSlice"

const Sidebar = ({ isOpen, onClose }) => {
    const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true })
      dispatch(removeUser())
       dispatch(removeSuperAdminComplaint())
      navigate("/login")
    } catch (err) {
     console.error("Logout error:", err)
    }
  }
  const menuItems = [
    { title: "Dashboard", icon: Home, path: "/superadmin/dashboard" },
    { title: "Profile", icon: User, path: "/profile" },
    { title: "Admins", icon: User, path: "/superadmin/admins" },
    { title: "Managers", icon: Users, path: "/managers-stats" },
    { title: "Employees", icon: Users, path: "/employees-stats" },
    { title: "All Complaints", icon: FileText, path: "/superadmin/complaints" },
    { title: "Generate Code", icon: BarChart3, path: "/invite/code-generate" },
    { title: "Audit Logs", icon: Clock, path: "/superadmin/logs" },
  ]

  return (
    <>
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
              <div className="font-semibold text-sm">SuperAdmin Portal</div>
              <div className="text-xs text-gray-500">Platform Management</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Navigation</h4>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.title}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100"
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200 mt-auto">
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
  )
}

export default function SuperAdminDashboardRectified() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const complaints = useSelector((store) => store.superAdminComplaints)
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(BASE_URL + "/superadmin/complaints", { withCredentials: true })
      dispatch(addSuperAdminComplaint(res.data))
    } catch (err) {
      console.error("Error fetching complaints:", err)
    }
  }

 

  useEffect(() => {
    if (complaints?.length === 0) fetchComplaints()
  }, [])

  const initialManagers = [
    { _id: "m1", firstName: "John", lastName: "Doe", department: "IT", activeComplaints: 8 },
    { _id: "m2", firstName: "Sarah", lastName: "Smith", department: "Maintenance", activeComplaints: 12 },
    { _id: "m3", firstName: "Ali", lastName: "Hussain", department: "Customer Support", activeComplaints: 4 },
  ]

  const initialAdmins = [
    { _id: "a1", name: "Ritu Singh", email: "ritu@org1.com", org: "Org 1", status: "active" },
    { _id: "a2", name: "Vikram Patel", email: "vikram@org2.com", org: "Org 2", status: "active" },
    { _id: "a3", name: "Megha Rao", email: "megha@org3.com", org: "Org 3", status: "suspended" },
  ]

  const [managers, setManagers] = useState(initialManagers)
  const [admins, setAdmins] = useState(initialAdmins)

  // UI state
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("overview") // overview, critical, escalated, admins, managers, complaints
  const [filterStatus, setFilterStatus] = useState("all")

  const stats = useMemo(() => {
    const total = complaints?.length
    const pending = complaints?.filter((c) => c.status === "pending").length
    const inProgress = complaints?.filter((c) => c.status === "in progress").length
    const resolved = complaints?.filter((c) => c.status === "resolved").length
    const escalated = complaints?.filter((c) => c.escalated).length
    const critical = complaints?.filter((c) => c.priority === "critical").length
    return { total, pending, inProgress, resolved, escalated, critical }
  }, [complaints])

  const criticalComplaints = complaints?.filter((c) => c.critical === true)
  const escalatedComplaints = complaints?.filter((c) => c.escalated)
  const filteredComplaints = complaints?.filter((c) => {
      if (filterStatus === "all") return true
      return c.status === filterStatus
    })
    .filter((c) => {
      if (!search) return true
      const s = search.toLowerCase()
      return (
        c._id.toLowerCase().includes(s) || c.title.toLowerCase().includes(s) || c.organization.toLowerCase().includes(s)
      )
    })

  const toggleSuspendAdmin = (adminId) => {
    setAdmins((prev) =>
      prev.map((a) => (a._id === adminId ? { ...a, status: a.status === "active" ? "suspended" : "active" } : a)),
    )
  }

  const fetchManagers = async () => {
    try {
      const res = await axios.get(BASE_URL + "/managers/complaint-stats", { withCredentials: true })
      dispatch(addManagerData(res.data))
      console.log("Fetched managers:", res.data)
    } catch (err) {
      console.error("Error fetching managers:", err)
    }
  }
    const notifications = useSelector((store)=>store.notifications)
  const getNotifications = async ()=>{
     try{
            const res = await axios.get(BASE_URL+ "/notifications",{withCredentials:true});
            dispatch(addNotifications(res.data));
     }
     catch(err){

     }
  }
     const handleNotifications = ()=>{
        navigate("/notifications");
   }
  const notificationCount = notifications?.filter((n)=>n.isRead === false).length;
  useEffect(()=>{
       getNotifications();
 },[])
  useEffect(() => {
    fetchManagers()
  }, [])

  const handleCriticalComplaints = () => {
    navigate("/superadmin/complaints")
  }

  const handleProfile = () => {
    navigate("/profile")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search complaints, org or id..."
                  className="pl-10 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
             <Button onClick = {handleNotifications} variant="outline" size="icon" className="relative">
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
              <Avatar onClick={handleProfile} className="cursor-pointer">
                <AvatarImage src={user.photoUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {user.firstName[0].toUpperCase()}
                  {user.lastName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 space-y-6">
          {/* Top: welcome + global stats */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                Welcome back, {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()}!
              </h1>
              <p className="text-gray-600 mt-1">Platform overview & urgent actions</p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Button
                variant={tab === "overview" ? "default" : "ghost"}
                onClick={() => setTab("overview")}
                className="whitespace-nowrap flex-shrink-0"
              >
                Overview
              </Button>
              <Button variant="ghost" onClick={handleCriticalComplaints} className="whitespace-nowrap flex-shrink-0">
                Critical
              </Button>
              <Button
                variant={tab === "critical" ? "default" : "ghost"}
                onClick={() => setTab("critical")}
                className="whitespace-nowrap flex-shrink-0"
              >
                Escalated
              </Button>
              <Button
                variant={tab === "admins" ? "default" : "ghost"}
                onClick={() => setTab("admins")}
                className="whitespace-nowrap flex-shrink-0"
              >
                Admins
              </Button>
              <Button
                variant={tab === "managers" ? "default" : "ghost"}
                onClick={() => setTab("managers")}
                className="whitespace-nowrap flex-shrink-0"
              >
                Managers
              </Button>
              <Button
                variant={tab === "complaints" ? "default" : "ghost"}
                onClick={() => setTab("complaints")}
                className="whitespace-nowrap flex-shrink-0"
              >
                All Complaints
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-6 w-6 text-gray-400 flex-shrink-0" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Clock className="h-6 w-6 text-blue-400 flex-shrink-0" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Escalated</p>
                  <p className="text-2xl font-bold text-red-600">{stats.escalated}</p>
                </div>
                <ArrowUpCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
                </div>
                <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {/* Critical and Escalated Complaints */}
            <div className="space-y-6 lg:col-span-1">
              <CriticalComplaintsPreview />
              <EscalatedComplaintsPreview />
            </div>

            {/* Additional content area - now properly positioned */}
            <div className="lg:col-span-1 xl:col-span-2">
              {/* This area can be used for additional dashboard content */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest platform updates and actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">System maintenance completed</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">New admin registered</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Critical complaint escalated</p>
                        <p className="text-xs text-gray-500">6 hours ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Resolution Rate</CardTitle>
                <CardDescription>Platform wide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {Math.round((stats.resolved / Math.max(stats.total, 1)) * 100)}%
                    </span>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <Progress value={Math.round((stats.resolved / Math.max(stats.total, 1)) * 100)} className="h-2" />
                  <p className="text-sm text-gray-600">
                    {stats.resolved} of {stats.total} complaints resolved
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time</CardTitle>
                <CardDescription>Average first response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">2.4h</span>
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-gray-600">25% faster than last month</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Active Managers</CardTitle>
                <CardDescription>Currently handling complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{managers.length}</span>
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-sm text-gray-600">All departments covered</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

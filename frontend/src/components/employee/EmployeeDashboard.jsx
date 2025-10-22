"use client"

import { useEffect, useState } from "react"
import { BarChart3, Bell, FileText, Home, MessageSquare, Plus, Search, TrendingUp, User, LogOut, Clock, CheckCircle, AlertCircle, XCircle, Settings, Menu, X, } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "../../utils/constants"
import { addUserComplaint, removeUserComplaint } from "../../utils/userComplaintsSlice"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { removeUser } from "@/utils/userSlice"

const menuItems = [
  { title: "Dashboard", navigate: "/employee/dashboard", icon: Home, isActive: true },
  { title: "Profile", navigate: "/profile", icon: User },
  { title: "Lodge Complaint", navigate: "/employee/lodge-complaint", icon: Plus },
  { title: "Status of Complaints", navigate: "#", icon: FileText },
  { title: "Statistics", navigate: "#", icon: BarChart3 },
]

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true })
      dispatch(removeUser())
      dispatch(removeUserComplaint())
      navigate("/login")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }
  return (<>
    {/* Mobile overlay */}
    {isOpen && <div className="fixed inset-0  bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

    {/* Sidebar */}
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <div className="font-semibold text-sm">Complaint Portal</div>
            <div className="text-xs text-gray-500">Employee Dashboard</div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Navigation</h4>
          <nav className="space-y-1">
            {menuItems.map((item) => (

              <Link
                key={item.title}
                to={`${item?.navigate}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${item.isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
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
  )
}

const getStatusIcon = (status) => {
  switch (status) {
    case "resolved":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "in progress":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    default:
      return <XCircle className="h-4 w-4 text-red-600" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "resolved":
      return "bg-green-100 text-green-800"
    case "in progress":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    default:
      return "bg-red-100 text-red-800"
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const EmployeeDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const dispatch = useDispatch();
  const userComplaints = useSelector((store) => store.userComplaints);
  const user = useSelector((store) => store?.user);
  const navigate = useNavigate();
  const formattedDate = (createdAt) => {
    const date = new Date(createdAt);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    return date.toLocaleDateString('en-US', options) || ""; // Fallback if date is invalid

  }
  const getUserComplaints = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/complaints", { withCredentials: true });
      dispatch(addUserComplaint(res.data))
    }
    catch (err) {
      console.error("Error fetching complaints:", err);
    }
  }
  const handleLodgeComplaint = () => {
    navigate("/employee/lodge-complaint");
  }
  const handleProfile = () => {
    navigate("/profile");
  }


  useEffect(() => {
    if (userComplaints?.length > 0) return; // Avoid fetching if already loaded
    getUserComplaints();
  }, [])
  const totalComplaints = userComplaints?.length;
  const resolvedComplaints = userComplaints?.filter((c) => c.status === "resolved")?.length
  const pendingComplaints = userComplaints?.filter((c) => c.status === "pending")?.length
  const resolutionRate = Math.round((resolvedComplaints / totalComplaints) * 100)
  if (user.status !== "active") {
    navigate("/login")
  }
  return user?.status === "active" && (
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
                <Input type="search" placeholder="Search complaints..." className="pl-10" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar onClick={handleProfile} className="h-8 w-8">
                <AvatarImage src={user?.photoUrl || "/placeholder.svg"}
                  alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback>
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
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
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName} {user?.lastName}!
              </h1>
              <p className="text-gray-600 mt-1">Here's an overview of your complaint management dashboard</p>
            </div>
            <Button onClick={handleLodgeComplaint}>
              <Plus className="mr-2 h-4 w-4" />
              Lodge New Complaint
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                    <p className="text-2xl font-bold text-gray-900">{totalComplaints}</p>
                    <p className="text-xs text-gray-500 mt-1">+2 from last month</p>
                  </div>
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{resolvedComplaints}</p>
                    <p className="text-xs text-gray-500 mt-1">+1 from last week</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingComplaints}</p>
                    <p className="text-xs text-gray-500 mt-1">-1 from last week</p>
                  </div>
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{resolutionRate}%</p>
                    <Progress value={resolutionRate} className="mt-2" />
                  </div>
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoUrl || "/placeholder.svg"}
                        alt={`${user?.firstName} ${user?.lastName}`} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{user?.role}</p>
                      {/* <Badge variant="secondary">{user?.status}</Badge> */}
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{user?.emailId}</span>
                    </div>
                    {user?.department && (<div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{user?.department}</span>  </div>)}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joining Date:</span>
                      <span className="font-medium">{user?.joiningDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{user?.gender?.charAt(0).toUpperCase() + user?.gender?.slice(1).toLowerCase()}</span>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Complaints */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Complaints</CardTitle>
                <CardDescription>Your latest complaint submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userComplaints?.slice(0, 3).map((complaint) => (
                    <div
                      key={complaint._id}
                      className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-shrink-0">{getStatusIcon(complaint.status)}</div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{complaint.title}</p>
                        <p className="text-xs text-gray-500">
                          {complaint.complaintId} • {formattedDate(complaint.createdAt)}
                        </p>
                      </div>
                      <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>All Complaints</CardTitle>
              <CardDescription>Complete list of your submitted complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userComplaints?.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell className="font-medium">{complaint?.complaintId}</TableCell>
                      <TableCell>{complaint.title}</TableCell>
                      <TableCell>{complaint.category}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <span className="text-sm">{complaint.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formattedDate(complaint.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default EmployeeDashboard

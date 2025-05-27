"use client"

import { useEffect, useState } from "react"
import { BarChart3,Bell, FileText, Home, MessageSquare, Plus, Search, TrendingUp, User, LogOut, Clock,CheckCircle,  AlertCircle,XCircle,Settings,Menu,X,} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "../../utils/constants"
import { addUserComplaint } from "../../utils/userComplaintsSlice"
import { Link, useNavigate } from "react-router-dom"




const menuItems = [
  { title: "Dashboard", nagivate:"/employee/dashboard", icon: Home, isActive: true },
  { title: "Profile",nagivate:"/profile", icon: User },
  { title: "Lodge Complaint",navigate:"/employee/lodge-complaint", icon: Plus },
  { title: "Status of Complaints",navigate:"#", icon: FileText },
  { title: "Statistics", navigate:"#",icon: BarChart3 },
]

const Avatar = ({ children, className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-lg",
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold ${className}`}
    >
      {children}
    </div>
  )
}

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    secondary: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>{children}</div>
)

const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>{children}</div>
)

const CardContent = ({ children, className = "" }) => <div className={`px-6 py-4 ${className}`}>{children}</div>

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>
)

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 mt-1 ${className}`}>{children}</p>
)

const Button = ({ children, variant = "primary", size = "md", className = "", onClick, ...props }) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
    ghost: "hover:bg-gray-100 text-gray-700",
  }

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "p-2",
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Progress = ({ value = 0, className = "" }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

const Table = ({ children, className = "" }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full divide-y divide-gray-200 ${className}`}>{children}</table>
  </div>
)

const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>

const TableBody = ({ children }) => <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>

const TableRow = ({ children, className = "" }) => <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>

const TableHead = ({ children, className = "" }) => (
  <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
    {children}
  </th>
)

const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>{children}</td>
)

const Sidebar = ({ isOpen, onClose }) => (
  <>
    {/* Mobile overlay */}
    {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

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
               
                to={`${item.navigate}`}
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
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </a>
        </nav>
      </div>
    </div>
  </>
)

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
   const user = useSelector((store) => store.user);
   const navigate = useNavigate();
   const formattedDate = (createdAt)=>{
    const date = new Date(createdAt);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };

   return date.toLocaleDateString('en-US', options) || ""; // Fallback if date is invalid

   }
  const getUserComplaints = async()=>{
             try{
             const res = await axios.get(BASE_URL+"/user/complaints",{withCredentials:true});
               dispatch(addUserComplaint(res.data))
             }
             catch(err){
                console.error("Error fetching complaints:", err);
             }
  }
  //const totalComplaints
  const handleLodgeComplaint = () => {
    navigate("/employee/lodge-complaint");
     }
  useEffect(()=>{
    getUserComplaints();
  },[])
  const totalComplaints = userComplaints?.length;
  const resolvedComplaints = userComplaints.filter((c) => c.status === "resolved").length
  const pendingComplaints = userComplaints.filter((c) => c.status !== "resolved").length
  const resolutionRate = Math.round((resolvedComplaints / totalComplaints) * 100)

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
                <Input type="search" placeholder="Search complaints..." className="pl-10" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar size="sm">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
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
            <Button onClick = {handleLodgeComplaint }>
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
                    <Avatar size="lg">
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{user?.role}</p>
                      <Badge variant="secondary">{user?.status}</Badge>
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{user?.emailId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium">{user?.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joining Date:</span>
                      <span className="font-medium">{user?.joiningDate}</span>
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
                      key={complaint.id}
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
                  {userComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
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

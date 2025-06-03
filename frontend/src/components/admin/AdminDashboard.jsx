"use client"

import { useEffect, useState } from "react"
import { BarChart3,Bell,FileText, Home,MessageSquare,Plus,  Search, TrendingUp,User,LogOut,Clock, CheckCircle, AlertCircle,XCircle,Settings, Menu,
  X,
  Users,
  MoreHorizontal,
  ArrowUpCircle,
  UserCheck,
  Eye,
  Edit,
  AlertTriangle,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "@/utils/constants"
import { addAdminComplaint, removeAdminComplaint } from "@/utils/adminComplaintSlice"
import { addManagerData, removeManagerData } from "@/utils/managerDataSlice"
import { useNavigate } from "react-router-dom"
import { removeUser } from "@/utils/userSlice"



const menuItems = [
  { title: "Dashboard", icon: Home, isActive: true },
  { title: "All Complaints", icon: FileText },
  { title: "Managers", icon: Users },
  { title: "Analytics", icon: BarChart3 },
  { title: "Profile", icon: User },
]

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
            {menuItems.map((item) => (
              <a
                key={item.title}
                href="#"
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.isActive ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </a>
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

const getStatusIcon = (status) => {
  switch (status) {
    case "Resolved":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "In Progress":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "Pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    case "Escalated":
      return <ArrowUpCircle className="h-4 w-4 text-red-600" />
    case "New":
      return <XCircle className="h-4 w-4 text-gray-600" />
    default:
      return <XCircle className="h-4 w-4 text-gray-600" />
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800"
    case "In Progress":
      return "bg-blue-100 text-blue-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Escalated":
      return "bg-red-100 text-red-800"
    case "New":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Critical":
      return "bg-red-100 text-red-800"
    case "High":
      return "bg-orange-100 text-orange-800"
    case "Medium":
      return "bg-yellow-100 text-yellow-800"
    case "Low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// const AssignManagerDialog = ({ complaint, managers, onAssign }) => {
//   const [selectedManager, setSelectedManager] = useState("")
//   const [notes, setNotes] = useState("")

//   const handleAssign = () => {
//     if (selectedManager) {
//       onAssign(complaint.id, selectedManager, notes)
//       setSelectedManager("")
//       setNotes("")
//     }
//   }

//   const departmentManagers = managers.filter((m) => m.department === complaint.category)

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" size="sm">
//           <UserCheck className="h-4 w-4 mr-1" />
//           Assign
//         </Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Assign Manager</DialogTitle>
//           <DialogDescription>Assign a manager to handle complaint: {complaint.title}</DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="manager">Select Manager</Label>
//             <Select value={selectedManager} onValueChange={setSelectedManager}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose a manager" />
//               </SelectTrigger>
//               <SelectContent>
//                 {departmentManagers.map((manager) => (
//                   <SelectItem key={manager.id} value={manager.name}>
//                     {manager.name} - {manager.department} ({manager.complaints} active)
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label htmlFor="notes">Assignment Notes (Optional)</Label>
//             <Textarea
//               id="notes"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               placeholder="Add any special instructions or notes..."
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline">Cancel</Button>
//           <Button onClick={handleAssign} disabled={!selectedManager}>
//             Assign Manager
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const nagivate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const mockAdmin = user || mockAdmin; // Use user from Redux or fallback to mock data
  const adcomplaints = useSelector((store) => store.adminComplaints);
  const managers = useSelector((store) => store.managerData);
  const fetchComplaints = async () =>{
    try{
      const res =  await axios.get (BASE_URL + "/admin/complaints", {withCredentials: true});
        dispatch(addAdminComplaint(res.data));
    }
    catch(err){
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
 useEffect(()=>{

    fetchComplaints();
    fetchManagers();
 },[])
  const handleAssignManager = (complaint) => {
    const selectedManagers = managers.filter((manager) => manager.department === complaint.category);
    nagivate(`/assign-manager/${complaint._id}`,{state:  {  selectedManagers,complaint} } );
  }



  const stats = {
    total: adcomplaints?.length,
    new: adcomplaints?.filter((c) => c.status === "New").length,
    pending: adcomplaints?.filter((c) => c.status === "Pending").length,
    inProgress: adcomplaints?.filter((c) => c.status === "In Progress").length,
    resolved: adcomplaints?.filter((c) => c.status === "Resolved").length,
    escalated: adcomplaints?.filter((c) => c.status === "Escalated").length,
  }

  const resolutionRate = Math.round((stats.resolved / stats.total) * 100)

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
              <Avatar size="sm">
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Report
            </Button>
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
                    <p className="text-sm font-medium text-gray-600">New</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
                  </div>
                  <XCircle className="h-6 w-6 text-gray-400" />
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
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">CMP-002 assigned to John Smith</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">CMP-004 marked as resolved</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium">CMP-005 escalated</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complaints Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Complaints</CardTitle>
                  <CardDescription>Manage and assign complaints to managers</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="escalated">Escalated</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Manager</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adcomplaints?.map((complaint) => (
                    <TableRow key={complaint._id}>
                      <TableCell className="font-medium">{complaint.complaintId}</TableCell>
                      <TableCell>
                        <div className="max-w-48">
                          <p className="font-medium truncate">{complaint.title}</p>
                          {complaint.escalated && (
                            <Badge variant="destructive" className="mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Escalated
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{complaint?.createdBy?.firstName + " " +complaint?.createdBy?.lastName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{complaint.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {complaint?.priority }
                         
                     
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {complaint?.assignedManager ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {complaint.assignedManager?.firstName[0]
                                }{complaint.assignedManager?.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{complaint.assignedManager?.firstName} {complaint.assignedManager?.lastName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>{complaint.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!complaint?.assignedManager && (
                             <Button onClick = {()=>{handleAssignManager(complaint)}} variant="outline" size="sm"> <UserCheck className="h-4 w-4 mr-1" /> 
                              Assign
                            </Button>
                             
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick = {()=>{handleAssignManager(complaint)}}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <ArrowUpCircle className="mr-2 h-4 w-4" />
                                Escalate
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
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

export default AdminDashboard

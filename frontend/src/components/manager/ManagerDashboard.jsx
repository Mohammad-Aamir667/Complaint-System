"use client"

import { useState } from "react"
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
  Users,
  MoreHorizontal,
  ArrowUpCircle,
  Eye,
  Edit,
  AlertTriangle,
  PlayCircle,
  CheckCircle2,
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

// Sample data for manager
const mockManager = {
  firstName: "Michael",
  lastName: "Johnson",
  emailId: "michael.johnson@company.com",
  role: "manager",
  department: "IT",
  photoUrl: "/placeholder.svg",
}

const mockTeamMembers = [
  { id: 1, name: "Sarah Wilson", role: "Senior Developer", email: "sarah.wilson@company.com", complaints: 3 },
  { id: 2, name: "David Chen", role: "System Administrator", email: "david.chen@company.com", complaints: 1 },
  { id: 3, name: "Emma Rodriguez", role: "UI/UX Designer", email: "emma.rodriguez@company.com", complaints: 2 },
  { id: 4, name: "James Thompson", role: "DevOps Engineer", email: "james.thompson@company.com", complaints: 0 },
]

const mockComplaints = [
  {
    id: "CMP-001",
    title: "Network connectivity issues in Building A",
    category: "IT",
    priority: "High",
    status: "In Progress",
    employee: "Alice Johnson",
    assignedDate: "2024-01-15",
    dueDate: "2024-01-20",
    description: "Frequent disconnections affecting productivity",
    escalated: false,
    timeSpent: "4h 30m",
  },
  {
    id: "CMP-002",
    title: "Software license renewal required",
    category: "IT",
    priority: "Medium",
    status: "Pending",
    employee: "Bob Wilson",
    assignedDate: "2024-01-14",
    dueDate: "2024-01-25",
    description: "Adobe Creative Suite licenses expiring soon",
    escalated: false,
    timeSpent: "1h 15m",
  },
  {
    id: "CMP-003",
    title: "Email server performance issues",
    category: "IT",
    priority: "Critical",
    status: "New",
    employee: "Carol Davis",
    assignedDate: "2024-01-16",
    dueDate: "2024-01-18",
    description: "Email delays and server timeouts reported",
    escalated: true,
    timeSpent: "0h 0m",
  },
  {
    id: "CMP-004",
    title: "VPN access problems for remote workers",
    category: "IT",
    priority: "High",
    status: "In Progress",
    employee: "David Miller",
    assignedDate: "2024-01-13",
    dueDate: "2024-01-19",
    description: "Multiple users unable to connect to VPN",
    escalated: false,
    timeSpent: "6h 45m",
  },
  {
    id: "CMP-005",
    title: "Database backup verification needed",
    category: "IT",
    priority: "Low",
    status: "Resolved",
    employee: "Eva Brown",
    assignedDate: "2024-01-10",
    dueDate: "2024-01-15",
    description: "Monthly backup integrity check",
    escalated: false,
    timeSpent: "2h 20m",
  },
]

const menuItems = [
  { title: "Dashboard", icon: Home, isActive: true },
  { title: "My Complaints", icon: FileText },
  { title: "Team Overview", icon: Users },
  { title: "Analytics", icon: BarChart3 },
  { title: "Profile", icon: User },
]

const Sidebar = ({ isOpen, onClose }) => (
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
    case "Resolved":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "In Progress":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "Pending":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
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

const StatusUpdateDialog = ({ complaint, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(complaint.status)
  const [notes, setNotes] = useState("")

  const handleStatusUpdate = () => {
    if (newStatus && newStatus !== complaint.status) {
      onStatusUpdate(complaint.id, newStatus, notes)
      setNotes("")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Complaint Status</DialogTitle>
          <DialogDescription>Update the status of complaint: {complaint.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status">New Status</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="notes">Update Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this status update..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleStatusUpdate} disabled={!newStatus || newStatus === complaint.status}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [complaints, setComplaints] = useState(mockComplaints)

  const handleStatusUpdate = (complaintId, newStatus, notes) => {
    setComplaints((prev) =>
      prev.map((complaint) => (complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint)),
    )
  }

  const handleStartWork = (complaintId) => {
    setComplaints((prev) =>
      prev.map((complaint) => (complaint.id === complaintId ? { ...complaint, status: "In Progress" } : complaint)),
    )
  }

  const handleCompleteWork = (complaintId) => {
    setComplaints((prev) =>
      prev.map((complaint) => (complaint.id === complaintId ? { ...complaint, status: "Resolved" } : complaint)),
    )
  }

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = statusFilter === "all" || complaint.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesPriority =
      priorityFilter === "all" || complaint.priority.toLowerCase() === priorityFilter.toLowerCase()
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesPriority && matchesSearch
  })

  const stats = {
    total: complaints.length,
    new: complaints.filter((c) => c.status === "New").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    pending: complaints.filter((c) => c.status === "Pending").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
    overdue: complaints.filter((c) => new Date(c.dueDate) < new Date() && c.status !== "Resolved").length,
  }

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
              <Avatar size="sm">
                <AvatarImage src={mockManager.photoUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {mockManager.firstName[0]}
                  {mockManager.lastName[0]}
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
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mockManager.firstName}!</h1>
              <p className="text-gray-600 mt-1">Manage your assigned complaints and track team performance</p>
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

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                  </div>
                  <ArrowUpCircle className="h-6 w-6 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
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

            {/* Team Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Team Overview</CardTitle>
                <CardDescription>Your team members and their complaints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockTeamMembers.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{member.complaints} complaints</Badge>
                    </div>
                  ))}
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

          {/* Complaints Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Assigned Complaints</CardTitle>
                  <CardDescription>Manage and track your assigned complaints</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
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
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComplaints.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="font-medium">{complaint.id}</TableCell>
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
                      <TableCell>{complaint.employee}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(complaint.status)}
                          <Badge className={getStatusColor(complaint.status)}>{complaint.status}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            new Date(complaint.dueDate) < new Date() && complaint.status !== "Resolved"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {complaint.dueDate}
                        </span>
                      </TableCell>
                      <TableCell>{complaint.timeSpent}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {complaint.status === "New" && (
                            <Button variant="outline" size="sm" onClick={() => handleStartWork(complaint.id)}>
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {complaint.status === "In Progress" && (
                            <Button variant="outline" size="sm" onClick={() => handleCompleteWork(complaint.id)}>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          <StatusUpdateDialog complaint={complaint} onStatusUpdate={handleStatusUpdate} />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Add Notes
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <ArrowUpCircle className="mr-2 h-4 w-4" />
                                Request Escalation
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

export default ManagerDashboard

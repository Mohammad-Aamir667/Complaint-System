"use client"

import { useEffect, useState } from "react"
import {
  BarChart3, Bell, FileText, Home, MessageSquare, Plus, Search, TrendingUp, User, LogOut, Clock, CheckCircle, AlertCircle, XCircle, Settings, Menu,
  X,
  Users,
  MoreHorizontal,
  ArrowUpCircle,
  UserCheck,
  Eye,
  Edit,
  AlertTriangle,
} from "lucide-react"
import { Link, useLocation } from 'react-router-dom';
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

import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { BASE_URL } from "@/utils/constants"
import { addAdminComplaint, removeAdminComplaint } from "@/utils/adminComplaintSlice"
import { addManagerData, removeManagerData } from "@/utils/managerDataSlice"
import { useNavigate } from "react-router-dom"
import { removeUser } from "@/utils/userSlice"


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
    case "resolved":
      return "bg-green-100 text-green-800"
    case "in progress":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "escalated":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
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




const AdminComplaint = () => {
  const adminComplaints = useSelector((store) => store.adminComplaints);
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const managers = useSelector((store) => store.managerData);
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

    }
    catch (err) {
      console.error("Error fetching managers:", err);
    }
  }
  useEffect(() => {
    fetchComplaints();
    fetchManagers();
  }, [])
  const handleAssignManager = (complaint) => {
    const selectedManagers = managers.filter((manager) => manager.department === complaint.category);
    navigate(`/assign-manager/${complaint._id}`, { state: { selectedManagers, complaint } });
  }

  return (
    <div>
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
              {adminComplaints?.map((complaint) => (
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
                  <TableCell>{complaint?.createdBy?.firstName + " " + complaint?.createdBy?.lastName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{complaint.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {complaint?.priority}


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
                        <Button onClick={() => { handleAssignManager(complaint) }} variant="outline" size="sm"> <UserCheck className="h-4 w-4 mr-1" />
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
                          <DropdownMenuItem onClick={() => { handleAssignManager(complaint) }}>
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

    </div>
  )
}

export default AdminComplaint
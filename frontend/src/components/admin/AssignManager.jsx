"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import {
  ArrowLeft,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Users,
  Zap,
  Edit,
  UserCheck,
  AlertCircle,
  Download,
  Paperclip,
  Clock,
  Shield,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BASE_URL } from "@/utils/constants"
import { updateManagerData } from "@/utils/managerDataSlice"
import { addAdminComplaint, updateAdminComplaint } from "@/utils/adminComplaintSlice"



const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "resolved":
      return "bg-green-100 text-green-800"
    case "in progress":
      return "bg-blue-100 text-blue-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "new":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

const getFileExtension = (filename) => {
  return filename.split(".").pop()?.toUpperCase() || "FILE"
}

const AssignManager = () => {
  const location = useLocation()
  const { _id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { selectedManagers = [] } = location.state || {}
  const [open, setOpen] = useState(false)
  const adminComplaint = useSelector((store) => store.adminComplaints)
  console.log("Admin complaints:", adminComplaint)
  const complaint = adminComplaint.find((c) => c._id === _id)
  const [selectedManagerId, setSelectedManagerId] = useState(null)
  const selectedManager = selectedManagers.find((m) => m._id === selectedManagerId)
  const [critical, setCritical] = useState(complaint?.critical || false)
  const [priorityModalOpen, setPriorityModalOpen] = useState(false)
  const [newPriority, setNewPriority] = useState(complaint?.priority)
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleAutoAssign = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.put(
        `${BASE_URL}/complaints/${complaint._id}/assign-manager`,
        {
          critical,
        },
        { withCredentials: true },
      )
      if (res.status === 200) {
        // Update manager stats (your existing logic)
        const updatedManager = res.data.assignedManager
        if (updatedManager) {
          updatedManager.totalComplaints = (updatedManager.totalComplaints || 0) + 1
          updatedManager.pending = (updatedManager.pending || 0) + 1
          updateManagerData(updatedManager)
        }

        // Update the complaint in Redux store
        dispatch(updateAdminComplaint(res.data.complaint)) // Assuming res.data contains the updated complaint

        setSuccess("Auto assignment completed successfully!")
        setTimeout(() => {
          setSuccess("")
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to auto assign complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleManualAssign = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.put(
        `${BASE_URL}/complaints/${complaint._id}/assign-manager`,
        {
          managerId: selectedManagerId,
          critical,
        },
        { withCredentials: true },
      )

      if (res.status === 200) {
        const updatedManager = selectedManagers.find((m) => m._id === selectedManagerId)
        if (updatedManager) {
          updatedManager.totalComplaints = (updatedManager.totalComplaints || 0) + 1
          updatedManager.pending = (updatedManager.pending || 0) + 1
          updateManagerData(updatedManager)
        }

        // Update the complaint in Redux store
        dispatch(updateAdminComplaint(res.data.complaint)) // Assuming res.data contains the updated complaint

        setSuccess("Complaint assigned successfully!")
        setOpen(false)
        setTimeout(() => {
          setSuccess("")
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePriorityChangeSubmit = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.put(
        `${BASE_URL}/complaints/${complaint._id}/priority-manual`,
        {
          priority: newPriority,
          reason,
        },
        { withCredentials: true },
      )
      if (res.status === 200) {
        setSuccess("Priority updated successfully!")
        dispatch(
          updateAdminComplaint({
            ...complaint,
            priority: newPriority.toLowerCase(),
          }),
        )
        setPriorityModalOpen(false)
        setReason("")
        setTimeout(() => {
          setSuccess("")
        }, 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update priority. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(BASE_URL + "/admin/complaints", { withCredentials: true })
      dispatch(addAdminComplaint(res.data))
      console.log("Fetched complaints:", res.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch complaints. Please try again.")
    }
  }

  const handleFileDownload = (fileUrl, filename) => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = filename || "download"
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (!complaint) {
      fetchComplaints()
    }
    if (complaint?.critical) {
      setCritical(true)
    }
  }, [complaint])

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Complaint Data</h3>
            <p className="text-gray-600 mb-4">Unable to load complaint information.</p>
            <Button onClick={handleGoBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Assign Manager</h1>
              <p className="text-gray-600">Review complaint details and assign to appropriate manager</p>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Complaint Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Complaint Details
                      {(complaint?.critical || critical) && (
                        <Badge variant="destructive" className="ml-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          CRITICAL
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Review the complaint information before assignment</CardDescription>
                  </div>
                  <Badge className={getPriorityColor(complaint?.priority)} variant="outline">
                    {complaint?.priority?.toUpperCase()} PRIORITY
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status Information */}
                {(complaint?.assignedManager || complaint?.updatedAt) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    {complaint?.assignedManager && (
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Assigned Manager</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                                {complaint.assignedManager?.firstName?.[0] || "M"}
                                {complaint.assignedManager?.lastName?.[0] || ""}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-blue-800">
                              {complaint.assignedManager?.firstName} {complaint.assignedManager?.lastName}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {complaint?.updatedAt && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Last Updated</p>
                          <p className="text-sm text-blue-800">
                            {new Date(complaint.updatedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Basic Information */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Complaint ID</Label>
                    <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{complaint?.complaintId || "N/A"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Status</Label>
                    <Badge className={getStatusColor(complaint?.status)}>{complaint?.status || "Unknown"}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Category</Label>
                    <Badge variant="outline">{complaint?.category || "General"}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-600">Date Created</Label>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(complaint?.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Employee Information */}
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-3 block">Submitted By</Label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {complaint?.createdBy?.firstName?.[0] || "U"}
                        {complaint?.createdBy?.lastName?.[0] || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {complaint?.createdBy?.firstName} {complaint?.createdBy?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{complaint?.createdBy?.emailId}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Complaint Content */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Title</Label>
                    <h3 className="text-lg font-semibold mt-1">{complaint?.title}</h3>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Description</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">{complaint?.description}</p>
                    </div>
                  </div>

                  {/* File Attachments */}
                  {complaint?.attachments && complaint.attachments.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600 mb-3 block">
                        <Paperclip className="h-4 w-4 inline mr-1" />
                        Attachments ({complaint.attachments.length})
                      </Label>
                      <div className="space-y-2">
                        {complaint.attachments.map((attachment, index) => {
                          const filename = attachment.fileUrl?.split("/").pop() || `attachment-${index + 1}`
                          const extension = getFileExtension(filename)

                          return (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                                  <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{filename}</p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span>{extension}</span>
                                    {attachment.size && (
                                      <>
                                        <span>•</span>
                                        <span>{formatFileSize(attachment.size)}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFileDownload(attachment.fileUrl, filename)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Panel */}
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Assignment Actions
                </CardTitle>
                <CardDescription>Choose how to assign this complaint</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {complaint?.assignedManager && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-800">Already Assigned</p>
                    <p className="text-xs text-green-600">This complaint has been assigned to a manager</p>
                  </div>
                )}

                {/* Auto Assign */}
                <div className="space-y-2">
                  <Button
                    onClick={handleAutoAssign}
                    className="w-full"
                    disabled={loading || complaint?.assignedManager}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Auto Assign
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500">Automatically assign to the best available manager</p>
                </div>

                <Separator />

                {/* Manual Assign */}
                <div className="space-y-2">
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={loading || complaint?.assignedManager}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Manual Assign
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Manual Assignment</DialogTitle>
                        <DialogDescription>Select a manager to assign this complaint</DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <Label>Select Manager</Label>
                          <Select
                            onValueChange={(val) => setSelectedManagerId(val)}
                            value={selectedManagerId || undefined}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Choose a manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedManagers.map((manager) => (
                                <SelectItem key={manager._id} value={manager._id}>
                                  {manager.firstName} {manager.lastName} - {manager.department || "General"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="border rounded-lg p-4 bg-gray-50">
                          {selectedManager ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                  <AvatarFallback className="text-lg">
                                    {selectedManager.firstName[0]}
                                    {selectedManager.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">
                                    {selectedManager.firstName} {selectedManager.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600">{selectedManager.emailId}</p>
                                </div>
                              </div>

                              <Separator />

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600">Total Complaints</p>
                                  <p className="font-semibold">{selectedManager.totalComplaints || 0}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">In Progress</p>
                                  <p className="font-semibold">{selectedManager.inProgess || 0}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Pending</p>
                                  <p className="font-semibold">{selectedManager.pending || 0}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Resolved</p>
                                  <p className="font-semibold">{selectedManager.activeComplaints || 0}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                              <p>Select a manager to view details</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <DialogFooter className="pt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleManualAssign} disabled={!selectedManagerId || loading}>
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Assigning...
                            </>
                          ) : (
                            "Assign to Manager"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <p className="text-xs text-gray-500">Choose a specific manager from the list</p>
                </div>

                <Separator />

                {/* Mark as Critical */}
                <div className="space-y-2">
                  <Button
                    variant={critical ? "default" : "outline"}
                    onClick={() => setCritical(!critical)}
                    className="w-full"
                    disabled={loading || complaint?.assignedManager}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {critical ? "Marked as Critical" : "Mark as Critical"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    {critical ? "This complaint is marked as critical" : "Mark for urgent attention"}
                  </p>
                </div>

                <Separator />

                {/* Change Priority */}
                <div className="space-y-2">
                  <Dialog open={priorityModalOpen} onOpenChange={setPriorityModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" disabled={loading || complaint?.assignedManager}>
                        <Edit className="h-4 w-4 mr-2" />
                        Change Priority
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Change Complaint Priority</DialogTitle>
                        <DialogDescription>
                          Update the priority level and provide a reason for the change
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="priority">New Priority</Label>
                          <Select value={newPriority} onValueChange={setNewPriority}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="reason">Reason for Change</Label>
                          <Textarea
                            id="reason"
                            placeholder="Explain why the priority is being changed..."
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                        </div>
                      </div>

                      <DialogFooter className="pt-4">
                        <Button variant="outline" onClick={() => setPriorityModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handlePriorityChangeSubmit}
                          disabled={!newPriority || !reason.trim() || loading}
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Updating...
                            </>
                          ) : (
                            "Update Priority"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <p className="text-xs text-gray-500">Current: {complaint?.priority?.toUpperCase()} priority</p>
                </div>
              </CardContent>
            </Card>

            {/* Available Managers Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Available Managers</CardTitle>
                <CardDescription>Managers in {complaint?.category} department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedManagers.slice(0, 3).map((manager) => (
                    <div key={manager._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {manager.firstName[0]}
                            {manager.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {manager.firstName} {manager.lastName}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {manager.totalComplaints || 0} active
                      </Badge>
                    </div>
                  ))}
                  {selectedManagers.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{selectedManagers.length - 3} more managers available
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignManager

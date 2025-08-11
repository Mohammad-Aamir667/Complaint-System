"use client"

import { BASE_URL } from "@/utils/constants"
import { addManagerComplaint,  } from "@/utils/managerComplaintSlice"
import axios from "axios"
import { FileText, User, Calendar, CheckCircle, Clock, AlertCircle, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

const SuperAdminComplaintDetails = () => {
  const location = useLocation()
  const { _id } = useParams()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState({ accept: false, resolve: false })

  const superAdminComplaints = useSelector((store) => store.superAdminComplaints)
  const complaint = superAdminComplaints.find((c) => c._id === _id)

  console.log("Complaint Details:", complaint)

  const fetchComplaints = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(BASE_URL + "/superadmin/complaints", { withCredentials: true })
      dispatch(addManagerComplaint(res.data))
      console.log("Fetched complaints:", res.data)
    } catch (err) {
      console.error("Error fetching complaints:", err)
      toast({
        title: "Error",
        description: "Failed to fetch complaint details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    if (superAdminComplaints.length === 0) {
      fetchComplaints()
    }
  }, [superAdminComplaints])

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: "secondary", icon: Clock, color: "text-yellow-600" },
      "in progress": { variant: "default", icon: AlertCircle, color: "text-blue-600" },
      resolved: { variant: "default", icon: CheckCircle, color: "text-green-600" },
      accepted: { variant: "outline", icon: CheckCircle, color: "text-green-600" },
    }

    const config = statusConfig[status?.toLowerCase()] || statusConfig["pending"]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    )
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Complaint Not Found</h3>
              <p className="text-muted-foreground">The requested complaint could not be found.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaint Details</h1>
          <p className="text-muted-foreground">Manage and track complaint resolution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {complaint?.title}
                </CardTitle>
                {getStatusBadge(complaint?.status)}
              </div>
              <CardDescription>Complaint ID: {complaint?.complaintId}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">{complaint?.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {complaint?.attachments && complaint.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Attachments ({complaint.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {complaint.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">Attachment {index + 1}</p>
                        <p className="text-sm text-muted-foreground">Click to download</p>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submitted By */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Submitted By
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {getInitials(complaint?.createdBy?.firstName, complaint?.createdBy?.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {complaint?.createdBy?.firstName} {complaint?.createdBy?.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">Complainant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Admin */}
          {complaint?.assignedAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Assigned Admin
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {getInitials(complaint?.assignedAdmin?.firstName, complaint?.assignedAdmin?.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {complaint?.assignedAdmin?.firstName} {complaint?.assignedAdmin?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">Administrator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Status Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Status</span>
                {getStatusBadge(complaint?.status)}
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Complaint ID</span>
                  <span className="font-mono">{complaint?.complaintId}</span>
                </div>
                {complaint?.createdAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminComplaintDetails

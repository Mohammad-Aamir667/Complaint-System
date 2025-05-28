"use client"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Edit, Mail, User, Building, Briefcase, Calendar, Shield } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const Profile = () => {
  const user = useSelector((store) => store?.user)
  const navigate = useNavigate()

  const handleEditProfile = () => {
    navigate("/profile/edit")
  }

  const handleGoBack = () => {
    navigate("/employee/dashboard")
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";       // Green
      case "pending":
        return "warning";       // Yellow/Orange
      case "inactive":
        return "secondary";     // Gray
      case "suspended":
        return "destructive";   // Red
      case "terminated":
        return "outline";       // Neutral border
      default:
        return "outline";
    }
  }
  

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and account settings</p>
            </div>
            <Button onClick={handleEditProfile}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Picture and Basic Info */}
         {/* Profile Picture and Basic Info */}
<Card className="md:col-span-1">
  <CardHeader className="flex flex-col items-center p-6">
    {/* Avatar with centered alignment */}
    <div className="mb-4">
      <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
        <AvatarImage
          src={user?.photoUrl || "/placeholder.svg"}
          alt={`${user?.firstName} ${user?.lastName}`}
          className="object-cover"
        />
        <AvatarFallback className="text-4xl font-medium bg-blue-500 text-white">
          {user?.firstName?.[0]?.toUpperCase()}
          {user?.lastName?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>

    {/* Name with proper spacing */}
    <CardTitle className="text-2xl font-semibold mb-1 text-center">
      {user?.firstName} {user?.lastName}
    </CardTitle>

    {/* Role and Department with better layout */}
    <CardDescription className="flex flex-col items-center gap-2 text-gray-600">
      <div className="text-lg">{user?.role || "Employee"}</div>
      
      {user?.department && (
        <div className="flex items-center gap-2 mt-1">
          <span>Department:</span>
          <span className="font-medium text-gray-800">
            {user.department}
          </span>
        </div>
      )}
    </CardDescription>

    {/* Status badge with proper margin */}
    <div className="mt-4">
      <Badge 
        variant={getStatusVariant(user?.status)} 
      
        className="text-sm px-3 py-1"
      >
       {user?.status }
      </Badge>
    </div>

  </CardHeader>
</Card>
          {/* Detailed Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your account details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Contact Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </div>
                    <div className="font-medium">{user?.emailId || "N/A"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      Full Name
                    </div>
                    <div className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Professional Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="h-4 w-4 mr-2" />
                      Role
                    </div>
                    <div className="font-medium">{user?.role || "N/A"}</div>
                  </div>
                  {user?.department && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        Department
                      </div>
                      <div className="font-medium">{user.department}</div>
                    </div>
                  )}
                  {user?.joiningDate && (
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Joining Date
                      </div>
                      <div className="font-medium">{formatDate(user.joiningDate)}</div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="h-4 w-4 mr-2" />
                      Account Status
                    </div>
                    <div>
                      <Badge variant={getStatusVariant(user?.status)}>{user?.status || "Active"}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {(user?.employeeId || user?.phoneNumber || user?.address) && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {user?.employeeId && (
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Employee ID</div>
                          <div className="font-medium">{user.employeeId}</div>
                        </div>
                      )}
                      {user?.phoneNumber && (
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">Phone Number</div>
                          <div className="font-medium">{user.phoneNumber}</div>
                        </div>
                      )}
                      {user?.address && (
                        <div className="space-y-2 md:col-span-2">
                          <div className="text-sm text-gray-600">Address</div>
                          <div className="font-medium">{user.address}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" onClick={() => navigate("/employee/complaints")}>
                <Briefcase className="h-4 w-4 mr-2" />
                View My Complaints
              </Button>
              <Button variant="outline" onClick={() => navigate("/employee/settings")}>
                <Shield className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile

"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Save, User, AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

import { addUser } from "../utils/userSlice"
import { BASE_URL } from "../utils/constants"
import ProfilePictureUpload from "./ProfilePictureUpload"

const EditProfile = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [gender, setGender] = useState(user?.gender || "")
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "")
  const [error, setError] = useState("")
  const [apiError, setApiError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState(false)

  // Auto-hide photo upload success after 3 seconds
  useEffect(() => {
    if (photoUploadSuccess) {
      const timer = setTimeout(() => {
        setPhotoUploadSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [photoUploadSuccess])

  const handleSaveProfile = async (e) => {
    e.preventDefault()

    if (!firstName.trim()) {
      setError("First name is required")
      return
    }

    try {
      setError("")
      setApiError(false)
      setLoading(true)

      const res = await axios.post(
        `${BASE_URL}/editProfile`,
        { firstName, lastName, gender, photoUrl },
        { withCredentials: true },
      )

      dispatch(addUser(res.data))
      setSuccess(true)

      // Show success message briefly then navigate
      setTimeout(() => {
        navigate(-1)
      }, 1500)
    } catch (err) {
      console.error(err)
      if (err?.response?.status === 400) {
        setError(err.response.data.message || "Invalid input")
      } else {
        setApiError(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate(-1)
  }

   
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600">Update your personal information and profile picture</p>
            </div>
          </div>
        </div>

        {/* Success Messages */}
        {photoUploadSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Photo uploaded successfully!</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Profile updated successfully! Redirecting...</AlertDescription>
          </Alert>
        )}

        {/* Main Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details below</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Profile Picture Upload */}
            <div>
              <Label className="text-base font-medium">Profile Picture</Label>
              <p className="text-sm text-gray-600 mb-4">Click on the image to upload a new profile picture</p>
          
<ProfilePictureUpload 
  photoUrl={photoUrl} 
setPhotoUrl={(url) => {
    setPhotoUrl(url)
   // Update the Redux store with the new photoUrl
   dispatch(addUser({ ...user, photoUrl: url }));
 }}
  setSuccess={setPhotoUploadSuccess}
/>
            </div>

            <Separator />

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Error Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {apiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Something went wrong. Please try again later.</AlertDescription>
                </Alert>
              )}

              {/* Name Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      if (error) setError("")
                    }}
                    placeholder="Enter your first name"
                    disabled={loading}
                    className={error && !firstName.trim() ? "border-red-300" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Gender Field */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">This information helps us personalize your experience</p>
              </div>

              {/* Read-only Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-gray-900">Account Information</h4>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 font-medium">{user?.emailId || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Role:</span>
                    <span className="ml-2 font-medium">{user?.role || "N/A"}</span>
                  </div>
                  {user?.department && (
                    <div>
                      <span className="text-gray-600">Department:</span>
                      <span className="ml-2 font-medium">{user.department}</span>
                    </div>
                  )}
                  {user?.joiningDate && (
                    <div>
                      <span className="text-gray-600">Joining Date:</span>
                      <span className="ml-2 font-medium">{user.joiningDate}</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Contact your administrator to update email, role, or department information
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleGoBack} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !firstName.trim()}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-3">
              If you need to update your email address, role, or department, please contact your system administrator.
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EditProfile
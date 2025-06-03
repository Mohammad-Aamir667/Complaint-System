"use client"

import { useState } from "react"
import axios from "axios"
import { Camera, Upload, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { BASE_URL } from "../utils/constants"

const ProfilePictureUpload = ({ photoUrl, setPhotoUrl,setSuccess }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await axios.post(`${BASE_URL}/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);   
      setPhotoUrl(res.data.url)
    } catch (err) {
      console.error(err)
      if (err?.response?.status === 413) {
        setError("Image file is too large. Please choose a smaller image.")
      } else if (err?.response?.status === 400) {
        setError(err?.response?.data?.message || "Invalid image file")
      } else {
        setError("Failed to upload image. Please try again.")
      }
    } finally {
      setIsUploading(false);
    }
  }

 
  const handleRemovePhoto = async () => {
    try {
      await axios.post(
        `${BASE_URL}/removeProfilePhoto`,
        {}, 
        { withCredentials: true }
      );
        setPhotoUrl("/placeholder.svg");
      setSuccess(true);
      setError("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error removing profile picture:", err);
      setError("Failed to remove profile picture.");
    }
  }
  

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative group">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage src={photoUrl || "/placeholder.svg"} alt="Profile picture" className="object-cover" />
          <AvatarFallback className="text-2xl bg-blue-500 text-white">
            <Camera className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>

        {/* Upload Overlay */}
        {!isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <label htmlFor="profile-upload" className="cursor-pointer">
              <Camera className="h-8 w-8 text-white" />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
        )}

        {/* Loading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Upload Status */}
      {isUploading && (
        <div className="text-center">
          <p className="text-sm text-gray-600">Uploading image...</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild disabled={isUploading}>
          <label htmlFor="profile-upload-btn" className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            Upload Photo
            <input
              id="profile-upload-btn"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </Button>

        {photoUrl && (
          <Button variant="outline" size="sm" onClick={handleRemovePhoto} disabled={isUploading}>
            Remove
          </Button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Guidelines */}
      <div className="text-center max-w-md">
        <p className="text-xs text-gray-500">
          Recommended: Square image, at least 200x200 pixels. Max file size: 5MB.
          <br />
          Supported formats: JPG, PNG, GIF
        </p>
      </div>
    </div>
  )
}

export default ProfilePictureUpload

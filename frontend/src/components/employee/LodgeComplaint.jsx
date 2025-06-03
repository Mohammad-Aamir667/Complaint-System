"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ChevronDown, FileText, ArrowLeft, AlertCircle, Upload } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "../../utils/constants"
import { addNewComplaint } from "../../utils/userComplaintsSlice"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const Alert = ({ children, variant = "error" }) => {
  const variants = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  }

  return (
    <div className={`border rounded-md p-4 flex items-start gap-3 ${variants[variant]}`}>
      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div className="text-sm">{children}</div>
    </div>
  )
}

const LodgeComplaint = () => {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    file: null,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const categories = [
    { value: "NA", label: "Select a category" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "IT", label: "IT" },
    { value: "Facilities", label: "Facilities" },
    { value: "General", label: "General" },
  ]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.category || formData.category === "NA") newErrors.category = "Category is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")
    setSubmitSuccess("")

    if (!validateForm()) return

    setLoading(true)

    const formDataToSubmit = new FormData()
    formDataToSubmit.append("title", formData.title)
    formDataToSubmit.append("description", formData.description)
    formDataToSubmit.append("category", formData.category)
    if (formData.file) formDataToSubmit.append("attachment", formData.file)

    try {
      const res = await axios.post(BASE_URL + "/complaint/lodge", formDataToSubmit, {
        withCredentials: true,
      })

      dispatch(addNewComplaint(res.data))
      setSubmitSuccess("Complaint lodged successfully! Redirecting...")

      setFormData({ title: "", description: "", category: "", file: null })
      setErrors({})

      setTimeout(() => {
        navigate("/employee/dashboard")
      }, 1500)
    } catch (err) {
      console.error("Error lodging complaint:", err)
      setSubmitError(err.response?.data?.message || "Failed to lodge complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate("/employee/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lodge New Complaint</h1>
              <p className="text-gray-600">Submit your complaint and we'll address it promptly</p>
            </div>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}
              {submitError && <Alert variant="error">{submitError}</Alert>}

              {/* Title */}
              <div>
                <Label htmlFor="complaintTitle" required>
                  Complaint Title
                </Label>
                <Input
                  id="complaintTitle"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Enter a brief title for your complaint"
                  disabled={loading}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="complaintCategory" required>
                  Complaint Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData({ ...formData, category: value })
                    if (errors.category) setErrors({ ...errors, category: "" })
                  }}
                  disabled={loading}
                >
                  <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.value}
                        value={cat.value}
                        disabled={cat.value === "NA"}
                      >
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="complaintDescription" required>
                  Complaint Description
                </Label>
                <Textarea
                  id="complaintDescription"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Provide a detailed description of your complaint..."
                  rows={6}
                  disabled={loading}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <Label className="mb-2 block font-medium text-sm text-gray-700">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-2" /> Attachment (optional)
                  </span>
                </Label>
                <div
                  className={`relative border ${errors.file ? "border-red-500" : "border-gray-300"} rounded-lg bg-white`}
                >
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setFormData({ ...formData, file })
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center px-3 py-2">
                    <Upload className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-600 truncate">
                      {formData.file?.name || "Choose a file..."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900 mb-2">Guidelines for submitting complaints:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Be specific and provide relevant details</li>
                  <li>• Include dates, times, and locations when applicable</li>
                  <li>• Maintain a professional and respectful tone</li>
                  <li>• You will receive updates on your complaint status</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleGoBack} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !formData.title.trim() ||
                  !formData.category ||
                  !formData.description.trim()
                }
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default LodgeComplaint

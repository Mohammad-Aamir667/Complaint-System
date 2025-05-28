"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ChevronDown, FileText, ArrowLeft, AlertCircle } from "lucide-react"
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
  } from "@/components/ui/select";
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
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const categories = [
    { value: "NA", label: "Select a category" },
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "IT", label: "IT" },
    { value: "Facilities", label: "Facilities" },
    { value: "General", label: "General" },
  ];

  const validateForm = () => {
    const newErrors = {}

    if (!title.trim()) {
      newErrors.title = "Complaint title is required"
    } else if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long"
    }

    if (!category) {
      newErrors.category = "Please select a category"
    }

    if (!description.trim()) {
      newErrors.description = "Complaint description is required"
    } else if (description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const res = await axios.post(
        BASE_URL + "/complaint/lodge",
        { title: title.trim(), description: description.trim(), category },
        { withCredentials: true },
      )

      dispatch(addNewComplaint(res.data))
      setSubmitSuccess("Complaint lodged successfully! Redirecting...")
      setTitle("")
      setDescription("")
      setCategory("")
      setErrors({})

      // Redirect after a short delay to show success message
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
        {/* Header */}
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

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Success Message */}
              {submitSuccess && <Alert variant="success">{submitSuccess}</Alert>}

              {/* Error Message */}
              {submitError && <Alert variant="error">{submitError}</Alert>}

              {/* Title Field */}
              <div>
                <Label htmlFor="complaintTitle" required>
                  Complaint Title
                </Label>
                <Input
                  id="complaintTitle"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (errors.title) {
                      setErrors({ ...errors, title: "" })
                    }
                  }}
                  placeholder="Enter a brief title for your complaint"
                  error={!!errors.title}
                  disabled={loading}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Category Field */}
              <div>
                <Label htmlFor="complaintCategory" required>
                  Complaint Category
                </Label>
                <Select
  value={category}
  onValueChange={(value) => {
    setCategory(value);
    if (errors.category) {
      setErrors({ ...errors, category: "" });
    }
  }}
  disabled={loading}
>
  <SelectTrigger
    id="complaintCategory"
    className={errors.category ? "border-red-500" : ""}
  >
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
                <p className="text-gray-500 text-sm mt-1">Select the department that best relates to your complaint</p>
              </div>

              {/* Description Field */}
              <div>
                <Label htmlFor="complaintDescription" required>
                  Complaint Description
                </Label>
                <Textarea
                  id="complaintDescription"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    if (errors.description) {
                      setErrors({ ...errors, description: "" })
                    }
                  }}
                  placeholder="Provide a detailed description of your complaint..."
                  rows={6}
                  error={!!errors.description}
                  disabled={loading}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                <p className="text-gray-500 text-sm mt-1">
                  Please provide as much detail as possible to help us understand and resolve your complaint
                </p>
              </div>
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
              <Button type="submit" disabled={loading || !title.trim() || !category || !description.trim()}>
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

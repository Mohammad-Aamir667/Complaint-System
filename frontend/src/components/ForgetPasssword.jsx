"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "@/utils/constants"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Mail, Send, CheckCircle ,AlertCircle} from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"




const ForgotPassword = () => {
  const [emailId, setEmailId] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  const handleRequestOtp = async () => {
    if (emailId.trim() === "") {
      setError("Email ID is required")
      return
    }
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/forget-password`, { emailId }, { withCredentials: true })
      setMessage(res.data.message)
      toast.success(res.data.message)
      setOtpSent(true)
      setShowToast(true)
      setError("")
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong")
      toast.error(err?.response?.data?.message || "Something went wrong")
      setMessage("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-800 hover:bg-gray-100 p-0 h-auto font-normal"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                {otpSent ? <CheckCircle className="h-6 w-6" /> : <Mail className="h-6 w-6" />}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">{otpSent ? "Check Your Email" : "Forgot Password"}</CardTitle>
            <CardDescription>
              {otpSent
                ? "We've sent a verification code to your email address"
                : "Enter your email address and we'll send you a verification code"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10"
                    disabled={otpSent}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {otpSent && message && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{message}</AlertDescription>
                </Alert>
              )}

              {!otpSent && (
                <Button onClick={handleRequestOtp} disabled={loading || !emailId.trim()} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              )}

              {otpSent && (
                <Button
                  onClick={() => navigate("/reset-password", { state: { emailId } })}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Continue to Reset Password
                </Button>
              )}

              <div className="text-center pt-4">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Button
                    variant="link"
                    onClick={() => navigate("/login")}
                    className="p-0 h-auto text-sm text-blue-600"
                  >
                    Sign In
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg border border-green-500 z-50">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {message}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword

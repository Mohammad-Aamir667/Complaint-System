"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"

import { addUser } from "../utils/userSlice"
import { BASE_URL } from "../utils/constants"

const Login = () => {
  const [emailId, setEmailId] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoginForm, setIsLoginForm] = useState(true)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordMatchError, setPasswordMatchError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((store) => store.user)

  useEffect(() => {
    if (user?.role === "employee") {
      navigate("/employee/dashboard")
    } else if (user?.role === "manager") {
      navigate("/manager/dashboard")
    } else if (user?.role === "admin") {
      navigate("/admin/dashboard")
    } else if (user?.role === "super-admin") {
      navigate("/super-admin/dashboard")
    }
  }, [user, navigate])

  useEffect(() => {
    if (!password.startsWith(confirmPassword)) {
      setPasswordMatchError(true)
    } else {
      setPasswordMatchError(false)
    }
  }, [password, confirmPassword])

  const getErrorMessage = (err) => {
    if (err?.response?.status === 403) {
      return err?.response?.data?.message || "Your account is not active. Please contact admin for assistance."
    } else if (err?.response?.status === 401) {
      return "Invalid email or password. Please check your credentials and try again."
    } else if (err?.response?.status === 400) {
      return err?.response?.data || "Invalid request. Please check your input and try again."
    } else if (err?.response?.status === 404) {
      return "Account not found. Please check your email address or sign up for a new account."
    } else if (err?.response?.status === 429) {
      return "Too many login attempts. Please wait a few minutes before trying again."
    } else if (err?.response?.status >= 500) {
      return "Server error. Please try again later or contact support if the problem persists."
    } else {
      return err?.response?.data || "An unexpected error occurred. Please try again."
    }
  }

  const handleLogin = async () => {
    if (!emailId && !password) {
      setError("Email and password are required")
      return
    } else if (!emailId) {
      setError("Email is required")
      return
    } else if (!password) {
      setError("Password is required")
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true },
      )

      dispatch(addUser(res.data))
      if (res?.data) {
        navigate(`/${res.data?.role}/dashboard`)
      } else {
        navigate("/")
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!firstName || !lastName || !emailId || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      return
    }

    setError("")
    setLoading(true)

    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: firstName.trim(),
          lastName,
          emailId: emailId.trim(),
          password,
        },
        { withCredentials: true },
      )

      dispatch(addUser(res.data))
      navigate("/profile")
    } catch (err) {
      console.log(err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isLoginForm) {
      handleLogin()
    } else {
      handleSignUp()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <Lock className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">{isLoginForm ? "Welcome back" : "Create account"}</CardTitle>
            <CardDescription>
              {isLoginForm
                ? "Enter your credentials to access your account"
                : "Fill in your information to get started"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginForm && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          className="pl-10"
                          required={!isLoginForm}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Doe"
                          className="pl-10"
                          required={!isLoginForm}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="john.doe@company.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {!isLoginForm && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      required={!isLoginForm}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  {passwordMatchError && confirmPassword && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Passwords do not match
                    </p>
                  )}
                  {!passwordMatchError && confirmPassword && password === confirmPassword && (
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Passwords match
                    </p>
                  )}
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading || (!isLoginForm && passwordMatchError)}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : isLoginForm ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

              {isLoginForm && (
                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate("/forgot-password")}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}

              <Separator />

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsLoginForm((prev) => !prev)}
                  className="text-sm"
                >
                  {isLoginForm ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            By signing in, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-sm text-blue-600">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

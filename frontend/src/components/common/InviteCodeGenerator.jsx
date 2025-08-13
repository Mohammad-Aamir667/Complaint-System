"use client"

import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { BASE_URL } from "@/utils/constants"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, UserPlus, Copy, Check } from "lucide-react"

export default function InviteCodeGenerator() {
  const [role, setRole] = useState("employee")
  const [generatedCode, setGeneratedCode] = useState("")
  const [emailId, setEmailId] = useState("")
  const [copied, setCopied] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const user = useSelector((state) => state.user)

  const generateCode = async () => {
    if (!emailId.trim()) {
      toast.error("Please enter an email address")
      return 
    }

    setIsGenerating(true)
    try {
        console.log("Generating invite code for:", { role, emailId })
      const { data } = await axios.post(BASE_URL + "/generate-invite-code", { role,emailId}, { withCredentials: true })
      setGeneratedCode(data.code)
      toast.success("Invite code generated!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Error generating code")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      toast.success("Code copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy code")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Generate Invite Code</CardTitle>
          <CardDescription className="text-gray-600">Create invitation codes for new team members</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {user.role === "superadmin" && (
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="Enter email address"
                className="pl-10"
                required
              />
            </div>
          </div>

          <Button
            onClick={generateCode}
            disabled={isGenerating || !emailId.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              "Generate Invite Code"
            )}
          </Button>

          {generatedCode && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-green-800">Invite code generated successfully!</p>
                  <div className="flex items-center justify-between bg-white p-3 rounded-md border">
                    <code className="text-sm font-mono text-gray-900 flex-1">{generatedCode}</code>
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="ml-2 h-8 bg-transparent">
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

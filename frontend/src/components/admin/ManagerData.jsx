"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import {
  Users,
  Mail,
  Building,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { BASE_URL } from "@/utils/constants"
import { addManagerData } from "@/utils/managerDataSlice"

const ManagerData = () => {
  const managers = useSelector((store) => store.managerData)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const fetchManagers = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.get(BASE_URL + "/managers/complaint-stats", { withCredentials: true })
      dispatch(addManagerData(res.data))
      console.log("Fetched managers:", res.data)
    } catch (err) {
      console.error("Error fetching managers:", err)
      setError("Failed to fetch managers data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchManagers()
  }, [])

  // Get unique departments for filter
  const departments = [...new Set(managers?.map((manager) => manager.department).filter(Boolean))]

  // Filter managers based on search and department
  const filteredManagers = managers?.filter((manager) => {
    const matchesSearch =
      manager.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.emailId?.toLowerCase().includes(searchTerm.toLowerCase())


    return matchesSearch;
  })

  // Calculate overall stats
  const totalManagers = managers?.length || 0
  const totalComplaints = managers?.reduce((sum, manager) => sum + (manager.totalComplaints || 0), 0) || 0
  const totalResolved = managers?.reduce((sum, manager) => sum + (manager.resolved || 0), 0) || 0
  const totalPending = managers?.reduce((sum, manager) => sum + (manager.pending || 0), 0) || 0
  const overallResolutionRate = totalComplaints > 0 ? Math.round((totalResolved / totalComplaints) * 100) : 0

  const getPerformanceColor = (resolved, total) => {
    if (total === 0) return "bg-gray-100 text-gray-800"
    const rate = (resolved / total) * 100
    if (rate >= 80) return "bg-green-100 text-green-800"
    if (rate >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getPerformanceRate = (resolved, total) => {
    return total > 0 ? Math.round((resolved / total) * 100) : 0
  }

  if (loading && !managers?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading Managers</h3>
            <p className="text-gray-600">Fetching manager data and statistics...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Directory</h1>
              <p className="text-gray-600">View all managers and their complaint handling statistics</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Managers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalManagers}</p>
                </div>
                <Users className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-900">{totalComplaints}</p>
                </div>
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{totalResolved}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                  <p className="text-2xl font-bold text-blue-600">{overallResolutionRate}%</p>
                </div>
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search managers by name or email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
             
              <Button variant="outline" onClick={fetchManagers} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  "Refresh Data"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Managers Grid */}
        {filteredManagers?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredManagers.map((manager) => {
              const resolutionRate = getPerformanceRate(manager.resolved || 0, manager.totalComplaints || 0)
              const performanceColor = getPerformanceColor(manager.resolved || 0, manager.totalComplaints || 0)

              return (
                <Card key={manager._id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={manager.photoUrl || "/placeholder.svg"}
                          alt={`${manager.firstName} ${manager.lastName}`}
                        />
                        <AvatarFallback className="text-lg bg-blue-500 text-white">
                          {manager.firstName?.[0] || "M"}
                          {manager.lastName?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-lg">
                      {manager.firstName} {manager.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-1">
                      <Building className="h-4 w-4" />
                      {manager.department || "General"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{manager.emailId}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* Performance Overview */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Performance</span>
                        <Badge className={performanceColor}>{resolutionRate}% Resolved</Badge>
                      </div>
                      <Progress value={resolutionRate} className="h-2" />
                    </div>

                    <Separator />

                    {/* Complaint Statistics */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Complaint Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-semibold text-lg text-gray-900">{manager.totalComplaints || 0}</div>
                          <div className="text-gray-600">Total</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-semibold text-lg text-green-600">{manager.resolved || 0}</div>
                          <div className="text-gray-600">Resolved</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded">
                          <div className="font-semibold text-lg text-yellow-600">{manager.pending || 0}</div>
                          <div className="text-gray-600">Pending</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-semibold text-lg text-blue-600">{manager.inProgress || 0}</div>
                          <div className="text-gray-600">In Progress</div>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Managers Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || departmentFilter !== "all"
                  ? "No managers match your current filters."
                  : "No manager data available at the moment."}
              </p>
              {(searchTerm || departmentFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setDepartmentFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ManagerData

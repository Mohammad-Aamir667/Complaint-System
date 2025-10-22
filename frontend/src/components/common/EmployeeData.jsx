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
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { BASE_URL } from "@/utils/constants"
import { addEmployeeData } from "@/utils/employeeDataSlice"

const EmployeeData = () => {
  const employees = useSelector((store) => store.employeeData)
  const user = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.get(BASE_URL + "/employees/complaint-stats", { withCredentials: true })
      dispatch(addEmployeeData(res.data))
    } catch (err) {
      console.error("Error fetching employees:", err)
      setError("Failed to fetch employees data. Please try again.")
    } finally {
      setLoading(false)
    }
  }
  const handleOpenModal = (employee) => {
    setSelectedEmployee(employee)
    setModalOpen(true)
  }

  const handleAction = async (status) => {
    if (!selectedEmployee) return
    try {
      setActionLoading(true)
      await axios.put(
        `${BASE_URL}/employees/${selectedEmployee._id}/status`,
        { status },
        { withCredentials: true }
      )
      await fetchEmployees();
      setModalOpen(false)
    } catch (err) {
      console.error("Failed to update status", err)
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    if (employees?.length === 0)
      fetchEmployees()
  }, [])


  const filteredEmployees = employees?.filter((employee) => {
    const matchesSearch =
      employee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.emailId?.toLowerCase().includes(searchTerm.toLowerCase())


    return matchesSearch;
  })

  // Calculate overall stats
  const totalEmployees = employees?.length || 0
  const totalComplaints = employees?.reduce((sum, employee) => sum + (employee.totalComplaints || 0), 0) || 0
  const totalResolved = employees?.reduce((sum, employee) => sum + (employee.resolved || 0), 0) || 0
  const totalPending = employees?.reduce((sum, employee) => sum + (employee.pending || 0), 0) || 0
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
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-yellow-100 text-yellow-800"
      case "terminated":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading && !employees?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading Employees</h3>
            <p className="text-gray-600">Fetching employee data and statistics...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Employee Directory</h1>
              <p className="text-gray-600">View all employees and their complaint handling statistics</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
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

              <Button variant="outline" onClick={fetchEmployees} disabled={loading}>
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
        {filteredEmployees?.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEmployees.map((employee) => {
              const resolutionRate = getPerformanceRate(employee.resolved || 0, employee.totalComplaints || 0)
              const performanceColor = getPerformanceColor(employee.resolved || 0, employee.totalComplaints || 0)
              const statusColor = getStatusColor(manager.status)

              return (
                <Card key={employee._id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                        <AvatarImage
                          src={employee.photoUrl || "/placeholder.svg"}
                          alt={`${employee.firstName} ${employee.lastName}`}
                        />
                        <AvatarFallback className="text-lg bg-blue-500 text-white">
                          {employee.firstName?.[0] || "E"}
                          {employee.lastName?.[0] || ""}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <CardTitle className="text-lg">
                      {employee.firstName} {employee.lastName}
                      <Badge className={statusColor}>{employee.status || "Unknown"}</Badge>

                    </CardTitle>
                    <CardDescription className="flex items-center justify-center gap-1">
                      <Building className="h-4 w-4" />
                      {employee.department || "General"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{employee.emailId}</span>
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
                          <div className="font-semibold text-lg text-gray-900">{employee.totalComplaints || 0}</div>
                          <div className="text-gray-600">Total</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-semibold text-lg text-green-600">{employee.resolved || 0}</div>
                          <div className="text-gray-600">Resolved</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-50 rounded">
                          <div className="font-semibold text-lg text-yellow-600">{employee.pending || 0}</div>
                          <div className="text-gray-600">Pending</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-semibold text-lg text-blue-600">{employee.inProgress || 0}</div>
                          <div className="text-gray-600">In Progress</div>
                        </div>
                      </div>
                    </div>
                    {user.role !== "manager" && <Button className="w-full mt-4" onClick={() => handleOpenModal(employee)}>
                      Action
                    </Button>}
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
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Employee Status</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 mb-4">
              Choose an action for <strong>{selectedEmployee?.firstName} {selectedEmployee?.lastName}</strong>.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => handleAction("active")} disabled={actionLoading || selectedEmployee?.status === "active"}>Activate</Button>
              <Button onClick={() => handleAction("inactive")} disabled={actionLoading || selectedEmployee?.status === "inactive"} variant="secondary">Deactivate</Button>
              <Button onClick={() => handleAction("suspended")} disabled={actionLoading || selectedEmployee?.status === "suspended"} variant="destructive">Suspend</Button>
              <Button onClick={() => handleAction("terminated")} disabled={actionLoading || selectedEmployee?.status === "terminated"} variant="destructive">Terminate</Button>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default EmployeeData;

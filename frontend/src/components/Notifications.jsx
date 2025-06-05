"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  ArrowLeft,
  Filter,
  Trash2,
  Settings,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { BASE_URL } from "@/utils/constants"
import { addNotifications, updateNotification } from "@/utils/notificationSlice"

const Notifications = () => {
  const notifications = useSelector((store) => store.notifications)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [markingAsRead, setMarkingAsRead] = useState(new Set())

  const getNotifications = async () => {
    try {
      setLoading(true)
      setError("")
      const res = await axios.get(BASE_URL + "/notifications", { withCredentials: true })
      dispatch(addNotifications(res.data))
    } catch (err) {
      console.error("Error fetching notifications:", err)
      setError("Failed to fetch notifications. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const updateNoti = async (id) => {
    try {
      setMarkingAsRead((prev) => new Set([...prev, id]))
      const res = await axios.put(BASE_URL + `/notification/read/${id}`, {}, { withCredentials: true })
      dispatch(updateNotification(res.data))
    } catch (err) {
      console.error("Error updating notification:", err)
    } finally {
      setMarkingAsRead((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const markAllAsRead = async () => {
    try {
      setLoading(true)
      const unreadNotifications = notifications.filter((n) => !n.isRead)
      await Promise.all(unreadNotifications.map((n) => updateNoti(n._id)))
    } catch (err) {
      console.error("Error marking all as read:", err)
    } finally {
      setLoading(false)
    }
  }

  // Format date to human readable format
  const formatDate = (dateString) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return "Just now"
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  // Get notification icon based on type or content
  const getNotificationIcon = (notification) => {
    const message = notification.message?.toLowerCase() || ""

    if (message.includes("assigned") || message.includes("assign")) {
      return <CheckCircle className="h-5 w-5 text-blue-600" />
    } else if (message.includes("resolved") || message.includes("completed")) {
      return <CheckCheck className="h-5 w-5 text-green-600" />
    } else if (message.includes("escalated") || message.includes("urgent")) {
      return <AlertCircle className="h-5 w-5 text-red-600" />
    } else if (message.includes("updated") || message.includes("changed")) {
      return <Info className="h-5 w-5 text-yellow-600" />
    } else {
      return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  // Get notification priority color
  const getNotificationColor = (notification) => {
    const message = notification.message?.toLowerCase() || ""

    if (message.includes("escalated") || message.includes("urgent") || message.includes("critical")) {
      return "border-l-red-500 bg-red-50"
    } else if (message.includes("assigned") || message.includes("updated")) {
      return "border-l-blue-500 bg-blue-50"
    } else if (message.includes("resolved") || message.includes("completed")) {
      return "border-l-green-500 bg-green-50"
    } else {
      return "border-l-gray-300 bg-gray-50"
    }
  }

  useEffect(() => {
    getNotifications()
  }, [])

  // Auto-mark unread notifications as read when component mounts
  useEffect(() => {
    const unreadNotifications = notifications.filter((n) => !n.isRead)
    unreadNotifications.forEach((notification) => {
      if (!markingAsRead.has(notification._id)) {
        updateNoti(notification._id)
      }
    })
  }, [notifications])

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead
    if (filter === "read") return notification.isRead
    return true
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading && !notifications.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Loading Notifications</h3>
            <p className="text-gray-600">Fetching your latest notifications...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => window.history.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">Stay updated with your latest activities and updates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="px-2 py-1">
                  {unreadCount} unread
                </Badge>
              )}
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

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                    <SelectItem value="read">Read Only</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600">
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={loading}>
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={getNotifications} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Refreshing...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </Button>
             
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification._id}
                className={`transition-all duration-200 hover:shadow-md border-l-4 ${
                  !notification.isRead ? getNotificationColor(notification) : "border-l-gray-200 bg-white"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Notification Icon */}
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification)}</div>

                    {/* Notification Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p
                            className={`text-sm leading-relaxed ${
                              !notification.isRead ? "font-medium text-gray-900" : "text-gray-700"
                            }`}
                          >
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs px-2 py-0">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateNoti(notification._id)}
                              disabled={markingAsRead.has(notification._id)}
                            >
                              {markingAsRead.has(notification._id) ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600"></div>
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Info className="mr-2 h-3 w-3" />
                                View Details
                              </DropdownMenuItem>
                             
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === "unread"
                  ? "No Unread Notifications"
                  : filter === "read"
                    ? "No Read Notifications"
                    : "No Notifications"}
              </h3>
              <p className="text-gray-600 mb-4">
                {filter === "unread"
                  ? "You're all caught up! No new notifications to review."
                  : filter === "read"
                    ? "No notifications have been read yet."
                    : "You don't have any notifications at the moment."}
              </p>
              {filter !== "all" && (
                <Button variant="outline" onClick={() => setFilter("all")}>
                  View All Notifications
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Summary Footer */}
        {filteredNotifications.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Showing {filteredNotifications.length} of {notifications.length} notifications
                </div>
                <div className="flex items-center gap-4">
                  <span>{notifications.filter((n) => n.isRead).length} read</span>
                  <span>{unreadCount} unread</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Notifications

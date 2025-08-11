import { useDispatch, useSelector } from "react-redux"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { addSuperAdminComplaint } from "@/utils/superAdminComplaintsSlice"
import axios from "axios"
import { BASE_URL } from "@/utils/constants"
import { useEffect } from "react"

const getPriorityColor = (priority) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800"
    case "high":
      return "bg-orange-100 text-orange-800"
    case "medium":
      return "bg-yellow-100 text-yellow-800"
    case "low":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const CriticalComplaintsPreview = () => {
  const complaints = useSelector((store) => store.superAdminComplaints)
    const dispatch = useDispatch()
    const navigate = useNavigate()
  const criticalComplaints = complaints
    .filter((c) => c.critical === true)
    .slice(0, 3)
    const fetchComplaints = async () =>{
        try{
          const res =  await axios.get (BASE_URL + "/superadmin/complaints", {withCredentials: true});
            dispatch(addSuperAdminComplaint(res.data));
        }
        catch(err){
                console.error("Error fetching complaints:", err);
        }
      }
      const handleComplaint = (complaint)=>{
        navigate(`/superadmin/complaint/${complaint._id}`, {state: {complaint}})
       }
       useEffect(()=>{
        if(complaints.length === 0)
              fetchComplaints();
           },[])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Complaints</CardTitle>
        <CardDescription>Top 3 most urgent complaints</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criticalComplaints.length > 0 ? (
              criticalComplaints.map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>{complaint?.complaintId}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {complaint.title}
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Critical
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(complaint.priority)}>{complaint.priority}</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No critical complaints found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 text-right">
          <Link to="/superadmin/complaints" className="text-blue-600 hover:underline">
            View All Complaints →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default CriticalComplaintsPreview

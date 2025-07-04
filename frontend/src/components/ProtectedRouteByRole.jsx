import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const ProtectedRouteByRole = ({ allowedRoles, children }) => {
  const user = useSelector((store) => store.user);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      // Redirect based on current user role
      if (user.role === "employee") {
        navigate("/employee/dashboard");
      } else if (user.role === "manager") {
        navigate("/manager/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      }else if (user.role === "superadmin") {
        navigate("/superadmin/dashboard");
      }
      else {
        navigate(-1); // fallback to previous page
      }
    }
  }, [user]);

  // Show loading while user is not yet loaded
  if (!user) return <div className="justify-center items-center flex flex-col h-screen">
    <Loader2 className=" h-8 w-8 animate-spin text-blue-500" />
  </div>;

  // If role is allowed, render the children (protected route)
  return allowedRoles.includes(user.role) ? children : null;
};

export default ProtectedRouteByRole;

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}) {

  const { user, isAuthenticated, loading } = useAuth();


  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  }


  if (!isAuthenticated) {

    return (
      <Navigate 
        to="/login" 
        replace 
      />
    );

  }


  // Role check only when allowedRoles is provided

  if (
    allowedRoles &&
    !allowedRoles.includes(user?.role)
  ) {

    return (
      <Navigate
        to="/home"
        replace
      />
    );

  }


  return children;

}
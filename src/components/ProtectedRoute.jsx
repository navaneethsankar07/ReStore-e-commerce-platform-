import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({children}){
   const { currentUser, loading } = useSelector((state) => state.auth);
    
  if (loading) {
    return <p className="text-center mt-10 text-lg">Checking authentication...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute
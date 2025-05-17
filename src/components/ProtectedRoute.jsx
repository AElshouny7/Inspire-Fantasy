import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ userId, children }) => {
  if (!userId) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;

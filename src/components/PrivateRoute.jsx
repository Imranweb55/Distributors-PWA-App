// FILE: src/components/PrivateRoute.jsx
// NEW FILE — Distributors-PWA-App
import { Navigate } from "react-router-dom";
import { useDistributorAuth } from "../context/DistributorAuthContext";

export default function PrivateRoute({ children }) {
  const { token } = useDistributorAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
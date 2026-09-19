// FILE: src/App.jsx
// NEW FILE — Distributors-PWA-App
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DistributorAuthProvider } from "./context/DistributorAuthContext";
import PrivateRoute from "./components/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MyCustomersPage from "./pages/MyCustomersPage";
import RequestBatterPage from "./pages/RequestBatterPage";

export default function App() {
  return (
    <BrowserRouter>
      <DistributorAuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/customers" element={<PrivateRoute><MyCustomersPage /></PrivateRoute>} />
          <Route path="/request-batter" element={<PrivateRoute><RequestBatterPage /></PrivateRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DistributorAuthProvider>
    </BrowserRouter>
  );
}
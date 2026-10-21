import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import StudentDashboard from "../pages/StudentDashboard";
import WardenDashboard from "../pages/WardenDashboard";
import SecurityDashboard from "../pages/SecurityDashboard";
import Error from "../pages/Error";
import ProtectedRoute from "./ProtectedRoutes.tsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />

      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<WardenDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["security"]} />}>
        <Route path="/security/dashboard" element={<SecurityDashboard />} />
      </Route>

      <Route path="/error" element={<Error />} />
      <Route path="*" element={<Navigate to="/error" replace />} />
    </Routes>
  );
}

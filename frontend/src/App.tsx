import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Splash from "./pages/Splash";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AppRoutes() {
  const { isAuthenticated, user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated && user ? <DashBoard user={user} onLogout={logout} /> : <Navigate to="/login" replace />}
      />
      <Route path="/splash" element={<Splash />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App

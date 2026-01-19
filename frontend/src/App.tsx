import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/DashBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import type { User } from "./types/models";
import { ToastProvider } from "./contexts/ToastContext";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleRegisterSuccess = () => {
    // Registration successful, stay on register page or navigate to login
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <ToastProvider>
      <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            currentUser ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/register"
          element={
            currentUser ? <Navigate to="/dashboard" replace /> : <Register onRegisterSuccess={handleRegisterSuccess} />
          }
        />
        <Route
          path="/dashboard"
          element={
            currentUser ? <Dashboard user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  )
}

export default App

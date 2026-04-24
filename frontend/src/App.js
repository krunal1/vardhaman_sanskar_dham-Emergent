import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "./components/ui/sonner";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DonatePage from "./pages/DonatePage";
import ActivitiesPage from "./pages/ActivitiesPage";
import ActivityDetailPage from "./pages/ActivityDetailPage";
import TapovanPage from "./pages/TapovaPage";
import GurudevPage from "./pages/GurudevPage";
import MediaPage from "./pages/MediaPage";
import UpdateDetailPage from "./pages/UpdateDetailPage";
import EventDetailPage from "./pages/EventDetailPage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return user ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donate" element={<DonatePage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:slug" element={<ActivityDetailPage />} />
            <Route path="/updates/:id" element={<UpdateDetailPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/tapovan" element={<TapovanPage />} />
            <Route path="/gurudev" element={<GurudevPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}

export default App;

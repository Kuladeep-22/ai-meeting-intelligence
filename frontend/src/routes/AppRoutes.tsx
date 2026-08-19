import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Meetings from "../pages/Meetings";
import MeetingDetails from "../pages/MeetingDetails";
import Decisions from "../pages/Decisions";
import Risks from "../pages/Risks";
import Analytics from "../pages/Analytics";
import TeamManagement from "../pages/TeamManagement";
import Settings from "../pages/Settings";
import Chats from "../pages/Chats";
import AiAssistant from "../pages/AiAssistant";

import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

const AppRoutes = () => {
  return (
      <Routes>

        {/* Authentication */}

        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />

        {/* Protected Pages */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Chats />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Meetings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MeetingDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/decisions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Decisions />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/risks"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Risks />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Analytics />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TeamManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Settings />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/assistant"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AiAssistant />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Chats />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
  );
};

export default AppRoutes;
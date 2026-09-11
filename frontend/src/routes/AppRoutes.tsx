import { Routes, Route, Navigate, useParams } from "react-router-dom";

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

import MeetingRoom from "../components/meetings/room/MeetingRoom";

// ============================================================
// Meeting Room Wrapper
// ============================================================

const MeetingRoomWrapper = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid meeting ID</div>;
  }

  return (
    <MeetingRoom
      meetingId={id}
      onLeave={() => {
        window.location.href = "/meetings";
      }}
    />
  );
};


// ============================================================
// App Routes
// ============================================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* ======================================================
          AUTHENTICATION
      ======================================================= */}

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


      {/* ======================================================
          MAIN PAGE
      ======================================================= */}

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


      {/* ======================================================
          DASHBOARD
      ======================================================= */}

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


      {/* ======================================================
          MEETINGS
      ======================================================= */}

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


      {/* ======================================================
          MEETING DETAILS
      ======================================================= */}

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


      {/* ======================================================
          MEETING ROOM
          
          IMPORTANT:
          MeetingCard navigates to:
          
          /meetings/:id/room
          
          So this route MUST use the same path.
      ======================================================= */}

      <Route
        path="/meetings/:id/room"
        element={
          <ProtectedRoute>
            <MeetingRoomWrapper />
          </ProtectedRoute>
        }
      />


      {/* ======================================================
          DECISIONS
      ======================================================= */}

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


      {/* ======================================================
          RISKS
      ======================================================= */}

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


      {/* ======================================================
          ANALYTICS
      ======================================================= */}

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


      {/* ======================================================
          TEAMS
      ======================================================= */}

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


      {/* ======================================================
          SETTINGS
      ======================================================= */}

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


      {/* ======================================================
          AI ASSISTANT
      ======================================================= */}

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


      {/* ======================================================
          CHATS
      ======================================================= */}

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


      {/* ======================================================
          UNKNOWN ROUTES
      ======================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
};

export default AppRoutes;

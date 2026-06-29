import React, { useEffect } from "react";
import connection from "./services/signalRService";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllTasks from "./pages/AllTasks";
import Projects from "./pages/Projects";
import Kanban from "./pages/Kanban";
import AboutMe from "./pages/AboutMe";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Users from "./pages/Users";
import SignUp from "./pages/SignUp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as signalR from "@microsoft/signalr";

function App() {

  useEffect(() => {

    const appHandler = (title: string, message: string) => {

      console.log("📩 Notification:", title, message);

      toast.info(`${title} - ${message}`, {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });

    };

    connection.on("ReceiveNotification", appHandler);

    if (connection.state === signalR.HubConnectionState.Disconnected) {
      connection
        .start()
        .then(() => {
          console.log("✅ Connected to SignalR");
        })
        .catch(console.error);
    }

    return () => {
      connection.off("ReceiveNotification", appHandler);
    };

  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>

          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <Kanban />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <AllTasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutMe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Navigate to="/login" />} />

        </Routes>

      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />

    </AuthProvider>
  );
}

export default App;
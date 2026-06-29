import React, { useEffect, useState } from "react";
import { getRecentAuditLogs } from "../../services/auditLogService";
import connection from "../../services/signalRService";
import * as signalR from "@microsoft/signalr";

const NotificationBell = () => {

  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
 useEffect(() => {

  const loadNotifications = () => {
    

    getRecentAuditLogs()
      .then((logs) => {
        setNotifications(logs);
      })
      .catch(console.error);

  };

  // Initial load
  loadNotifications();
  if (connection.state === signalR.HubConnectionState.Disconnected) {
  connection
    .start()
    .then(async () => {
      console.log("✅ SignalR Connected");

      await connection.invoke("Ping");

      console.log("✅ Ping sent");
    })
    .catch(console.error);
}

  // Listen for SignalR notifications
  const handler = () => {
    console.log("🔔 SignalR received. Reloading notifications...");
    loadNotifications();
  };

  connection.on("ReceiveNotification", handler);

  return () => {
    connection.off("ReceiveNotification", handler);
  };

}, []);
const getIcon = (action: string, entity: string) => {

  if (entity === "Task") {
    if (action.includes("Created")) return "📋";
    if (action.includes("Updated")) return "✏️";
    if (action.includes("Deleted")) return "🗑️";
  }

  if (entity === "Project") {
    if (action.includes("Created")) return "📁";
    if (action.includes("Updated")) return "📝";
    if (action.includes("Deleted")) return "❌";
  }

  if (entity === "User") {
    return "👤";
  }

  return "🔔";
};

const getTimeAgo = (date: string) => {

  const now = new Date().getTime();
  const created = new Date(date).getTime();

  const diff = Math.floor((now - created) / 1000);

  if (diff < 60)
    return "Just now";

  if (diff < 3600)
    return `${Math.floor(diff / 60)} min ago`;

  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour(s) ago`;

  return `${Math.floor(diff / 86400)} day(s) ago`;
};

  return (
    <div style={{ position: "relative" }}>

      <button
        onClick={() => setOpen(!open)}
        style={{
          width: 45,
          height: 45,
          borderRadius: "50%",
          border: "none",
          background: "#fff",
          cursor: "pointer",
          fontSize: 22,
          position: "relative",
          boxShadow: "0 8px 20px rgba(0,0,0,.08)"
        }}
      >
        🔔

        <span
          style={{
            position: "absolute",
            top: -4,
            right: -2,
            background: "#ef4444",
            color: "#fff",
            width: 20,
            height: 20,
            borderRadius: "50%",
            fontSize: 11,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {notifications.length}
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 55,
            width: 320,
            background: "#fff",
            borderRadius: 15,
            boxShadow: "0 20px 40px rgba(0,0,0,.12)",
            overflow: "hidden",
            zIndex: 999
          }}
        >
          <div
            style={{
              padding: 18,
              fontWeight: 700,
              borderBottom: "1px solid #eee"
            }}
          >
            🔔 Notifications
          </div>

          {notifications.length === 0 ? (
            <div style={{ padding: 20, textAlign: "center" }}>
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.logId}
                style={{
                  padding: 16,
                  borderBottom: "1px solid #f3f4f6"
                }}
              >
                <div style={{ fontWeight: 600 }}>{getIcon(n.action, n.entityName)}{n.action}</div>
                <div style={{ color: "#64748b", marginTop: 4 }}>
                  {n.newValue}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginTop: 6
                  }}
                >
                  {getTimeAgo(n.changedAt)}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default NotificationBell;
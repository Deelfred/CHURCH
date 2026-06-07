import { useEffect, useState } from "react";
import { X, Bell, UserPlus, AlertCircle } from "lucide-react";

function NotificationCenter({ socket }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for attendance notifications
    socket.on("admin-notification", (notification) => {
      console.log("🔔 Notification:", notification);

      const newNotif = {
        id: Date.now(),
        ...notification,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotif.id)
        );
      }, 5000);
    });

    // Listen for member activity notifications
    socket.on("member-activity", (data) => {
      console.log("📝 Member Activity Notification:", data);

      const newNotif = {
        id: Date.now(),
        type: "MEMBER_ACTIVITY",
        title: `Member ${data.action}ed`,
        message: data.description,
        data: data,
      };

      setNotifications((prev) => [newNotif, ...prev]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotif.id)
        );
      }, 5000);
    });

    return () => {
      socket.off("admin-notification");
      socket.off("member-activity");
    };
  }, [socket]);

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "ATTENDANCE":
        return (
          <div className="bg-blue-600 p-2 rounded-lg">
            <UserPlus className="text-white" size={20} />
          </div>
        );
      case "MEMBER_ACTIVITY":
        return (
          <div className="bg-purple-600 p-2 rounded-lg">
            <AlertCircle className="text-white" size={20} />
          </div>
        );
      default:
        return (
          <div className="bg-zinc-600 p-2 rounded-lg">
            <Bell className="text-white" size={20} />
          </div>
        );
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "ATTENDANCE":
        return "border-blue-600/30 bg-blue-600/10";
      case "MEMBER_ACTIVITY":
        return "border-purple-600/30 bg-purple-600/10";
      default:
        return "border-zinc-600/30 bg-zinc-600/10";
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`border rounded-xl p-4 backdrop-blur-lg animate-in slide-in-from-top-2 ${getNotificationColor(
            notif.type
          )}`}
        >
          <div className="flex items-start gap-3">
            {getNotificationIcon(notif.type)}

            <div className="flex-1">
              <h4 className="font-semibold text-white">
                {notif.title}
              </h4>
              <p className="text-sm text-zinc-300 mt-1">
                {notif.message}
              </p>
            </div>

            <button
              onClick={() =>
                removeNotification(notif.id)
              }
              className="text-zinc-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationCenter;

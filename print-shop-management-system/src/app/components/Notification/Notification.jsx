"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "info",
    title: "Order ORD-003 is overdue",
    message: "Sports Club order is 2 days overdue and needs immediate attention",
    timestamp: "5 minutes ago",
    read: false,
    orderId: "ORD-003",
    customer: "Sports Club",
  },
  {
    id: 2,
    type: "info",
    title: "New comment on ORD-001",
    message: "John Smith added a comment: 'Logo looks great! Please proceed with embroidery.'",
    timestamp: "15 minutes ago",
    read: false,
    orderId: "ORD-001",
    customer: "John Smith",
  },
  {
    id: 3,
    type: "success",
    title: "Order ORD-004 completed",
    message: "Local Restaurant order has been completed and is ready for pickup",
    timestamp: "1 hour ago",
    read: true,
    orderId: "ORD-004",
    customer: "Local Restaurant",
  },
  {
    id: 4,
    type: "warning",
    title: "Machine maintenance required",
    message: "DTF Printer 1 requires scheduled maintenance within 24 hours",
    timestamp: "2 hours ago",
    read: false,
    equipment: "DTF Printer 1",
  },
  {
    id: 5,
    type: "info",
    title: "New order received",
    message: "New order ORD-013 received from Fashion Brand for 50 DTF prints",
    timestamp: "3 hours ago",
    read: true,
    orderId: "ORD-013",
    customer: "Fashion Brand",
  },
];

const getNotificationIcon = (type) => {
  switch (type) {
    case "warning": return "⏰";
    case "success": return "✅";
    case "info": return "🔔";
    default: return "🔔";
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case "warning": return "border-orange-200 bg-orange-50";
    case "success": return "border-green-200 bg-green-50";
    case "info": return "border-blue-200 bg-blue-50";
    default: return "border-gray-200 bg-gray-50";
  }
};

export default function Notification() {
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    toast.success("Notification marked as read");
  };

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-[#111928]">Total Notifications</h3>
          </div>
          <div className="text-[18px] font-medium text-[#111928]">{notifications.length}</div>
          <p className="text-xs text-[#9ca3af]">All notifications</p>
        </div>

        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-[#111928]">Unread</h3>
          </div>
          <div className="text-[18px] font-medium text-[#111928]">{unreadCount}</div>
          <p className="text-xs text-[#9ca3af]">Need attention</p>
        </div>

        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-[#111928]">Info</h3>
          </div>
          <div className="text-[18px] font-medium text-[#111928]">{notifications.filter((n) => n.type === "info").length}</div>
          <p className="text-xs text-[#9ca3af]">Information updates</p>
        </div>

        <div className="bg-white p-8 rounded-lg border-[1px] border-[#e5e7eb]">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-[#111928]">Completed</h3>
          </div>
          <div className="text-[18px] font-medium text-[#111928]">{notifications.filter((n) => n.type === "success").length}</div>
          <p className="text-xs text-[#9ca3af]">Good news</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex space-x-4 mb-4 bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-[16px] ${filter === "all" ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-[16px] ${filter === "unread" ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("info")}
            className={`px-4 py-2 rounded-lg text-[16px] ${filter === "info" ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            Info ({notifications.filter((n) => n.type === "info").length})
          </button>
        </div>

        <div className="bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
          <div className="mb-2">
            <h3 className="text-md font-medium text-[#111928]">Notifications</h3>
            <p className="text-sm text-[#9ca3af]">
              {filter === "all" && "All notifications"}
              {filter === "unread" && "Unread notifications"}
              {filter === "info" && "Information and updates"}
            </p>
          </div>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border-l-4 ${getNotificationColor(notification.type)} ${
                  !notification.read ? "border-l-4" : "opacity-75"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3 flex-1">
                    <span>{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-[#111928]">{notification.title}</h4>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                      </div>
                      <p className="text-sm text-[#9ca3af] mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-[#9ca3af]">
                        <span>{notification.timestamp}</span>
                        {notification.orderId && (
                          <span className="border border-[#e5e7eb] px-2 py-1 rounded-lg">Order: {notification.orderId}</span>
                        )}
                        {notification.customer && <span>Customer: {notification.customer}</span>}
                        {notification.equipment && <span>Equipment: {notification.equipment}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="px-2 py-1 bg-[#5750f1] text-white rounded-lg text-xs hover:bg-blue-700 transition"
                      >
                        Mark Read
                      </button>
                    )}
                    {notification.orderId && (
                      <button
                        className="px-2 py-1 border border-[#e5e7eb] rounded-lg text-xs text-[#2563eb] hover:text-blue-700"
                      >
                        View Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <div className="text-center py-4">
                <span className="text-2xl">🔔</span>
                <p className="text-sm text-[#9ca3af]">No notifications found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
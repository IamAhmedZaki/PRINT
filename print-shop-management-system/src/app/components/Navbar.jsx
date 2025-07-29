"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "info",
    title: "Order ORD-003 is overdue",
    message: "Sports Club order is 2 days overdue.",
    timestamp: "5 minutes ago",
    read: false,
    orderId: "ORD-003",
    customer: "Sports Club",
  },
  {
    id: 2,
    type: "info",
    title: "New comment on ORD-001",
    message: "John Smith commented on the design.",
    timestamp: "15 minutes ago",
    read: false,
    orderId: "ORD-001",
    customer: "John Smith",
  },
  {
    id: 3,
    type: "success",
    title: "Order ORD-004 completed",
    message: "Local Restaurant order is ready.",
    timestamp: "1 hour ago",
    read: true,
    orderId: "ORD-004",
    customer: "Local Restaurant",
  },
  {
    id: 4,
    type: "warning",
    title: "Machine maintenance required",
    message: "DTF Printer 1 needs maintenance.",
    timestamp: "2 hours ago",
    read: false,
    equipment: "DTF Printer 1",
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

export default function Navbar({ toggleSidebar }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.email) {
        setEmail(decoded.email);
      }
    }
  }, []);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = atob(base64);
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (!isProfileDropdownOpen) setIsNotificationOpen(false); // Close notification if opening profile
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) setIsProfileDropdownOpen(false); // Close profile if opening notification
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    toast.success("Notification marked as read");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
    <div className="fixed top-0 left-0 lg:left-[290px] right-0 bg-white flex items-center justify-between px-4 z-10 py-7 border-b-[2px] border-[#e5e7eb] md:px-5 2xl:px-10">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-600 hover:text-[#5750f1]"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <h2 className="text-[28px] font-bold text-[#111928]">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={toggleNotification}
            className="text-gray-600 hover:text-[#5750f1] bg-gray-100 w-[50px] h-[50px] rounded-full flex items-center justify-center border-[#e5e7eb] border-[1px] relative"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-[350px] bg-white rounded-lg shadow-lg border-[1px] border-[#e5e7eb] p-4 z-20">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 rounded-lg border-l-4 ${getNotificationColor(
                      notification.type
                    )} ${!notification.read ? "border-l-4" : "opacity-75"}`}
                  >
                    <div className="flex flex-col justify-between items-start gap-3">
                      <div className="flex items-start space-x-2 flex-1">
                        <span>{getNotificationIcon(notification.type)}</span>
                        <div>
                          <h4 className="font-medium text-[#111928] text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-[#9ca3af]">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[#9ca3af] mt-1">
                            {notification.timestamp}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-2 py-1 bg-[#5750f1] text-white rounded text-xs hover:bg-blue-700 transition"
                          >
                            Mark Read
                          </button>
                        )}
                        {notification.orderId && (
                          <button
                            className="px-2 py-1 border border-[#e5e7eb] rounded text-xs text-[#2563eb] hover:text-blue-700"
                          >
                            View Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-2">
                    <span className="text-xl">🔔</span>
                    <p className="text-sm text-[#9ca3af]">No notifications</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleProfileDropdown}
            className="text-gray-600 hover:text-[#5750f1] bg-gray-100 w-[50px] h-[50px] rounded-full flex items-center justify-center border-[#e5e7eb] border-[1px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-user h-4 w-4"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2">
              <div className="block px-4 py-2 text-gray-700 border-[#e5e7eb] border-b-[1px] mb-2">
                {email || "No email"}
              </div>
              <Link
                href="/dashboard/user-management"
                className="block px-4 py-2 text-gray-700 hover:bg-[rgba(87,80,241,0.07)] hover:text-[#5750f1]"
              >
                User Management
              </Link>
              <button
                onClick={() => {
                  sessionStorage.removeItem("authToken");
                  window.location.href = "/auth/login";
                }}
                className="w-full block px-4 py-2 text-gray-700 hover:bg-[rgba(87,80,241,0.07)] hover:text-[#5750f1] text-left cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <ToastContainer />
    </>
  );
}
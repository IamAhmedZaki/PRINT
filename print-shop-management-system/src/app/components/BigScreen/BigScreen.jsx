"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit } from "react-icons/fa";

// Mock data (replace with API call in production)
const kanbanData = {
  design: [
    { id: "ORD-001", customer: "John Smith", service: "Embroidery", quantity: 50, dueDate: "2025-01-20", daysLeft: 3, isOverdue: false },
    { id: "ORD-003", customer: "Corporate Events", service: "Sublimation", quantity: 100, dueDate: "2025-01-18", daysLeft: 1, isOverdue: true },
  ],
  production: [
    { id: "ORD-002", customer: "ABC Sports", service: "DTF", quantity: 25, dueDate: "2025-01-22", daysLeft: 5, isOverdue: false },
    { id: "ORD-005", customer: "Tech Startup", service: "DTF", quantity: 75, dueDate: "2025-01-21", daysLeft: 4, isOverdue: false },
  ],
  ready: [
    { id: "ORD-004", customer: "Local Restaurant", service: "Embroidery", quantity: 15, dueDate: "2025-01-25", daysLeft: 8, isOverdue: false },
  ],
  shipping: [
    { id: "ORD-006", customer: "Global Corp", service: "Sublimation", quantity: 200, dueDate: "2025-01-28", daysLeft: 11, isOverdue: false },
  ],
  completed: [
    { id: "ORD-007", customer: "Retail Chain", service: "Embroidery", quantity: 120, dueDate: "2025-01-15", daysLeft: 0, isOverdue: false },
  ],
};

const teamFilters = [
  { id: "all", name: "All Teams", icon: "📺" },
  { id: "design", name: "Design Team", icon: "🎨" },
  { id: "embroidery", name: "Embroidery", icon: "🖨️" },
  { id: "dtf", name: "DTF Team", icon: "⚡" },
  { id: "production", name: "Production", icon: "✅" },
  { id: "shipping", name: "Shipping", icon: "🚚" },
];

export default function BigScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [activeTab, setActiveTab] = useState("design");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getServiceIcon = (service) => {
    switch (service) {
      case "Embroidery": return "🖨️";
      case "DTF": return "⚡";
      case "Sublimation": return "🎨";
      default: return "📺";
    }
  };

  const filterOrdersByTeam = (orders) => {
    if (selectedTeam === "all") return orders;
    return orders.filter((order) => {
      switch (selectedTeam) {
        case "design": return ["Embroidery", "Sublimation", "DTF"].includes(order.service);
        case "embroidery": return order.service === "Embroidery";
        case "dtf": return order.service === "DTF";
        case "production": return ["Embroidery", "Sublimation", "DTF"].includes(order.service);
        case "shipping": return ["Embroidery", "Sublimation", "DTF"].includes(order.service);
        default: return true;
      }
    });
  };

  const filteredDesignOrders = filterOrdersByTeam(kanbanData.design);
  const filteredProductionOrders = filterOrdersByTeam(kanbanData.production);
  const filteredReadyOrders = filterOrdersByTeam(kanbanData.ready);
  const filteredShippingOrders = filterOrdersByTeam(kanbanData.shipping);
  const filteredCompletedOrders = filterOrdersByTeam(kanbanData.completed);

  return (
    <div className="bg-white p-8 rounded-lg w-full border-[1px] border-[#e5e7eb]">
      {/* Header */}
      <div className="flex justify-end items-center mb-8">
        <div className="text-right">
          <div className="text-[18px] font-medium text-gray-800">{currentTime.toLocaleTimeString("en-PK", { hour12: true })}</div>
          <div className="text-[14px] text-[#9ca3af]">{currentTime.toLocaleDateString("en-PK")}</div>
        </div>
      </div>

      {/* Team Filter Buttons */}
      <div className="flex space-x-4 mb-8">
        {teamFilters.map((team) => (
          <button
            key={team.id}
            onClick={() => setSelectedTeam(team.id)}
            className={`px-4 py-2 rounded-lg text-[16px] ${selectedTeam === team.id ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            {team.icon} {team.name}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="mb-8">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setActiveTab("design")}
            className={`px-4 py-2 rounded-lg text-[16px] ${activeTab === "design" ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            Design ({filteredDesignOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("production")}
            className={`px-4 py-2 rounded-lg text-[16px] ${activeTab === "production" ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            Production ({filteredProductionOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("ready")}
            className={`px-4 py-2 rounded-lg text-[16px] ${activeTab === "ready" ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            Ready ({filteredReadyOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-4 py-2 rounded-lg text-[16px] ${activeTab === "shipping" ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            Shipping ({filteredShippingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 rounded-lg text-[16px] ${activeTab === "completed" ? "bg-[#5750f1] text-white" : "bg-gray-200 text-gray-700"} hover:bg-blue-700 hover:text-white transition`}
          >
            Completed ({filteredCompletedOrders.length})
          </button>
        </div>

        {activeTab === "design" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDesignOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg border border-[#e5e7eb]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-[#111928]">{order.id}</h3>
                  {order.isOverdue && <span className="text-red-500">⚠️</span>}
                </div>
                <p className="text-sm text-[#9ca3af] mb-2">{order.customer}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span>{getServiceIcon(order.service)}</span>
                  <span className="text-sm text-[#111928]">{order.service}</span>
                  <span className="text-xs text-[#9ca3af] border border-[#e5e7eb] px-2 py-1 rounded-lg">Qty: {order.quantity}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-1">
                    <span>⏰</span>
                    <span className={order.isOverdue ? "text-red-600 font-bold" : "text-[#111928]"}>{order.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "production" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProductionOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg border border-[#e5e7eb]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-[#111928]">{order.id}</h3>
                  {order.isOverdue && <span className="text-red-500">⚠️</span>}
                </div>
                <p className="text-sm text-[#9ca3af] mb-2">{order.customer}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span>{getServiceIcon(order.service)}</span>
                  <span className="text-sm text-[#111928]">{order.service}</span>
                  <span className="text-xs text-[#9ca3af] border border-[#e5e7eb] px-2 py-1 rounded-lg">Qty: {order.quantity}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-1">
                    <span>⏰</span>
                    <span className={order.isOverdue ? "text-red-600 font-bold" : "text-[#111928]"}>{order.daysLeft} days left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ready" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredReadyOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg border border-[#e5e7eb]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-[#111928]">{order.id}</h3>
                  <span className="text-green-500">✅</span>
                </div>
                <p className="text-sm text-[#9ca3af] mb-2">{order.customer}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span>{getServiceIcon(order.service)}</span>
                  <span className="text-sm text-[#111928]">{order.service}</span>
                  <span className="text-xs text-[#9ca3af] border border-[#e5e7eb] px-2 py-1 rounded-lg">Qty: {order.quantity}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-1">
                    <span>⏰</span>
                    <span className="text-[#111928]">{order.daysLeft} days left</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-lg">Ready</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredShippingOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg border border-[#e5e7eb]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-[#111928]">{order.id}</h3>
                  <span className="text-purple-500">📦</span>
                </div>
                <p className="text-sm text-[#9ca3af] mb-2">{order.customer}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span>{getServiceIcon(order.service)}</span>
                  <span className="text-sm text-[#111928]">{order.service}</span>
                  <span className="text-xs text-[#9ca3af] border border-[#e5e7eb] px-2 py-1 rounded-lg">Qty: {order.quantity}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-1">
                    <span>⏰</span>
                    <span className="text-[#111928]">{order.daysLeft} days left</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded-lg">Shipping</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompletedOrders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg border border-[#e5e7eb]">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-medium text-[#111928]">{order.id}</h3>
                  <span className="text-gray-500">✅</span>
                </div>
                <p className="text-sm text-[#9ca3af] mb-2">{order.customer}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span>{getServiceIcon(order.service)}</span>
                  <span className="text-sm text-[#111928]">{order.service}</span>
                  <span className="text-xs text-[#9ca3af] border border-[#e5e7eb] px-2 py-1 rounded-lg">Qty: {order.quantity}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-1">
                    <span>⏰</span>
                    <span className="text-[#111928]">Completed</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-200 text-gray-800 rounded-lg">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-refresh Indicator */}
      <div className="fixed bottom-4 right-4 bg-[#f8fafc] rounded-lg p-3 border border-[#e5e7eb]">
        <div className="flex items-center space-x-2 text-sm text-[#111928]">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Auto-refresh: 30s</span>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
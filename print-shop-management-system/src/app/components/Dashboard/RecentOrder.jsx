"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


function RecentOrder() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerNames, setCustomerNames] = useState({});

  // Fetch orders and customer names
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://printmanager-api.onrender.com/api/orders");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders");
        }
        const data = await response.json();
        const ordersArray = Array.isArray(data) ? data : [];
        // Sort by dueDate and get the 5 most recent
        const recentOrders = ordersArray
          .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))
          .slice(0, 5);
        setOrders(recentOrders);

        // Fetch customer names for each order
        const customerIds = [...new Set(recentOrders.map((order) => order.customerId))];
        const customerPromises = customerIds.map(async (id) => {
          try {
            const res = await fetch(
              `https://printmanager-api.onrender.com/api/customers/${id}`
            );
            if (!res.ok) throw new Error(`Failed to fetch customer ${id}`);
            const customerData = await res.json();
            return { id, name: customerData.name || "N/A" };
          } catch (err) {
            console.error(err);
            return { id, name: "N/A" };
          }
        });
        const customers = await Promise.all(customerPromises);
        const customerMap = customers.reduce((acc, { id, name }) => {
          acc[id] = name;
          return acc;
        }, {});
        setCustomerNames(customerMap);
        setError(null);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Action handlers
  const handleViewOrder = (orderId) => {
    router.push(`/dashboard/order/view/${orderId}`);
  };

  // Status color mapping
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="bg-white rounded-[10px] p-6 border-[1px] border-[#e5e7eb]">
        <div className="flex justify-between">
          <div>
            <h2 className="font-medium text-gray-800 text-[24px]">Recent Orders</h2>
            <p className="text-[18px] text-[#9ca3af] mb-4">
              Latest orders and their current status
            </p>
          </div>
        </div>

      <div className="mt-6">
        <div className="relative w-full overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <svg
                className="animate-spin h-8 w-8 text-[#5750f1]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-[#ef4444] text-lg">
              Error: {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-[#9ca3af] text-lg">
              No Data Found
            </div>
          ) : (
            <table className="w-full caption-bottom text-sm">
              <thead>
                <tr className="border-none bg-[#F7F9FC] py-4 text-base text-[#111928]">
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 min-w-[100px] xl:pl-7.5">
                    Order Number
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                    Customer Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                    Order Title
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                    Order Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                    Delivery Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500">
                    Order Status
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-neutral-500 xl:pr-7.5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#eee] transition-colors hover:bg-neutral-100/50"
                  >
                    <td className="p-4 align-middle min-w-[100px] xl:pl-7.5">
                      <p className="text-[#111928]">{order.orderNumber || "N/A"}</p>
                    </td>
                    <td className="p-4 align-middle">
                      <p className="text-[#111928]">
                        {customerNames[order.customerId] || "N/A"}
                      </p>
                    </td>
                    <td className="p-4 align-middle">
                      <p className="text-[#111928]">{order.title || "N/A"}</p>
                    </td>
                    <td className="p-4 align-middle">
                      <p className="text-[#111928]">
                        {order.startDate
                          ? new Date(order.startDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </td>
                    <td className="p-4 align-middle">
                      <p className="text-[#111928]">
                        {order.dueDate
                          ? new Date(order.dueDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                          order.status
                        )}`}
                      >
                        {order.status || "N/A"}
                      </span>
                    </td>
                    <td className="p-4 align-middle xl:pr-7.5">
                      <div className="relative flex justify-end">
                        <button className="hover:text-[#2563eb]" onClick={() =>  handleViewOrder(order.id)}>
                            <span className="sr-only">View Order</span>
                            <svg
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 6.875a3.125 3.125 0 100 6.25 3.125 3.125 0 000-6.25zM8.123 10a1.875 1.875 0 113.75 0 1.875 1.875 0 01-3.75 0z" />
                                <path d="M10 2.708c-3.762 0-6.296 2.254-7.767 4.164l-.026.035c-.333.432-.64.83-.847 1.3C1.137 8.71 1.04 9.26 1.04 10s.096 1.29.319 1.793c.208.47.514.868.847 1.3l.026.034c1.47 1.911 4.005 4.165 7.766 4.165 3.762 0 6.296-2.254 7.766-4.165l.027-.034c.333-.432.639-.83.847-1.3.222-.504.319-1.053.319-1.793s-.097-1.29-.32-1.793c-.207-.47-.513-.868-.846-1.3l-.027-.035c-1.47-1.91-4.004-4.164-7.766-4.164zM3.223 7.635C4.582 5.87 6.79 3.958 9.999 3.958s5.418 1.913 6.776 3.677c.366.475.58.758.72 1.077.132.298.213.662.213 1.288s-.081.99-.213 1.288c-.14.319-.355.602-.72 1.077-1.358 1.764-3.568 3.677-6.776 3.677-3.208 0-5.417-1.913-6.775-3.677-.366-.475-.58-.758-.72-1.077-.132-.298-.213-.662-.213-1.288s.08-.99.212-1.288c.141-.319.355-.602.72-1.077z" />
                            </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>
      </div>
    </>
  );
}

export default RecentOrder;
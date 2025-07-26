import React from 'react'

const orders = [
  {
    orderNumber: "#ORD001",
    customerName: "John Doe",
    type: "Embroidery",
    status: "In Progress",
    completion: 60,
    dueDate: "2025-07-25",
  },
  {
    orderNumber: "#ORD002",
    customerName: "Jane Smith",
    type: "DTF",
    status: "Pending",
    completion: 20,
    dueDate: "2025-08-01",
  },
  {
    orderNumber: "#ORD003",
    customerName: "Alice Johnson",
    type: "Sublimation",
    status: "Completed",
    completion: 100,
    dueDate: "2025-07-20",
  },
];

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

function RecentOrder() {
    return (
        <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 border-[1px] border-[#e5e7eb] w-full">
            <h2 className="font-medium text-gray-800 text-[24px]">Recent Orders</h2>
            <p className="text-[18px] text-[#9ca3af] mb-4">Latest orders and their current status</p>
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead>
                        <tr className="border-none bg-[#F7F9FC] py-4 text-base text-[#111928]">
                            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 min-w-[100px] xl:pl-7.5">Order Number</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 ">Customer</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 ">Type</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 ">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 ">Progress</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-neutral-500 ">Due Date</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-neutral-500  xl:pr-7.5">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {orders.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b border-[#eee] transition-colors hover:bg-neutral-100/50"
                            >
                                <td className="p-4 align-middle min-w-[100px] xl:pl-7.5">
                                    <h5 className="text-[#111928]">{item.orderNumber}</h5>
                                </td>
                                <td className="p-4 align-middle">
                                    <p className="text-[#111928]">{item.customerName}</p>
                                </td>
                                <td className="p-4 align-middle">
                                    <p className="text-[#111928]">{item.type}</p>
                                </td>
                                <td className="p-4 align-middle">
                                    <div
                                        className={`max-w-fit rounded-full px-3.5 py-1 text-sm font-medium ${item.status === "Completed"
                                                ? "bg-[#219653]/[0.08] text-[#219653]"
                                                : item.status === "Pending"
                                                    ? "bg-[#D34053]/[0.08] text-[#D34053]"
                                                    : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                                            }`}
                                    >
                                        {item.status}
                                    </div>
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2">
                                        <div className="w-[100px] h-2 bg-gray-200 rounded-full">
                                            <div
                                                className="h-2 bg-[#219653] rounded-full"
                                                style={{ width: `${item.completion}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-[#111928]">{item.completion}%</span>
                                    </div>
                                </td>
                                <td className="p-4 align-middle">
                                    <p className="text-[#111928]">
                                        {formatDate(item.dueDate)}
                                    </p>
                                </td>
                                <td className="p-4 align-middle xl:pr-7.5">
                                    <div className="flex items-center justify-end gap-x-3.5">
                                        <button className="hover:text-[#2563eb]">
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
            </div>
        </div>
    )
}

export default RecentOrder
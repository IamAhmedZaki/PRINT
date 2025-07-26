import React from 'react';

// Random data for overdue alerts, without priority
const overdueAlerts = [
  {
    id: "#ORD001",
    customer: "John Doe",
    daysOverdue: 5,
  },
  {
    id: "#ORD002",
    customer: "Jane Smith",
    daysOverdue: 3,
  },
  {
    id: "#ORD003",
    customer: "Alice Johnson",
    daysOverdue: 7,
  },
];

function OverdueAlerts() {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 border-[1px] border-[#e5e7eb]">
      <h2 className="font-medium text-gray-800 text-[24px]">Overdue Alerts</h2>
      <p className="text-[18px] text-[#9ca3af] mb-4">Orders that need immediate attention</p>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-none bg-red-50 py-4 text-base text-[#7f1d1d]">
              <th className="h-12 px-4 text-left align-middle font-medium text-red-600 min-w-[100px] xl:pl-7.5">Order ID</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-red-600">Customer</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-red-600">Days Overdue</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {overdueAlerts.map((alert) => (
              <tr
                key={alert.id}
                className="border-b border-red-200 transition-colors hover:bg-red-100/50"
              >
                <td className="p-4 align-middle min-w-[100px] xl:pl-7.5">
                  <p className="font-medium text-red-900">{alert.id}</p>
                </td>
                <td className="p-4 align-middle">
                  <p className="text-sm text-red-700">{alert.customer}</p>
                </td>
                <td className="p-4 align-middle">
                  <div className="max-w-fit rounded-full px-3.5 py-1 text-xs font-medium text-red-800 border border-red-600 bg-red-50">
                    {alert.daysOverdue} days overdue
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button className="w-full bg-red-600 text-white text-sm font-medium py-[13px] px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
          View All Overdue Orders
        </button>
      </div>
    </div>
  );
}

export default OverdueAlerts;
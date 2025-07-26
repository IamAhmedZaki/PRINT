import React from 'react';

// Random data for workflow stages
const workflowStats = [
  {
    name: "Design",
    count: 25,
    percentage: 60,
    color: "bg-[#3b82f6]",
  },
  {
    name: "Production",
    count: 18,
    percentage: 45,
    color: "bg-[#FFA70B]",
  },
  {
    name: "Ready",
    count: 10,
    percentage: 80,
    color: "bg-[#22c55e]",
  },
  {
    name: "Delivered",
    count: 7,
    percentage: 30,
    color: "bg-[#6b7280]",
  },
];

function WorkflowOverview() {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-[105px] pt-7.5 border-[1px] border-[#e5e7eb]">
      <h2 className="font-medium text-gray-800 text-[24px]">Workflow Overview</h2>
      <p className="text-[18px] text-[#9ca3af] mb-4">Orders by workflow stage</p>
      <div className="space-y-6">
        {workflowStats.map((stage) => (
          <div key={stage.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                <span className="text-sm font-medium text-[#111928]">{stage.name}</span>
              </div>
              <span className="text-sm font-bold text-[#111928]">{stage.count}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className={`h-3 rounded-full ${stage.color}`}
                style={{ width: `${stage.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkflowOverview;
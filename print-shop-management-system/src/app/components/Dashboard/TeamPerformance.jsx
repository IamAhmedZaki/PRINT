import React from 'react';

// Random data for team performance
const teamPerformance = [
  {
    team: "Design Team",
    completed: 42,
    target: 50,
    percentage: 84,
    trend: "Up",
  },
  {
    team: "Production Team",
    completed: 35,
    target: 60,
    percentage: 58,
    trend: "Down",
  },
  {
    team: "Quality Team",
    completed: 28,
    target: 40,
    percentage: 70,
    trend: "Stable",
  },
  {
    team: "Shipping Team",
    completed: 15,
    target: 30,
    percentage: 50,
    trend: "Up",
  },
];

function TeamPerformance() {
  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 border-[1px] border-[#e5e7eb]">
      <h2 className="font-medium text-gray-800 text-[24px]">Team Performance</h2>
      <p className="text-[18px] text-[#9ca3af] mb-4">Weekly completion rates by team</p>
      <div className="space-y-4">
        {teamPerformance.map((team) => (
          <div key={team.team} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#111928]">{team.team}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#9ca3af]">
                  {team.completed}/{team.target}
                </span>
                <div
                  className={`text-xs font-medium px-2 py-0.5 border border-[#e5e7eb] rounded ${
                    team.trend === "Up"
                      ? "text-[#219653] border-[#219653]"
                      : team.trend === "Down"
                      ? "text-[#D34053] border-[#D34053]"
                      : "text-[#FFA70B] border-[#FFA70B]"
                  }`}
                >
                  {team.trend}
                </div>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full">
              <div
                className={`h-3 rounded-full ${
                  team.trend === "Up"
                    ? "bg-[#219653]"
                    : team.trend === "Down"
                    ? "bg-[#D34053]"
                    : "bg-[#FFA70B]"
                }`}
                style={{ width: `${team.percentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-[#9ca3af]">{team.percentage}% completion rate</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamPerformance;
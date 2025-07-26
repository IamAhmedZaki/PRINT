import React from 'react'

function DashboardCard() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">

        <div className="rounded-[10px] bg-white p-6 border-[1px] border-[#e5e7eb]">
          <div className="bg-[#FF9C55] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="#FF9C55" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm2 6h10m-10 4h10"></path>
            </svg>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <dl>
              <dt className="mb-1.5 text-[24px] font-bold text-[#111928]">156</dt>
              <dd className="text-sm font-medium text-[#9ca3af]">Total Orders</dd>
            </dl>
            <dl className="text-sm font-medium text-[#22ad5c]">
              <dt className="flex items-center gap-1.5">+12% <span className="text-[#9ca3af]">from last month</span></dt>
            </dl>
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 border-[1px] border-[#e5e7eb]">
          <div className="bg-[#3FD97F] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="#3FD97F" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <dl>
              <dt className="mb-1.5 text-[24px] font-bold text-[#111928]">56</dt>
              <dd className="text-sm font-medium text-[#9ca3af]">Active Orders</dd>
            </dl>
            <dl className="text-sm font-medium text-[#9ca3af]">
              <dt className="flex items-center gap-1.5">currently in progress</dt>
            </dl>
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 border-[1px] border-[#e5e7eb]">
          <div className="bg-[#8155FF] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="#8155FF" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4a4 4 0 110 8 4 4 0 010-8zm-7 14a3 3 0 013-3h8a3 3 0 013 3v2H5v-2z"></path>
            </svg>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <dl>
              <dt className="mb-1.5 text-[24px] font-bold text-[#111928]">256</dt>
              <dd className="text-sm font-medium text-[#9ca3af]">Total Customers</dd>
            </dl>
            <dl className="text-sm font-medium text-[#22ad5c]">
              <dt className="flex items-center gap-1.5">+15 <span className="text-[#9ca3af]">new this month</span></dt>
            </dl>
          </div>
        </div>

        <div className="rounded-[10px] bg-white p-6 border-[1px] border-[#e5e7eb]">
          <div className="bg-[#ef4444] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="#ef4444" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2zm6 3v6l2 2m-2-8v1"/>
            </svg>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <dl>
              <dt className="mb-1.5 text-[24px] font-bold text-[#111928]">6</dt>
              <dd className="text-sm font-medium text-[#9ca3af]">Overdue Orders</dd>
            </dl>
            <dl className="text-sm font-medium text-[#9ca3af]">
              <dt className="flex items-center gap-1.5">Needs immediate attention</dt>
            </dl>
          </div>
        </div>

    </div>
  )
}

export default DashboardCard
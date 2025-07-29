'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPrint } from "react-icons/fa6";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const mainMenuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1"></rect>
          <rect width="7" height="5" x="14" y="3" rx="1"></rect>
          <rect width="7" height="9" x="14" y="12" rx="1"></rect>
          <rect width="7" height="5" x="3" y="16" rx="1"></rect>
        </svg>
      ),
      href: '/dashboard',
    },
    {
      id: 'customers',
      title: 'Customers',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      dropdown: [
        { title: 'Create Customer', href: '/dashboard/customer/create' },
        { title: 'Customer List', href: '/dashboard/customer/list' },
      ],
    },
    {
      id: 'orders',
      title: 'Orders',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>
          <path d="M12 22V12"></path>
          <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"></path>
          <path d="m7.5 4.27 9 5.15"></path>
        </svg>
      ),
      dropdown: [
        { title: 'Create Order', href: '/dashboard/order/create' },
        { title: 'Order List', href: '/dashboard/order/list' },
      ],
    },
    {
      id: 'createServices',
      title: 'Create Services',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="8" height="8" x="3" y="3" rx="2"></rect>
          <path d="M7 11v4a2 2 0 0 0 2 2h4"></path>
          <rect width="8" height="8" x="13" y="13" rx="2"></rect>
        </svg>
      ),
      href: '/dashboard/services',
    },
    {
      id: 'products',
      title: 'Products',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      ),
      dropdown: [
        { title: 'Create Product', href: '/dashboard/products/create' },
        { title: 'Product List', href: '/dashboard/products/list' },
      ],
    },
    {
      id: 'files',
      title: 'Files',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
          <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
          <path d="M10 9H8"></path>
          <path d="M16 13H8"></path>
          <path d="M16 17H8"></path>
        </svg>
      ),
      href: '/dashboard/files',
    },
    // {
    //   id: 'comments',
    //   title: 'Comments',
    //   icon: (
    //     <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //       <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    //     </svg>
    //   ),
    //   href: '/dashboard/comments',
    // },
  ];

  const teamDashboardsItems = [
    {
      id: 'design',
      title: 'Design Team',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
        </svg>
      ),
      href: '/dashboard/team/design',
    },
    {
      id: 'embroidery',
      title: 'Embroidery Team',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
        </svg>
      ),
      href: '/dashboard/team/embroidery',
    },
    {
      id: 'dtf',
      title: 'DTF Team',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"></path>
          <rect x="6" y="14" width="12" height="8" rx="1"></rect>
        </svg>
      ),
      href: '/dashboard/team/dtf',
    },
    {
      id: 'sublimation',
      title: 'Sublimation Team',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2"></rect>
          <line x1="8" x2="16" y1="21" y2="21"></line>
          <line x1="12" x2="12" y1="17" y2="21"></line>
        </svg>
      ),
      href: '/dashboard/team/sublimation',
    },
    {
      id: 'production',
      title: 'Production Team',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      href: '/dashboard/team/production',
    },
  ];

  const otherMenuItems = [
    {
      id: 'settings',
      title: 'Settings',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      dropdown: [
        { title: 'Create Stage', href: '/dashboard/stage', icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
          <path d="M12 8v8"></path>
        </svg>
      ) },
        { title: 'Create Workflow', href: '/dashboard/workflow', icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="18" r="3"></circle>
          <circle cx="6" cy="6" r="3"></circle>
          <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
          <line x1="6" x2="6" y1="9" y2="21"></line>
        </svg>
      ) },
      ],
    },
    {
      id: 'bigscreen',
      title: 'BigScreen',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="3" rx="2"></rect>
          <line x1="8" x2="16" y1="21" y2="21"></line>
          <line x1="12" x2="12" y1="17" y2="21"></line>
        </svg>
      ),
      href: '/dashboard/bigscreen',
    },
    {
      id: 'calender',
      title: 'Calender',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
      ),
      href: '/dashboard/calender',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
        </svg>
      ),
      href: '/dashboard/notifications',
    },
    {
      id: 'user-management',
      title: 'User Management',
      icon: (
        <svg className="w-6 h-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
        </svg>
      ),
      href: '/dashboard/user-management',
    },
  ];

  const isDropdownActive = (dropdownItems) => {
    return dropdownItems.some((subItem) => pathname === subItem.href);
  };

  const renderMenuItems = (items) => {
    return items.map((item) => (
      <div key={item.id}>
        {item.dropdown ? (
          <div>
            <button
              onClick={() => toggleDropdown(item.id)}
              className={`flex items-center justify-between w-full px-3.5 py-3 rounded-lg text-[16px] cursor-pointer ${
                isDropdownActive(item.dropdown)
                  ? 'bg-[rgba(87,80,241,0.07)] text-[#5750f1]'
                  : 'text-[#4b5563] hover:bg-gray-100 hover:text-black'
              }`}
            >
              <div className="flex items-center">
                {item.icon}
                {item.title}
              </div>
              <svg
                className={`w-4 h-4 transform ${openDropdowns[item.id] ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {openDropdowns[item.id] && (
              <div className="pl-8 space-y-2 mt-2">
                {item.dropdown.map((subItem, index) => (
                  <Link
                    key={index}
                    href={subItem.href}
                    className={`flex items-center px-3.5 py-3 rounded-lg text-[16px] ${
                      pathname === subItem.href
                        ? 'bg-[rgba(87,80,241,0.07)] text-[#5750f1]'
                        : 'text-[#4b5563] hover:bg-gray-100 hover:text-black'
                    }`}
                    onClick={() => toggleSidebar()}
                  >
                    {subItem.icon}
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link
            href={item.href}
            className={`flex items-center px-3.5 py-3 rounded-lg text-[16px] ${
              pathname === item.href
                ? 'bg-[rgba(87,80,241,0.07)] text-[#5750f1]'
                : 'text-[#4b5563] hover:bg-gray-100 hover:text-black'
            }`}
            onClick={() => toggleSidebar()}
          >
            {item.icon}
            {item.title}
          </Link>
        )}
      </div>
    ));
  };

  return (
    <div
      className={`fixed top-0 left-0 w-[290px] h-full bg-white border-r-[1px] border-[#e5e7eb] transform lg:transform-none transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 z-20 flex flex-col`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between py-[30px] bg-white text-black px-4 shrink-0">
        <h1 className="text-[28px] font-bold text-[#111928] flex items-center gap-2">
          <FaPrint color='#5750f1' />
          Print Shop
        </h1>
        <button onClick={toggleSidebar} className="lg:hidden text-black">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      {/* Sidebar Menu with Custom Scrollbar */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#5750f1] scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
        <nav className="space-y-2">
          <h2 className="text-[14px] text-[#4b5563] mb-4 uppercase">Main Menu</h2>
          {renderMenuItems(mainMenuItems)}
          <h2 className="text-[14px] text-[#4b5563] mb-4 uppercase mt-4">Team Dashboards</h2>
          {renderMenuItems(teamDashboardsItems)}
          <h2 className="text-[14px] text-[#4b5563] mb-4 uppercase mt-4">Other</h2>
          {renderMenuItems(otherMenuItems)}
        </nav>
      </div>
    </div>
  );
}
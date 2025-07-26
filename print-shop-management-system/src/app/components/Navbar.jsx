'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar({ toggleSidebar }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.email) {
        setEmail(decoded.email);
      }
    }
  }, []);

  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = atob(base64);
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <div className="fixed top-0 left-0 lg:left-[290px] right-0 bg-white flex items-center justify-between px-4 z-10 py-7 border-b-[2px] border-[#e5e7eb] md:px-5 2xl:px-10">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden text-gray-600 hover:text-[#5750f1]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <h2 className="text-[28px] font-bold text-[#111928]">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        {/* Notification Icon */}
        <button className="text-gray-600 hover:text-[#5750f1] bg-gray-100 w-[50px] h-[50px] rounded-full flex items-center justify-center border-[#e5e7eb] border-[1px]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>
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
                {email || 'No email'}
              </div>
              <Link href="/dashboard/user-management" className="block px-4 py-2 text-gray-700 hover:bg-[rgba(87,80,241,0.07)] hover:text-[#5750f1]">
                User Management
              </Link>
              <button
                onClick={() => {
                  sessionStorage.removeItem('authToken'); // Fixed: Match key used in LoginIn component
                  window.location.href = '/auth/login';
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
  );
}
"use client";
import React, { useState } from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import UserCard from '@/app/components/UserManagement/UserCard';
import RoleCard from '@/app/components/UserManagement/RoleCard';
import AddUserPopup from '@/app/components/UserManagement/AddUserPopup';

export default function UserManagementPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [refreshUsers, setRefreshUsers] = useState(0);

  const handleUserCreated = () => {
    setRefreshUsers((prev) => prev + 1);
  };

  return (
    <div className="p-6">
      <Breadcrumbs pageName="User Management" />
      <UserCard />
      <div className="pt-6 flex justify-end">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-[#5750f1] text-white py-[13px] px-[35px] rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center cursor-pointer gap-1"
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
            className="text-white"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User
        </button>
      </div>
      <AddUserPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onUserCreated={handleUserCreated}
      />
      <div className="py-6">
        <RoleCard onUserUpdated={refreshUsers} />
      </div>
    </div>
  );
}
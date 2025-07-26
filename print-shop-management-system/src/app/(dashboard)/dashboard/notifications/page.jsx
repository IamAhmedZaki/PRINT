'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Notification from '@/app/components/Notification/Notification';
import React from 'react';

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Notification" />
      <Notification />
    </div>
  );
}
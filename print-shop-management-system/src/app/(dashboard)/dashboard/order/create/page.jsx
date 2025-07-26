'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import CreateOrder from '@/app/components/CreateOrder/Create';
import React from 'react';

export default function OrderCreatePage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Create Order" />
      <CreateOrder />
    </div>
  );
}
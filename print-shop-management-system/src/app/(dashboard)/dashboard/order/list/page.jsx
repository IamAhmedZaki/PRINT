'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import OrderList from '@/app/components/CreateOrder/OrderList';
import React from 'react';

export default function OrderListPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Order List" />
      <OrderList />
    </div>
  );
}
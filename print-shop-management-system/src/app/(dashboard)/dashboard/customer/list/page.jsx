'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import CustomerList from '@/app/components/CreateCustomer/CustomerList';
import React from 'react';

export default function CustomerListPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Customer List" />
      <CustomerList />
    </div>
  );
}
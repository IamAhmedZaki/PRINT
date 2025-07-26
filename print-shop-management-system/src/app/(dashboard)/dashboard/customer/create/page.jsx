'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Create from '@/app/components/CreateCustomer/Create';
import React from 'react';

export default function CustomerCreatePage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Create Customer" />
      <Create />
    </div>
  );
}
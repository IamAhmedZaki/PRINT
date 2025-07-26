'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Services from '@/app/components/Services/Services';
import React from 'react';

export default function ServicesPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Services" />
      <Services />
    </div>
  );
}
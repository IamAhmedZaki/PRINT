'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Design from '@/app/components/Team/Design/Design';
import React from 'react';

export default function DesignPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Design" />
      <Design />
    </div>
  );
}
'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Production from '@/app/components/Team/Production/Production';
import React from 'react';

export default function ProductionPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Production" />
      <Production />
    </div>  
  );
}
'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Sublimation from '@/app/components/Team/Sublimation/Sublimation';
import React from 'react';

export default function SublimationPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Sublimation" />
      <Sublimation />
    </div>
  );
}
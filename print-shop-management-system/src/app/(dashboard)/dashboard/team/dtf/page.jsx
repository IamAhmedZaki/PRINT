'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import DTF from '@/app/components/Team/DTF/DTF';
import React from 'react';

export default function DTFPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="DTF" />
      <DTF />
    </div>
  );
}
'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Stage from '@/app/components/Stage/Stage';
import React from 'react';

export default function StagePage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Create Stage" />
      <Stage />
    </div>
  );
}
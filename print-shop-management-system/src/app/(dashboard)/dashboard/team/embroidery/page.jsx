'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Embroidery from '@/app/components/Team/Embroidery/Embroidery';
import React from 'react';

export default function EmbroideryPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Embroidery" />
      <Embroidery />
    </div>
  );
}
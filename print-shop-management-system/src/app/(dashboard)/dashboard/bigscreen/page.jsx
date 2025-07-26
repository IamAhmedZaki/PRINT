'use client';
import BigScreen from '@/app/components/BigScreen/BigScreen';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import React from 'react';

export default function BigScreenPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Big Screen" />
      <BigScreen />
    </div>
  );
}
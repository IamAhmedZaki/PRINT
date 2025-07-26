'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Files from '@/app/components/Files/Files';
import React from 'react';

export default function FilesPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Files" />
      <Files />
    </div>
  );
}
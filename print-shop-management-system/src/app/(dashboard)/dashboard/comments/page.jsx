'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs';
import Comments from '@/app/components/Comments/Comments';
import React from 'react';

export default function CommentsPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Comments" />
      <Comments />
    </div>
  );
}
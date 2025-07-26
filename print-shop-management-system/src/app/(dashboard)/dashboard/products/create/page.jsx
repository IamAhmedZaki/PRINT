'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs'
import CreateProduct from '@/app/components/CreateProduct/Create'
import React from 'react'

function CreateProductsPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Create Product" />
      <CreateProduct />
    </div>
  )
}

export default CreateProductsPage
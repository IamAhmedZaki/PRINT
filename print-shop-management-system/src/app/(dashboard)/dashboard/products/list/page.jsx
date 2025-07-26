'use client';
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs'
import ProductList from '@/app/components/CreateProduct/ProductList'
import React from 'react'

function ProductsListPage() {
  return (
    <div className="p-6">
      <Breadcrumbs pageName="Product List" />
      <ProductList />
    </div>
  )
}

export default ProductsListPage
import Breadcrumbs from '@/app/components/Breadcrumbs/Breadcrumbs'
import Calender from '@/app/components/Calender/Calender'
import React from 'react'

function CalenderPage() {
  return (
     <div className="p-6">
      <Breadcrumbs pageName="Calender" />
      <Calender />
    </div>
  )
}

export default CalenderPage
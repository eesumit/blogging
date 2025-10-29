import React from 'react'
import SideNavbar from '@/components/SideNavbar'
const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex w-screen'>
      <div className='fixed left-0 top-0 bg-background text-foreground w-[15%] h-screen border-r border-border z-10'><SideNavbar/></div>
      <div className='ml-[15%] w-[85%] min-h-screen overflow-y-auto'>{children}</div>
    </div>
    
  )
}

export default layout
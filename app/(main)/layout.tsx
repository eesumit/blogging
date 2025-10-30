'use client';
import React from 'react';
import SideNavbar from '@/components/SideNavbar';
import MobileNavbar from '@/components/MobileNav';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-screen min-h-screen">
      {/* Sidebar — only visible on medium+ screens */}
      <div className="hidden md:fixed md:left-0 md:top-0 md:flex bg-background text-foreground w-[15%] h-screen border-r border-border z-10">
        <SideNavbar />
      </div>

      {/* Main content area */}
      <div className="flex-1 w-full md:ml-[15%] md:w-[85%] min-h-screen overflow-y-auto px-3 md:px-8 pb-20 md:pb-0">
        {children}
      </div>

      {/* Bottom navbar — only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Layout;

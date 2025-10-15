"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1">
        {/* You can add title or breadcrumbs here if needed */}
      </div>
      <div>
        {/* You can add user menu or other actions here */}
      </div>
    </header>
  )
}

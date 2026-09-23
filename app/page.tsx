"use client"

import { useState } from "react"

import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"

/** Renders the editor workspace and controls project sidebar visibility. */
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background">
      <EditorNavbar
        sidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />
      <main className="relative flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </main>
    </div>
  )
}

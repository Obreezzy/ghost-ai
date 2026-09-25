import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

<<<<<<< HEAD
export default async function Home() {
  const { isAuthenticated } = await auth();
  redirect(isAuthenticated ? "/editor" : "/sign-in");
}
=======
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
>>>>>>> 8a552f859dcd09ac0f489fb2ce1fa1ef98ac5125

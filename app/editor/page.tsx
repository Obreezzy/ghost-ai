"use client"

import { useState } from "react"

import { EditorHome } from "@/components/editor/editor-home"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

export default function Editor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const {
    projects,
    activeDialog,
    selectedProject,
    formName,
    slugPreview,
    isLoading,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    onDialogOpenChange,
    setFormName,
    submitCreate,
    submitRename,
    submitDelete,
  } = useProjectDialogs()

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
          projects={projects}
          onCreateProject={openCreateDialog}
          onRenameProject={openRenameDialog}
          onDeleteProject={openDeleteDialog}
        />
        <EditorHome onCreateProject={openCreateDialog} />
      </main>
      <ProjectDialogs
        activeDialog={activeDialog}
        selectedProject={selectedProject}
        formName={formName}
        slugPreview={slugPreview}
        isLoading={isLoading}
        onOpenChange={onDialogOpenChange}
        onClose={closeDialog}
        onFormNameChange={setFormName}
        onSubmitCreate={submitCreate}
        onSubmitRename={submitRename}
        onSubmitDelete={submitDelete}
      />
    </div>
  )
}

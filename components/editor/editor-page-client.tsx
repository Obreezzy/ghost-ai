"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { EditorHome } from "@/components/editor/editor-home"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"
import type { Project } from "@/types/project"

interface EditorPageClientProps {
  initialOwnedProjects: Project[]
  initialSharedProjects: Project[]
}

export function EditorPageClient({
  initialOwnedProjects,
  initialSharedProjects,
}: EditorPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const activeProjectId = searchParams.get("projectId")

  const initialProjects = useMemo(
    () => [...initialOwnedProjects, ...initialSharedProjects],
    [initialOwnedProjects, initialSharedProjects]
  )

  const { projects, activeDialog, selectedProject, formName, slugPreview, isLoading, openCreateDialog, openRenameDialog, openDeleteDialog, closeDialog, onDialogOpenChange, setFormName, submitCreate, submitRename, submitDelete } = useProjectDialogs({
    initialProjects,
    activeProjectId,
    onProjectCreated: (project) => {
      router.push(`/editor?projectId=${project.id}`)
    },
    onProjectDeleted: (projectId, deletedActiveProject) => {
      if (deletedActiveProject) {
        router.push("/editor")
        return
      }
      router.refresh()
    },
    onProjectRenamed: () => {
      router.refresh()
    },
  })

  const ownedProjects = useMemo(
    () => projects.filter((project) => project.role === "owner"),
    [projects]
  )
  const sharedProjects = useMemo(
    () => projects.filter((project) => project.role === "collaborator"),
    [projects]
  )

  useEffect(() => {
    if (activeProjectId && !projects.some((project) => project.id === activeProjectId)) {
      router.replace("/editor")
    }
  }, [activeProjectId, projects, router])

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
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
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
